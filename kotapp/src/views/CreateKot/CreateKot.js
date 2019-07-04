import React, { Component } from "react";
import fire from "../../config/fire";

import "./CreateKot.css";

class CreateKot extends Component {
  constructor(props) {
    super(props);
    var kot = localStorage.getItem("KotID");
    if (kot !== null) {
    }
    this.createKot = this.createKot.bind(this);
    this.handleChange = this.handleChange.bind(this);
    var min = 1000;
    var max = 9999;
    this.state = {
      name: null,
      postalCode: null,
      street: null,
      number: String(Math.round(min + Math.random() * (max - min)))
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        fire
          .firestore()
          .collection('/Users')
          .where('Uid', '==', user.uid)
          .get()
          .then(snap => {
            snap.docs.forEach(doc => {
              this.setState({
                user: { id: doc.id }
              });
            })
          })
      }
    });
  }

  createKot(e) {
    e.preventDefault();
    if (this.state.name == null) return;
    if (this.state.postalCode == null) return;
    if (this.state.street == null) return;
    if (this.state.email == null) return;
    //create kot

    console.log(this.state.user);
    fire
      .firestore()
      .collection("/Koten")
      .add({
        Name: this.state.name,
        City: this.state.postalCode,
        Street: this.state.street,
        Number: this.state.number,
        Email: this.state.email,
        Rekening: {},
        Score: {}
      })
      .then(kot => {
        localStorage.setItem("kotID", kot.id)
        fire
          .firestore()
          .collection("/Users")
          .doc(this.state.user.id)
          .update({
            kotId: kot.id
          })
          .then(() => {
            localStorage.setItem("name", this.state.name);
            localStorage.setItem("number", this.state.number);
            this.props.history.push(
              "/kot/" + this.state.name + "-" + this.state.number
            );
          });
      });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        <form>
          <h1>Create House</h1>
          <p>Create a house that other people can join.</p>
          <input
            value={this.state.name}
            onChange={this.handleChange}
            type="name"
            name="name"
            className="form-control"
            id="InputName"
            placeholder="Enter name kot"
          />
          <input
            value={this.state.postalCode}
            onChange={this.handleChange}
            type="number"
            name="postalCode"
            className="form-control"
            id="InputCity"
            placeholder="Enter postalCode"
          />
          <input
            value={this.state.street}
            onChange={this.handleChange}
            type="name"
            name="street"
            className="form-control"
            id="InputStreet"
            placeholder="Enter street + nr"
          />
          <input
            value={this.state.email}
            onChange={this.handleChange}
            type="email"
            name="email"
            className="form-control"
            id="InputEmail"
            placeholder="Enter the email of the owner"
          />
          <button onClick={this.createKot} className="btn btn-signup">Create Kot</button>
        </form>
      </div>
    );
  }
}

export default CreateKot;
