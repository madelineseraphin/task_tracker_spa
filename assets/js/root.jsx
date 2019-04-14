import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

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
            task_form: {
                id: "",
                title: "",
                description: "",
                hours: 0.0,
                complete: false,
                user_id: ""
            },
            session: null,
            user: {
                id: "",
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
                return this.setState(state1, () => this.fetch_current_user(resp.data.user_id));
            },
            error: (error) => {
                return this.setState({loginError: "Login error. Please try again."});
            }
        });
    }

    logout() {
        return this.setState({
            login_form: { email: "", password_hash: "" },
            registration_form: { email: "", password_hash: "" },
            user_form: { email: "", admin: false },
            task_form: { id: "", title: "", description: "", user_id: "", hours: 0.0, complete: false },
            session: null,
            user: { id: "", email: "", admin: false }
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
                let state1 = _.assign({}, this.state, { session: resp.data, registrationError: null });
                return this.setState(state1, () => this.fetch_current_user(resp.data.id));
            },
            error: (error) => {
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
              this.fetch_tasks();
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
              this.fetch_users();
            }
        });
    }

    get_user_tasks(user_id) {
        let tasks = this.state.tasks;
        let myTasks = _.filter(tasks, function(t){ return t.user_id === user_id });
        return myTasks;
    }

    get_user_by_id(user_id) {
        let users = this.state.users;
        let user = _.filter(users, function(u){ return u.id === user_id });
        return user;
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
                        <TaskPage tasks={this.state.tasks} root={this} />
                    } />
                    <Route path="/tasks/view" exact={true} render={() =>
                        <TaskView root={this} />
                    } />
                    <Route path="/tasks/edit" exact={true} render={() =>
                        <TaskEdit root={this} />
                    } />
                    <Route path="/users" exact={true} render={() =>
                        <UserList users={this.state.users} root={this} />
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
        session_info = <div className="form-inline col-12">
            <input type="email" placeholder="Email" className="form-control"
                onChange={(ev) => root.update_login_form({ email: ev.target.value })} />
            <input type="password" placeholder="Password" className="form-control"
                onChange={(ev) => root.update_login_form({ password_hash: ev.target.value })} />
            <button className="btn btn-secondary" onClick={() => root.login()}>Login</button>
        </div>;
    }
    else {
        session_info = <div className="row col-12">
            <div className="col-4">
                <Link to={"/tasks"}><span className="navHeader">Tasks</span></Link>
            </div>
            <div className="col-4">
                <Link to={"/users"}><span className="navHeader">Users</span></Link>
            </div>
            <div className="col-4">
                {root.state.user.email} | 
                <Link to={"/"} onClick={() => root.logout()}> Logout</Link>
            </div>
        </div>
    }

    return <div className="row my-2">
        <div className="col-4">
            <h1><Link to={"/"}>Task Tracker</Link></h1>
        </div>
        <div className="col-8 row">
            {session_info}
        </div>
    </div>;
}

function HomePage(props) {
    let { root } = props;
    let currentEmail = root.state.user.email;
    if (currentEmail) {
        return (
            <div>
                <h2>Welcome {currentEmail}</h2>
                <h3>My tasks</h3>
                <TaskList tasks={root.get_user_tasks(root.state.user.id)} root={root} />
            </div>
        )
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

function TaskPage(props) {
    let task = {
        id: "",
        title: "",
        description: "",
        hours: 0.0,
        complete: false,
        user_id: ""
    };
    return (
    <span>
        <Link to={"/tasks/edit"} onClick={() => root.update_task_form(task)}> <button className="btn btn-primary">Add Task</button></Link>
        <TaskList root={props.root} tasks={props.tasks} />
    </span>
    );
}

function TaskList(props) {
    let root = props.root;
    let tasks = props.tasks;
    let tasksShown = _.map(tasks, (t) => <Task key={t.id} task={t} root={root}/>);
    return (
    <div>
    <div className="row">
        {tasksShown}
    </div>
    </div>);
}

function Task(props) {
    let task = props.task;
    let root = props.root;
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
            <Link to={"/tasks/view"} onClick={() => root.update_task_form(task)}>{task.title}</Link>
          </div>
          <div className="col-2">
            {status}
          </div>
          <div className="col-2">
            <Link className="btn btn-info" to={"/tasks/edit"} onClick={() => root.update_task_form(task)}>Edit</Link>
            <Link className="btn btn-danger" to={"/tasks"} onClick={() => root.delete_task(task.id)}>Delete</Link>
          </div>
        </div>
      </div>
    </div>
    )
}

function TaskView(props) {
    let { root } = props;
    let task = root.state.task_form;
    let assignee = task.user_id ? root.get_user_by_id(task.user_id).email : 'Unassigned'
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
        <div>
            <Link className="btn btn-info" to={"/tasks/edit"} onClick={() => root.update_task_form(task)}>Edit</Link>
            <Link className="btn btn-danger" to={"/tasks"} onClick={() => root.delete_task(task.id)}>Delete</Link>
        </div>
    </ul>
    )
}

function TaskEdit(props) {
    let { root } = props;
    let task = root.state.task_form;
    let taskTitle, taskButton;
    if (task.id) {
        taskTitle = "Edit Task";
        taskButton = <Link to={"/tasks"}><button onClick={() => root.update_task()} className="btn btn-primary">Save</button></Link>
    } else {
        taskTitle = "New Task";
        taskButton = <Link to={"/tasks"}><button onClick={() => root.create_task()} className="btn btn-primary">Save</button></Link>
    }
    let users = root.state.users;
    let assigneeOptions = _.map(users, (u) => 
        <option key={u.id} value={u.id}>
            {u.email}
        </option>);
    let currentAssigneeOptions;
    if (task.user_id && task.user_id == root.state.user.id) {
        currentAssigneeOptions = 
        <div>
            <div className="form-group">
                <label>Hours worked on</label>
                <input type="number" step="0.25" className="form-control" value={task.hours}
                    onChange={(ev) => root.update_task_form({ hours: ev.target.value })}/>
            </div>

            <div className="form-group">
                <label>Complete?</label>
                <input type="checkbox" className="form-control" checked={task.complete}
                    onChange={(ev) => root.update_task_form({ complete: !task.complete })} />
            </div>
        </div>;
    }
    return (<div className="container">
        <h1>{taskTitle}</h1>
        <div className="row">
        <form className="col-12">

        <div className="form-group">
            <label>Title</label>
            <input type="text" className="form-control" value={task.title}
                onChange={(ev) => root.update_task_form({ title: ev.target.value })}/>
        </div>

        <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" value={task.description}
                onChange={(ev) => root.update_task_form({ description: ev.target.value })}/>
        </div>

        <div className="form-group">
            <label>Assignee</label>
            <select className="form-control" value={task.user_id} 
                onChange={(ev) => root.update_task_form({ user_id: ev.target.value })} >
                <option value="">Unassigned</option>
                {assigneeOptions}
            </select>
        </div>

        {currentAssigneeOptions}
    </form>
    <Link to={"/tasks"}><button className="btn btn-secondary">Cancel</button></Link>
    {taskButton}
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