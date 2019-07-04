import React, { Component } from "react";
import fire from "../../config/fire";


import Navigation from "../../components/Navigation/Navigation";
// import "./AddGeneralTask.css";

class PlanWeeklyTask extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.planTasks = this.planTasks.bind(this);
        this.state = {
            days: [],
            taskId: props.match.params.id,
            task: null,
        };
    }

    componentDidMount() {
        fire
            .firestore()
            .collection("/Koten")
            .doc(localStorage.getItem("kotID"))
            .collection("/WeeklyTasks")
            .doc(this.state.taskId)
            .get()
            .then(doc => {
                this.setState({
                    task: doc.data(),
                })
            })
    }

    handleChange(e) {
        if (e.target.type === "checkbox") {
            if (e.target.checked) {
                this.setState({
                    days: this.state.days.concat(e.target.value)
                })
            } else {
                this.setState({
                    days: this.state.days.filter((value, index, arr) => { return value !== e.target.value })
                });
            }
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    handleClick(e) {
        e.preventDefault();
        this.state.days.forEach(day => {
            this.state.task[day].push(fire.auth().currentUser.uid)
        })
        fire
            .firestore()
            .collection('/Koten')
            .doc(localStorage.getItem("kotID"))
            .collection('/WeeklyTasks')
            .doc(this.state.taskId)
            .update(this.state.task)
            .then(() => {
                // this.planTasks();
                window.location.href =
                    window.location.origin +
                    "/kot/" +
                    localStorage.getItem("name") +
                    "-" +
                    localStorage.getItem("number");
            })
    }

    planTasks() {
        //get all the users from all the koten
        let users = {};
        const usersResult = fire
            .firestore()
            .collection("/Users")
            .get();

        usersResult
            .then(snap => {
                snap.forEach(doc => {
                    let user = doc.data();
                    if (user.kotId) {
                        if (users[user.kotId] === undefined) {
                            users[user.kotId] = [];
                        }
                        users[user.kotId].push({ Name: user.Name, Uid: user.Uid });
                    }
                });
            })
            .then(() => {
                console.log(users[localStorage.getItem("kotID")])
                let kotId = localStorage.getItem("kotID");
                let del;
                fire
                    .firestore()
                    .collection("/Koten")
                    .doc("/" + kotId)
                    .collection("/PlannedTasks")
                    .get()
                    .then(snapshot => {
                        snapshot.docs.forEach(doc => {
                            del = fire
                                .firestore()
                                .collection("/Koten")
                                .doc("/" + kotId)
                                .collection("/PlannedTasks")
                                .doc("/" + doc.id)
                                .delete();
                        });
                    })
                    .then(() => {
                        fire
                            .firestore()
                            .collection("/Koten")
                            .doc("/" + kotId)
                            .collection("/WeeklyTasks")
                            .get()
                            .then(snap => {
                                snap.docs.forEach(doc => {
                                    let weeklyTask = doc.data();

                                    //plan the weekly task
                                    let test = [
                                        weeklyTask.monday,
                                        weeklyTask.tuesday,
                                        weeklyTask.wednesday,
                                        weeklyTask.thursday,
                                        weeklyTask.friday
                                    ];
                                    test.forEach((day, index) => {
                                        if (day) {
                                            let date = new Date();

                                            var next = new Date(date || new Date());
                                            next.setDate(
                                                next.getDate() +
                                                ((index - next.getDay() + 7) % 7) +
                                                1
                                            );

                                            if (day.length === 0) {
                                                console.log("geen vrijwilligers gevonden");
                                                // console.log(weeklyTask.Name)
                                                // console.log(users)
                                                // console.log(users[kotId][Math.floor(Math.random() * users[kotId].length)].Uid)
                                                // console.log(next)
                                                fire
                                                    .firestore()
                                                    .collection("/Koten")
                                                    .doc(kotId)
                                                    .collection("/PlannedTasks")
                                                    .add({
                                                        Name: weeklyTask.Name,
                                                        UserUid:
                                                            users[kotId][
                                                                Math.floor(
                                                                    Math.random() * users[kotId].length
                                                                )
                                                            ].Uid,
                                                        date: next
                                                    });
                                            } else {
                                                console.log("vrijwilligers gevonden");
                                                fire
                                                    .firestore()
                                                    .collection("/Koten")
                                                    .doc(kotId)
                                                    .collection("/PlannedTasks")
                                                    .add({
                                                        Name: weeklyTask.Name,
                                                        UserUid:
                                                            day[Math.floor(Math.random() * day.length)],
                                                        date: next
                                                    });
                                            }
                                        }
                                    });
                                });
                            })
                            .then(() => {
                                window.location.href =
                                    window.location.origin +
                                    "/kot/" +
                                    localStorage.getItem("name") +
                                    "-" +
                                    localStorage.getItem("number");
                            });
                    });
            })
    }

    render() {
        const task = this.state.task;
        return (
            <div>
                <Navigation kot={this.state.path} />
                <h1>plan weekly task {(this.state.task != null) ? ': ' + this.state.task.Name : ""}</h1>
                <p>On which days are you free to do the task?</p>

                <div className="checkbox-week">
                    <div className="form-group">
                        <label>Monday</label>
                        {this.state.task && this.state.task.monday ? (
                            <input type="checkbox" name="days[]" value="monday" onChange={this.handleChange} />
                        ) : (
                                <input type="checkbox" disabled="disabled" onChange={this.handleChange} />
                            )}
                    </div>
                    <div className="form-group">
                        <label>Tuesday</label>
                        {this.state.task && this.state.task.tuesday ? (
                            <input type="checkbox" name="days[]" value="tuesday" onChange={this.handleChange} />
                        ) : (
                                <input type="checkbox" disabled="disabled" onChange={this.handleChange} />
                            )}
                    </div>
                    <div className="form-group">
                        <label>Wednesday</label>
                        {this.state.task && this.state.task.wednesday ? (
                            <input type="checkbox" name="days[]" value="wednesday" onChange={this.handleChange} />
                        ) : (
                                <input type="checkbox" disabled="disabled" onChange={this.handleChange} />
                            )}
                    </div>
                    <div className="form-group">
                        <label>Thursday</label>
                        {this.state.task && this.state.task.thursday ? (
                            <input type="checkbox" name="days[]" value="thursday" onChange={this.handleChange} />
                        ) : (
                                <input type="checkbox" disabled="disabled" onChange={this.handleChange} />
                            )}
                    </div>
                    <div className="form-group">
                        <label>Friday</label>
                        {this.state.task && this.state.task.friday ? (
                            <input type="checkbox" name="days[]" value="friday" onChange={this.handleChange} />
                        ) : (
                                <input type="checkbox" disabled="disabled" onChange={this.handleChange} />
                            )}
                    </div>
                </div>

                <button onClick={this.handleClick}>Submit</button>
            </div>
        );
    }
}

export default PlanWeeklyTask;
