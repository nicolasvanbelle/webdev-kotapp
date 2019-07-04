import React, { Component } from "react";

import fire from "../../config/fire";
import Navigation from "../../components/Navigation/Navigation";
import TaskList from "../../components/TaskList/TaskList";

import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      name: props.match.params.name.split("-")[0],
      number: props.match.params.name.split("-")[1],
      path: props.match.params.name,
      kotID: null
    };
    this.authListener();
  }

  componentDidMount() {
    this.authListener();
    fire
      .firestore()
      .collection("/Koten")
      .where("Name", "==", this.state.name)
      .where("Number", "==", this.state.number)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          localStorage.setItem("kotID", doc.id);
        });
      });
  }

  authListener() {
    fire.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.history.push("/login");
      }
    });
  }

  render() {
    return (
      <div className="page">
        <Navigation kot={this.state.path} />
        <h3>Welcome to {this.state.name}</h3>
        <TaskList selector="GeneralTasks" uid={this.state.user} />
        <TaskList selector="PlannedTasks" uid={this.state.user} />
      </div>
    );
  }
}

export default Home;
