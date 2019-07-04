import React, { Component } from "react";

import fire from "../../config/fire";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: null,
      password: null,
      error: ""
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
          .collection("/Users")
          .where("Uid", "==", user.uid)
          .get()
          .then(docs => {
            docs.docs.forEach(doc => {
              console.log(doc.data());
              if (doc.data().kotId !== undefined && doc.data().kotId !== null) {
                console.log("kot!!!");
                fire
                  .firestore()
                  .collection("/Koten")
                  .doc(doc.data().kotId)
                  .get()
                  .then(kot => {
                    console.log(kot.data());
                    this.props.history.push(
                      "/kot/" + kot.data().Name + "-" + kot.data().Number
                    );
                  });
              } else {
                this.props.history.push("/CreateKot");
                console.log("no kot");
              }
            });
          });
      }
    });
  }

  signup(e) {
    e.preventDefault();
    this.props.history.push("/register");
  }

  login(e) {
    e.preventDefault();
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
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
      <div className="LoginForm">
        <form>
          <h1>Login</h1>
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

          <button onClick={this.login}>Login</button>
          <button onClick={this.signup} className="btn-secondary">
            Registeer
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
