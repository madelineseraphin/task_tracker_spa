import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import api from './api';

export default function root_init(node) {
    ReactDOM.render(<Root />, node);
}

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login_form: {
                email: "",
                password_hash: ""
            },
            registration_form: {
                email: "",
                password_hash: ""
            },
            user_form: {
                email: "",
                admin: false,
            },
            task_form: {
                title: "",
                description: "",
                user: null,
                hours: 0.0,
                completed: false
            },
            session: null,
            user: {
                email: "",
                admin: false
            },
            users: this.fetch_users(),
            tasks: this.fetch_tasks()
        };
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

    fetch_current_user(id) {
        $.ajax("/api/v1/users/" + id, {
            method: "get",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: "",
            success: resp => {
              console.log(resp.data);
              let state1 = _.assign({}, this.state, { user: resp.data });
              this.setState(state1);
            }
        });
    }

    update_login_form(data) {
        let form1 = _.assign({}, this.state.login_form, data);
        let state1 = _.assign({}, this.state, { login_form: form1 });
        this.setState(state1);
    }

    login() {
        $.ajax("/api/v1/auth", {
            method: "post",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(this.state.login_form),
            success: (resp) => {
                let state1 = _.assign({}, this.state, { session: resp.data, loginError: null });
                console.log(resp);
                return this.setState(state1, () => this.fetch_current_user(resp.data.user_id));
            },
            error: (error) => {
                console.log(error);
                return this.setState({loginError: "Login error. Please try again."});
            }
        });
    }

    logout() {
        return this.setState({
            login_form: { email: "", password_hash: "" },
            registration_form: { email: "", password_hash: "" },
            user_form: { email: "", admin: false },
            task_form: { title: "", description: "", user: null, hours: 0.0, completed: false },
            session: null,
            user: { email: "", admin: false }
        })
    }

    update_registration_form(data) {
        let form1 = _.assign({}, this.state.registration_form, data);
        let state1 = _.assign({}, this.state, { registration_form: form1 });
        this.setState(state1);
    }

    register() {
        $.ajax("/api/v1/users", {
            method: "post",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify({ user: this.state.registration_form }),
            success: (resp) => {
                console.log(resp);
                let state1 = _.assign({}, this.state, { session: resp.data, registrationError: null });
                return this.setState(state1, () => this.fetch_current_user(resp.data.id));
            },
            error: (error) => {
                console.log(error);
                return this.setState({registrationError: "Registration error. Please try again."});
            }
        }); 
    }

    update_task_form(data) {
        let form1 = _.assign({}, this.state.task_form, data);
        let state1 = _.assign({}, this.state, { task_form: form1 });
        this.setState(state1);
    }

    create_task() {
        let task = this.state.task_form;
        $.ajax("/api/v1/tasks", {
            method: "post",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify({ task: task }),
            success: resp => {
                console.log(resp.data);
                this.fetch_tasks();
            }
        });
    }

    update_task() {
        let task = this.state.task_form;
        $.ajax("/api/v1/tasks/" + task.id, {
            method: "put",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify({ id: task.id, task: task }),
            success: (resp) => {
                console.log(resp.data);
                this.fetch_tasks();
            }
        });
    }

    get_task(id) {
        $.ajax("/api/v1/tasks/" + id, {
            method: "get",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: "",
            success: resp => {
              console.log(resp.data);
              let state1 = _.assign({}, this.state, { task_form: resp.data });
              this.setState(state1);
            }
        });
    }

    delete_task(id) {
        $.ajax("/api/v1/tasks/" + id, {
            method: "delete",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: "",
            success: resp => {
              console.log(resp.data);
              this.fetch_tasks();
            }
        });
    }

    update_user() {
        let user = this.state.user_form;
        $.ajax("/api/v1/tasks/" + user.id, {
            method: "put",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify({ id: user.id, user: user }),
            success: (resp) => {
                console.log(resp.data);
                this.fetch_users();
            }
        });
    }

    get_user(id) {
        $.ajax("/api/v1/users/" + id, {
            method: "get",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: "",
            success: resp => {
              console.log(resp.data);
              let state1 = _.assign({}, this.state, { user_form: resp.data });
              this.setState(state1);
            }
        });
    }

    delete_user(id) {
        $.ajax("/api/v1/users/" + id, {
            method: "delete",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: "",
            success: resp => {
              console.log(resp.data);
              this.fetch_users();
            }
        });
    }

    render() {
        return (<div>
            <Router>
                <div>
                    <Header root={this} />
                    <Route path="/" exact={true} render={() =>
                        <HomePage root={this} />
                    } />
                    <Route path="/tasks" exact={true} render={() =>
                        <TaskList tasks={this.state.tasks} />
                    } />
                    <Route path="/task/:id" exact={true} render={() =>
                        <TaskView task={this.get_task(id)} />
                    } />
                    <Route path="/task/edit/:id" exact={true} render={() =>
                        <TaskEdit task={this.get_task(id)} />
                    } />
                    <Route path="/users" exact={true} render={() =>
                        <UserList users={this.state.users} />
                    } />
                    <Route path="/user/:id" exact={true} render={() =>
                        <UserView task={this.get_user(id)} />
                    } />
                    <Route path="/user/edit/:id" exact={true} render={() =>
                        <UserEdit task={this.get_user(id)} />
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
                onChange={(ev) => root.update_login_form({ password_hash: ev.target.value })} />
            <button className="btn btn-secondary" onClick={() => root.login()}>Login</button>
        </div>;
    }
    else {
        session_info = <div className="my-2">
            <p>{root.state.user.email} | 
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
    let currentEmail = root.state.user.email;
    if (currentEmail) {
        return <div><h2>Welcome {currentEmail}</h2></div>
    } else {
        return <div>
            <p className="alert">{root.state.loginError}</p>
            <h2>Create an account</h2>
            <input type="email" placeholder="Email" className="form-control"
                onChange={(ev) => root.update_registration_form({ email: ev.target.value })} />
            <input type="password" placeholder="Password" className="form-control"
                onChange={(ev) => root.update_registration_form({ password_hash: ev.target.value })} />
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
    let status = 'Not Started';
    if (task.complete) {
        status = "Completed!";
    }
    if (!task.complete && task.hours > 0.0) {
        status = "In progress";
    }
    return (
        <div className="card col-12">
      <div className="card-body">
        <div className="row">
          <div className="col-8">
            <Link to={"/task/" + task.id}>{task.title}</Link>
          </div>
          <div className="col-2">
            {status}
          </div>
          <div className="col-2">
            <Link className="btn btn-info" to={"/task/edit/" + task.id}>Edit</Link>
            <Link className="btn btn-danger" to={"/task/delete/" + task.id}>Delete</Link>
          </div>
        </div>
      </div>
    </div>
    )
}

function TaskView(props) {
    let { task } = props;
    let assignee = task.user_id ? task.user_id : 'Unassigned'
    return (
    <ul>
        <li>
            <strong>Title:</strong> {task.title}
        </li>
        <li>
            <strong>Description:</strong> {task.description}
        </li>

        <li>
            <strong>Assignee:</strong> {assignee}
        </li>

        <li>
            <strong>Hours:</strong> {task.hours}
        </li>

        <li>
            <strong>Complete:</strong> {task.complete}
        </li>

    </ul>
    )
}

function TaskEdit(props) {
    let { task } = props;
    let assignee = task.user_id ? task.user_id : 'Unassigned'
    return (<div>
        <div className="form-group">
            <label>Title</label>
            <input type="text" className="form-control" 
                onChange={(ev) => root.update_task_edit_form({ title: ev.target.value })}/>
        </div>

        <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" 
                onChange={(ev) => root.update_task_edit_form({ description: ev.target.value })}/>
        </div>

        <div className="form-group">
            <label>Assignee</label>
            <select>

            </select>
        </div>

        <div className="form-group">
            <label>Time worked on</label>
            <input type="number" step="0.25" className="formControl" />
        </div>

        <div className="form-group">
            <input type="check" className="formControl" />
        </div>

    </div>)
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