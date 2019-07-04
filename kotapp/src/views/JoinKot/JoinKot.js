import React, { Component } from "react";
import fire from "../../config/fire";

import "./JoinKot.css";

class JoinKot extends Component {
  constructor(props) {
    super(props);
    this.kotExists = this.kotExists.bind(this);
    this.registerMember = this.registerMember.bind(this);
    this.state = {
      name: props.match.params.name.split("-")[0],
      number: props.match.params.name.split("-")[1],
      kot: null,
      user: null,
      isLoading: true
    };
    localStorage.setItem("name", this.state.name);
    localStorage.setItem("number", this.state.number);
  }

  componentDidMount() {
    this.loadServerData();
  }

  async loadServerData() {
    await this.authListener();
    await this.kotExists();

    console.log("isLoading false");
    this.setState({ isLoading: false });
  }

  async kotExists() {
    const result = await fire
      .firestore()
      .collection("/Koten")
      .where("Name", "==", this.state.name)
      .where("Number", "==", this.state.number)
      .get();

    if (result) {
      console.log("kotdata loaded");
      if (result.size === 1) {
        result.docs.forEach(element => {
          this.setState({
            kot: element
          });
        });
      }
    } else {
      console.log("Kot not found");
    }
  }

  async authListener() {
    console.log("authlistener");
    console.log(this.state.number);
    await fire.auth().onAuthStateChanged(async user => {
      if (user) {
        const result = await fire
          .firestore()
          .collection("/Users")
          .where("Uid", "==", user.uid)
          .get();

        if (result) {
          console.log("userdata loaded");
          result.docs.forEach(element => {
            // console.log(element);
            this.setState({
              user: element
            });
          });
        }
      } else {
        this.props.history.push("/register");
      }
    });
  }

  registerMember(e) {
    e.preventDefault();
    //assign the kot to the user
    fire
      .firestore()
      .collection("/Users")
      .doc(this.state.user.id)
      .update({
        kotId: this.state.kot.id
      })
      .then(() => {
        localStorage.setItem('kotID', this.state.kot.id)
        //Redirect
        this.props.history.push(
          "/kot/" + this.state.name + "-" + this.state.number
        );
      });
  }

  render() {
    const { kot, user, isLoading } = this.state;

    let message;
    let message2;

    if (kot) {
      message = (
        <h1>
          Are you ready to join {kot.data().Name} kot @{kot.data().Street} @
          {kot.data().City}
        </h1>
      );
      if (user) {
        message2 = (
          <form>
            <button onClick={this.registerMember} className="btn btn-signup">
              Sign me up
            </button>
            {/* <button onClick = {}className = "btn btn-signup" > No thanks</button> */}
          </form>
        );
      } else {
        message2 = <p>register first</p>;
      }
    } else if (isLoading) {
      message = <h1> Loading... </h1>;
    } else {
      message = <h1> Kot does not exist </h1>;
    }
    return (
      <div>
        {message} {message2}
      </div>
    );
  }
}

export default JoinKot;
