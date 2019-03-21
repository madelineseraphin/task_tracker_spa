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
            session: null,
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
            },
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
                let state1 = _.assign({}, this.state, { session: resp.data });
                this.setState(state1);
            }
        });
    }

    update_login_form(data) {
        let form1 = _.assign({}, this.state.login_form, data);
        let state1 = _.assign({}, this.state, { login_form: form1 });
        this.setState(state1);
    }

    render() {
        return (<div>
            <Router>
                <div>
                    <Header root={this} />
                    <Route path="/" exact={true} render={() =>
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
    let { root, session } = props;
    let session_info;
    if (session == null) {
        session_info = <div className="form-inline my-2">
            <input type="email" placeholder="email"
                onChange={(ev) => root.update_login_form({ email: ev.target.value })} />
            <input type="password" placeholder="password"
                onChange={(ev) => root.update_login_form({ password: ev.target.value })} />
            <button className="btn btn-secondary" onClick={() => root.login()}>Login</button>
        </div>;
    }
    else {
        session_info = <div className="my-2">
            <p>Logged in as {session.user_id}</p>
        </div>
    }

    return <div className="row my-2">
        <div className="col-6">
            <h1>Husky Shop</h1>
        </div>
        <div className="col-6">
            {session_info}
        </div>
    </div>;
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