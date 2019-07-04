import React, { Component } from "react";

// import fire from '../../config/fire';
import "./Navigation.css";

import fire from "../../config/fire";

class Navigation extends Component {
  constructor(props) {
    super(props);
    console.log(props.kot);
    this.showMenu = this.showMenu.bind(this);
    this.ShowOverview = this.ShowOverview.bind(this);
    this.ShowRekening = this.ShowRekening.bind(this);
    this.ShowStats = this.ShowStats.bind(this);
    this.ShowQR = this.ShowQR.bind(this);
    this.plan = this.plan.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      kot: props.kot,
      // user: null,
      email: null

      // id: this.props.id,
      // name: this.props.name
    };
    fire
      .firestore()
      .collection("/Koten")
      .doc(localStorage.getItem("kotID"))
      .get()
      .then(doc => {
        this.setState({
          email: doc.data().Email
        });
      });
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user: user
        });
        fire
          .firestore()
          .collection('/Users')
          .where('Uid', '==', user.uid)
          .get()
          .then(snap => {
            snap.docs.forEach(doc => {
              let kotId = doc.data().kotId;
              if (kotId != localStorage.getItem('kotID')) {
                window.location.href = window.location.origin + '/Login'
              } else {
                console.log("right kot")
              }
            })
          })
      }
    });
  }

  showMenu(e) {
    e.preventDefault();
    document.getElementsByTagName("nav")[0].classList.toggle("show");
    document.getElementById("root").classList.toggle("hide");
  }

  ShowOverview(e) {
    e.preventDefault();
    window.location.href =
      window.location.origin +
      "/kot/" +
      localStorage.getItem("name") +
      "-" +
      localStorage.getItem("number");
  }

  ShowRekening(e) {
    e.preventDefault();
    window.location.href =
      window.location.origin + "/Kot/" + this.state.kot + "/Rekening";
  }

  ShowStats(e) {
    e.preventDefault();
    window.location.href =
      window.location.origin + "/Kot/" + this.state.kot + "/Stats";
  }

  ShowQR(e) {
    e.preventDefault();
    window.location.href =
      window.location.origin + "/Kot/" + this.state.kot + "/QR";
  }

  logout() {
    document.getElementById("root").classList.toggle("hide");
    fire.auth().signOut();
  }

  leaveKot() {
    //Remove kotId from user
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        localStorage.setItem("kotID", null);
        fire
          .firestore()
          .collection("/Users")
          .where("Uid", "==", user.uid)
          .get()
          .then(snap => {
            snap.docs.forEach(doc => {
              fire
                .firestore()
                .collection("/Users")
                .doc(doc.id)
                .update({
                  kotId: null
                })
                .then(() => {
                  //Logout
                  document.getElementById("root").classList.toggle("hide");
                  fire.auth().signOut();
                  //Redirect
                  window.location.href = window.location.origin + "/login";
                });
            });
          });
      }
    });
  }

  plan(e) {
    e.preventDefault();

    //get all the koten
    let koten = [];
    const kotenResult = fire
      .firestore()
      .collection("/Koten")
      .get();

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
        kotenResult.then(snap => {
          snap.docs.forEach(doc => {
            let kotId = doc.id;
            koten.push(doc.data());
            fire
              .firestore()
              .collection("/Koten")
              .doc("/" + kotId)
              .collection("/PlannedTasks")
              .get()
              .then(snapshot => {
                snapshot.docs.forEach(doc => {
                  // console.log(doc.data())
                  fire
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
                      console.log(weeklyTask)
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
                  });
              })
              .then(() => {
                // window.location.href =
                //   window.location.origin +
                //   "/kot/" +
                //   localStorage.getItem("name") +
                //   "-" +
                //   localStorage.getItem("number");
              });;
          });
        });
      });
  }

  render() {
    return (
      <div className="navigation">
        <header>
          <button
            onClick={this.showMenu}
            className="btn-small left material-icons"
          >
            menu
          </button>
          <h1>Welcome</h1>
        </header>
        <nav>
          <button onClick={this.showMenu} className=" material-icons">
            clear
          </button>
          <ul>
            <li onClick={this.ShowOverview}>Home</li>
            <li onClick={this.ShowRekening}>Bill</li>
            <li onClick={this.ShowStats}>Points</li>
            <li onClick={this.ShowQR}>QR code</li>
            <li onClick={this.plan}>Plan tasks</li>
            <li>
              <a href={"mailto:" + this.state.email}>Mail owner</a>
            </li>
            <li onClick={this.leaveKot}>Leave kot</li>
            <li onClick={this.logout}>Logout</li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Navigation;
