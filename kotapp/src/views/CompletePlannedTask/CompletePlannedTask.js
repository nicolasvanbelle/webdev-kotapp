import React, { Component } from "react";
import fire from "../../config/fire";
// import Popup from "reactjs-popup";

import Navigation from "../../components/Navigation/Navigation";


class CompletePlannedTask extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.completedTask = this.completedTask.bind(this);
        this.addToGeneralTasks = this.addToGeneralTasks.bind(this);
        this.addToRekening = this.addToRekening.bind(this);
        this.addScore = this.addScore.bind(this);

        this.state = {
            task: this.props.match.params.id,
            name: null,
            geld: 0
        };
        fire
            .firestore()
            .collection("/Koten")
            .doc("/" + localStorage.getItem("kotID"))
            .collection("/PlannedTasks")
            .doc("/" + this.state.task)
            .get()
            .then(task => {
                this.setState({
                    name: task.data().name
                });
            });
    }

    componentDidMount() {
        this.authListener();
        fire
            .firestore()
            .collection("/Koten")
            .doc("/" + localStorage.getItem("kotID"))
            .get()
            .then(doc => {
                this.setState({
                    kot: doc.data()
                });
            });

        fire
            .firestore()
            .collection('/Koten')
            .doc('/' + localStorage.getItem("kotID"))
            .collection('/PlannedTasks')
            .doc('/' + this.state.task)
            .get()
            .then(doc => {
                this.setState({
                    name: doc.data().Name
                })
            })
    }

    authListener() {
        fire.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    user: user
                });
            }
        });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    addScore() {
        var point = 1;
        console.log(this.state.kot.Score[this.state.user.uid]);
        if (this.state.kot.Score[this.state.user.uid] === undefined) {
            this.state.kot.Score[this.state.user.uid] = parseFloat(point);
        } else {
            this.state.kot.Score[this.state.user.uid] += parseFloat(point);
        }
        fire
            .firestore()
            .collection("/Koten")
            .doc("/" + localStorage.getItem("kotID"))
            .update({
                Score: this.state.kot.Score
            })
            .then(() => {
                this.completedTask();
            });
    }

    addToRekening(e) {
        e.preventDefault();

        console.log("add to rekening");
        console.log("rekening", this.state.kot.Rekening);

        if (this.state.kot.Rekening[this.state.user.uid] === undefined) {
            this.state.kot.Rekening[this.state.user.uid] = parseFloat(
                this.state.geld
            );
            console.log(this.state.geld);
        } else {
            this.state.kot.Rekening[this.state.user.uid] += parseFloat(
                this.state.geld
            );
            console.log(this.state.geld);
        }
        fire
            .firestore()
            .collection("/Koten")
            .doc("/" + localStorage.getItem("kotID"))
            .update({
                Rekening: this.state.kot.Rekening
            })
            .then(() => {
                this.addScore();
            });
    }

    completedTask() {
        //Delete de task
        console.log(this.state.task)
        fire
            .firestore()
            .collection("/Koten")
            .doc("/" + localStorage.getItem("kotID"))
            .collection("/PlannedTasks")
            .doc("/" + this.state.task)
            .delete()
            .then(function () {
                console.log("Document successfully deleted!");
                //Redirect
                window.location.href = window.location.origin + "/kot/" + localStorage.getItem("name") + "-" + localStorage.getItem("number")
            });
    }

    addToGeneralTasks() {
        console.log(this.state)
        fire
            .firestore()
            .collection('/Koten')
            .doc(localStorage.getItem("kotID"))
            .collection('/GeneralTasks')
            .add({
                Name: this.state.name
            })
            .then(() => {
                this.completedTask()
            })
    }

    toggleOverlay(e) {
        e.preventDefault();
        document.getElementById("overlay").classList.toggle("show");
    }

    render() {
        return (
            <div>
                <Navigation kot={this.state.path} />
                <h3>Geplande taak voltooien</h3>
                <p>{this.state.name}</p>
                <button onClick={this.toggleOverlay}>Task Complete</button>
                <button onClick={this.addToGeneralTasks} className="btn-secondary">Add to general tasks</button>

                <div className="form-overlay" id="overlay">
                    <form>
                        <button
                            onClick={this.toggleOverlay}
                            className=" material-icons btn-secondary"
                        >
                            clear
            </button>
                        <h4>How much did it cost?</h4>
                        <input
                            type="number"
                            step="1"
                            name="geld"
                            onChange={this.handleChange}
                        />
                        <button onClick={this.addToRekening}>Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default CompletePlannedTask;
