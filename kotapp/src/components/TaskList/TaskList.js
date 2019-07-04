import React, { Component } from "react";
import fire from "../../config/fire";

import "./TaskList.css";

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.searchTasks = this.searchTasks.bind(this);
    this.addTask = this.addTask.bind(this);
    this.state = {
      uid: props.uid,
      tasks: [],
      selector: props.selector,
      selectedTask: null
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.history.push("/login");
      } else {
        this.setState({
          uid: user.uid
        })
        this.searchTasks();
      }
    });
  }

  searchTasks() {
    var kotID = localStorage.getItem("kotID");
    var tasks = [];
    if (this.state.selector === 'PlannedTasks') {
      fire
        .firestore()
        .collection("/Koten")
        .doc("/" + kotID)
        .collection("/WeeklyTasks")
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            let string = JSON.stringify(doc.data())
            if (!string.includes(this.state.uid)) {
              tasks.push(doc);
            }
          });
        })
        .then(() => {
          fire
            .firestore()
            .collection("/Koten")
            .doc("/" + kotID)
            .collection("/PlannedTasks")
            .where('UserUid', "==", this.state.uid)
            .get()
            .then(snapshot => {
              snapshot.docs.forEach(doc => {
                //filter out the passed tasks
                if (doc.data().date.seconds * 1000 > new Date().getTime() - 86400000) {
                  tasks.push(doc);
                }
              });
              this.setState({ tasks: tasks });
            });
        });
    } else {
      fire
        .firestore()
        .collection("/Koten")
        .doc("/" + kotID)
        .collection("/" + this.state.selector)
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            tasks.push(doc);
          });
          this.setState({ tasks: tasks });
        })
    }

    // if (tasks.length === 0) {
    //   tasks = JSON.parse(localStorage.getItem(this.state.selector));
    // }


  }

  addTask(e, task) {
    e.preventDefault();
    if (this.state.selector === "GeneralTasks") {
      window.location.href = window.location.href + "/AddGeneralTasks";
    } else if (this.state.selector === "PlannedTasks") {
      window.location.href = window.location.href + "/AddWeeklyTasks";
    }
  }

  taskClick(task) {
    console.log(task.data());
    if (task.data().date === undefined) {
      console.log(this.state.selector)
      if (this.state.selector === "GeneralTasks") {
        window.location.href = window.location.origin + "/GeneralTasks/" + task.id;
      } else if (this.state.selector === "PlannedTasks") {
        window.location.href = window.location.href + "/WeeklyTask/" + task.id + "/plan";
      }
    } else {
      window.location.href = window.location.origin + "/PlannedTasks/" + task.id;
    }
  }

  render() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let name = null
    if (this.state.selector === "GeneralTasks") name = 'General tasks';
    if (this.state.selector === "PlannedTasks") name = 'Your personal tasks';
    return (
      <div className="tasklist">
        <h2>{name}</h2>
        <div className="takslist-content">
          <ul>
            {this.state.tasks.map(task => {
              return (
                <li onClick={() => this.taskClick(task)}>
                  <div />
                  <p>{task.data().Name} {(task.data().date) ? ' - ' + days[task.data().date.toDate().getDay()] : ''} {(task.data().monday || task.data().thursday || task.data().wednesday || task.data().tuesday || task.data().friday) ? ' - inplannen' : ''}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <button
          onClick={this.addTask}
          className="btn-small btn-secondary material-icons"
          id="add_task"
        >
          add
        </button>
      </div >
    );
  }
}

export default TaskList;
