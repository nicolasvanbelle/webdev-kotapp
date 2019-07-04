import React, { Component } from "react";

import fire from "../../config/fire";
import "./Register.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: null,
      password: null,
      name: null,
      error: "",
      kotname: localStorage.getItem("name"),
      kotnumber: localStorage.getItem("number")
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
          .then(docs => {
            docs.docs.forEach(doc => {
              console.log(doc.data())
              if (doc.data().kotId !== undefined) {
                console.log("kot!!!");
                fire
                  .firestore()
                  .collection('/Koten')
                  .doc(doc.data().kotId)
                  .get()
                  .then(kot => {
                    console.log(kot.data());
                    this.props.history.push("/kot/" + kot.data().Name + "-" + kot.data().Number);
                  })
              } else if (this.state.kotname && this.state.kotnumber) {
                this.props.history.push("/JoinKot/" + this.state.kotname + "-" + this.state.kotnumber);
              } else {
                this.props.history.push("/CreateKot");
              }

            })
          });
      }
    });
  }

  login(e) {
    e.preventDefault();
    this.props.history.push("/login");
  }

  signup(e) {
    e.preventDefault();
    if (this.state.email == null) return;
    if (this.state.password == null) return;
    if (this.state.name == null) return;
    fire
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        if (user) {
          fire
            .firestore()
            .collection("/Users")
            .add({
              Name: this.state.name,
              Uid: user.user.uid
            });
        } else {
          console.log("no user");
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          error: error.message
        });
      });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className="RegisterForm">
        <form>
          <h1>Registeer</h1>
          <input
            value={this.state.Name}
            onChange={this.handleChange}
            type="text"
            name="name"
            class="form-control"
            id="InputName"
            placeholder="Naam"
          />
          <input
            value={this.state.email}
            onChange={this.handleChange}
            type="email"
            name="email"
            className="form-control"
            id="InputEmail"
            placeholder="Enter email"
          />
          <input
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
            name="password"
            className="form-control"
            id="InputPassword"
            placeholder="Password"
          />

          <p>{this.state.error}</p>

          <button onClick={this.signup} className="">
            Register
          </button>
          <button onClick={this.login} className="btn-secondary">
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default Register;
