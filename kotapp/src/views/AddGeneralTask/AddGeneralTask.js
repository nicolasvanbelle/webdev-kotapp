import React, { Component } from "react";
import fire from "../../config/fire";

import Navigation from "../../components/Navigation/Navigation";
// import "./AddGeneralTask.css";

class AddGeneralTask extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      name: ""
    };
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleClick(e) {
    e.preventDefault();

    if (this.state.name === "") return;
    fire
      .firestore()
      .collection("/Koten")
      .doc("/" + localStorage.getItem("kotID"))
      .collection("/GeneralTasks")
      .add({
        Name: this.state.name
      })
      .then(doc => {
        window.location.href = window.location.href.replace(
          "/AddGeneralTasks",
          ""
        );
      });
  }

  render() {
    return (
      <div>
        <Navigation kot={this.state.path} />
        <h3>Add a general task</h3>
        <form>
          <input
            value={this.state.name}
            onChange={this.handleChange}
            type="name"
            name="name"
            id="inputName"
            placeholder="Enter the taskname"
          />
          <button onClick={this.handleClick}>Add task</button>
        </form>
      </div>
    );
  }
}

export default AddGeneralTask;
