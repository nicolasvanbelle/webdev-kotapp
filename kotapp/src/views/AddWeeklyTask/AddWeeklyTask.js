import React, { Component } from 'react';
import fire from '../../config/fire';

import Navigation from "../../components/Navigation/Navigation";
// import "./AddGeneralTask.css";

class AddWeeklyTask extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            name: '',
            days: [],
        }
    }

    handleChange(e) {
        // console.log(e.target.type);

        // console.log(this.state);
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
        var task = {
            Name: null,
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
        };

        task.Name = this.state.name;

        this.state.days.forEach(day => {
            task[day] = [];
        });

        fire
            .firestore()
            .collection('/Koten')
            .doc('/' + localStorage.getItem("kotID"))
            .collection('/WeeklyTasks')
            .add(task)
            .then(doc => {
                window.location.href = window.location.href.replace(
                    "/AddWeeklyTasks",
                    ""
                );
            });
    }

    render() {
        return (
            <div>
                <Navigation kot={this.state.path} />
                <form>
                    <h1>Add a weekly task</h1>
                    <p>Enter the name of the task and the days on which must be done.</p>
                    <input
                        value={this.state.name}
                        onChange={this.handleChange}
                        type="name"
                        name="name"
                        id="inputName"
                        placeholder="Enter the taskname"
                    />
                    <div className="checkbox-week">
                        <div class="form-group">
                            <label>Monday</label>
                            <input type="checkbox" name="days" value="monday" onChange={this.handleChange} />
                        </div>
                        <div class="form-group">
                            <label>Tuesday</label>
                            <input type="checkbox" name="days" value="tuesday" onChange={this.handleChange} />
                        </div>
                        <div class="form-group">
                            <label>Wednesday</label>
                            <input type="checkbox" name="days" value="wednesday" onChange={this.handleChange} />
                        </div>
                        <div class="form-group">
                            <label>Thursday</label>
                            <input type="checkbox" name="days" value="thursday" onChange={this.handleChange} />
                        </div>
                        <div class="form-group">
                            <label>Friday</label>
                            <input type="checkbox" name="days" value="friday" onChange={this.handleChange} />
                        </div>
                    </div>

                    <button onClick={this.handleClick}>Add task</button>
                </form>
            </div>
        );
    }
}

export default AddWeeklyTask;
