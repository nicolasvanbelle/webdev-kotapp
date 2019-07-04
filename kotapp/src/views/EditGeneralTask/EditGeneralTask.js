import React, { Component } from "react";
import fire from "../../config/fire";
// import Popup from "reactjs-popup";

import Navigation from "../../components/Navigation/Navigation";

import "./EditGeneralTask.css";

class EditGeneralTask extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.editTask = this.editTask.bind(this);
    this.completedTask = this.completedTask.bind(this);
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
      .collection("/GeneralTasks")
      .doc("/" + this.state.task)
      .get()
      .then(task => {
        this.setState({
          name: task.data().Name
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
        console.log(this.state.kot);
      });
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

  editTask(e) {
    e.preventDefault();

    console.log(this.state.name);
    fire
      .firestore()
      .collection("/Koten")
      .doc("/" + localStorage.getItem("kotID"))
      .collection("/GeneralTasks")
      .doc("/" + this.state.task)
      .update({
        Name: this.state.name
      });
    //Redirect
    this.props.history.push(
      "/kot/" +
        localStorage.getItem("name") +
        "-" +
        localStorage.getItem("number")
    );
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
        // this.completedTask();
      });
  }

  completedTask() {
    //Delete de task
    fire
      .firestore()
      .collection("/Koten")
      .doc("/" + localStorage.getItem("kotID"))
      .collection("/GeneralTasks")
      .doc("/" + this.state.task)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
      });

    //Redirect
    this.props.history.push(
      "/kot/" +
        localStorage.getItem("name") +
        "-" +
        localStorage.getItem("number")
    );
  }

  toggleOverlay(e) {
    e.preventDefault();
    document.getElementById("overlay").classList.toggle("show");
  }

  render() {
    return (
      <div>
        <Navigation kot={this.state.path} />
        <h3>Edit or complete this general task</h3>
        <form>
          <input
            value={this.state.name}
            onChange={this.handleChange}
            type="name"
            name="name"
            id="inputName"
            placeholder="Enter the taskname"
          />
          <button onClick={this.editTask} className="btn-secondary">
            Edit task
          </button>
          <button onClick={this.toggleOverlay}>Task Complete</button>
        </form>
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

export default EditGeneralTask;
