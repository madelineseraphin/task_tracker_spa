import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

export default function root_init(node) {
    let tasks = window.tasks;
    ReactDOM.render(<Root tasks={tasks} />, node);
}

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login_form: {email: "", password: ""},
            registration_form: {email: "", password: ""},
            session: null,
            currentEmail: null,
            users: [],
            tasks: props.tasks,
        };

        //this.fetch_products();
    }

    fetch_tasks() {
        $.ajax("/api/v1/tasks", {
            method: "get",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: "",
            success: (resp) => {
                let state1 = _.assign({}, this.state, { tasks: resp.data });
                this.setState(state1);
            }
        });
    }

    fetch_users() {
        $.ajax("/api/v1/users", {
            method: "get",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: "",
            success: (resp) => {
                let state1 = _.assign({}, this.state, { users: resp.data });
                this.setState(state1);
            },
        });
    }

    login() {
        $.ajax("/api/v1/auth", {
            method: "post",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(this.state.login_form),
            success: (resp) => {
                let currentEmail = this.state.login_form.email;
                let state1 = _.assign({}, this.state, { session: resp.data, currentEmail: currentEmail, loginError: null });
                console.log(resp);
                return this.setState(state1);
            },
            error: (error) => {
                console.log(error);
                if (error.responseText.includes("email")) {
                    return this.setState({loginError: "Incorrect email."});
                }
                else if (error.responseText.includes("auth")) {
                    return this.setState({loginError: "Incorrect password."});
                }
                else {
                    return this.setState({loginError: "Login error. Please try again."});
                }
            }
        });
    }

    logout() {
        return this.setState({
            login_form: {email: "", password: ""},
            registration_form: {email: "", password: ""},
            session: null,
            currentEmail: null,
            users: [],
            tasks: []
        })
    }

    update_login_form(data) {
        let form1 = _.assign({}, this.state.login_form, data);
        let state1 = _.assign({}, this.state, { login_form: form1 });
        this.setState(state1);
    }

    register() {
        let userData = this.state.registration_form,
            user = JSON.stringify({user: {email: userData.email, password: userData.password}});
        $.ajax("/api/v1/users", {
            method: "post",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: user,
            success: (resp) => {
                console.log(resp);
                let currentEmail = this.state.registration_form.email;
                let state1 = _.assign({}, this.state, { session: resp.data, currentEmail: currentEmail, registrationError: null });
                return this.setState(state1);
            },
            error: (error) => {
                if (error.responseText.includes("email")) {
                    return this.setState({registrationError: "Please use a valid email that does not already have an account."});
                }
                else if (error.responseText.includes("password")) {
                    return this.setState({registrationError: "Your password must be at least 7 characters."});
                }
                else {
                    return this.setState({registrationError: "Registration error. Please try again."});
                }
            }
        }); 
    }

    update_registration_form(data) {
        let form1 = _.assign({}, this.state.registration_form, data);
        let state1 = _.assign({}, this.state, { registration_form: form1 });
        this.setState(state1);
    }

    render() {
        return (<div>
            <Router>
                <div>
                    <Header root={this} />
                    <Route path="/" exact={true} render={() =>
                        <HomePage root={this} currentEmail={this.state.currentEmail} />
                    } />
                    <Route path="/tasks" exact={true} render={() =>
                        <TaskList tasks={this.state.tasks} />
                    } />
                    <Route path="/users" exact={true} render={() =>
                        <UserList users={this.state.users} />
                    } />
                </div>
            </Router>
        </div>);
    }
}

function Header(props) {
    let { root } = props;
    let session_info;
    if (root.state.session == null) {
        session_info = <div className="form-inline my-2">
            <input type="email" placeholder="Email" className="form-control"
                onChange={(ev) => root.update_login_form({ email: ev.target.value })} />
            <input type="password" placeholder="Password" className="form-control"
                onChange={(ev) => root.update_login_form({ password: ev.target.value })} />
            <button className="btn btn-secondary" onClick={() => root.login()}>Login</button>
        </div>;
    }
    else {
        session_info = <div className="my-2">
            <p>{root.state.currentEmail} | 
                <a onClick={() => root.logout()}> Logout</a>
            </p>
        </div>
    }

    return <div className="row my-2">
        <div className="col-6">
            <h1>Task Tracker</h1>
        </div>
        <div className="col-6">
            {session_info}
        </div>
    </div>;
}

function HomePage(props) {
    let root = props.root;
    let currentEmail = props.currentEmail;
    if (currentEmail) {
        return <div><h2>Welcome {currentEmail}</h2></div>
    } else {
        return <div>
            <p className="alert">{root.state.loginError}</p>
            <h2>Create an account</h2>
            <input type="email" placeholder="Email" className="form-control"
                onChange={(ev) => root.update_registration_form({ email: ev.target.value })} />
            <input type="password" placeholder="Password" className="form-control"
                onChange={(ev) => root.update_registration_form({ password: ev.target.value })} />
            <button className="btn btn-secondary" onClick={() => root.register()}>Register</button>
            <p className="error">{root.state.registrationError}</p>
        </div>
    }
}

function TaskList(props) {
    let tasks = _.map(props.tasks, (t) => <Task key={t.id} task={t} />);
    return (<div className="row">
        {tasks}
    </div>);
}

function Task(props) {
    let { task } = props;
    return (<div className="card col-4">
        <div className="card-body">
            <h2 className="card-title">{task.title}</h2>
            <p className="card-text">{task.description}</p>
        </div>
    </div>);
}

function UserList(props) {
    let rows = _.map(props.users, (uu) => <User key={uu.id} user={uu} />);
    return <div className="row">
        <div className="col-12">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Admin?</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    </div>;
}

function User(props) {
    let { user } = props;
    return <tr>
        <td>{user.email}</td>
        <td>{user.admin ? "yes" : "no"}</td>
    </tr>;
}