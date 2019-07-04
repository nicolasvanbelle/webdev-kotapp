import React, { Component } from "react";

import fire from "../../config/fire";
import Navigation from "../../components/Navigation/Navigation";
import "./Rekening.css";

class Rekening extends Component {
  constructor(props) {
    super(props);
    this.vereffend = this.vereffend.bind(this);
    this.state = {
      name: props.match.params.name.split("-")[0],
      number: props.match.params.name.split("-")[1],
      path: props.match.params.name,
      kot: null,
      stats: [],
      test: []
    };
    fire
      .firestore()
      .collection("/Koten")
      .doc("/" + localStorage.getItem("kotID"))
      .get()
      .then(doc => {
        let kot = doc.data();

        // console.log(kot);
        this.setState({
          kot: doc.data(),
          stats: Object.entries(kot.Rekening)
        });

        let temp = [];
        this.state.stats.forEach(stat => {
          var uuid = stat[0];

          var userNames = fire
            .firestore()
            .collection("/Users")
            .where("Uid", "==", uuid)
            .get();
          userNames.then(snap => {
            snap.docs.forEach(doc => {
              let user = doc.data();
              temp.push({ Name: user.Name, Geld: stat[1] });
            });
            this.setState({
              test: temp
            });
          });
        });
      });
  }

  componentDidMount() { }

  vereffend(e) {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user.uid);
        fire
          .firestore()
          .collection("/Koten")
          .doc("/" + localStorage.getItem("kotID"))
          .get()
          .then(doc => {
            let kot = doc.data();
            kot.Rekening[user.uid] = 0;
            this.setState({
              kot: kot
            });
            //UPDATE TO FIREBASE
          })
          .then(() => {
            fire
              .firestore()
              .collection("/Koten")
              .doc("/" + localStorage.getItem("kotID"))
              .update({
                Rekening: this.state.kot.Rekening
              });
          })
          .then(() => {
            this.props.history.push(
              "/kot/" +
              localStorage.getItem("name") +
              "-" +
              localStorage.getItem("number")
            );
          });
        console.log(this.state.kot);
        //Redirect
      }
    });
  }

  render() {
    return (
      <div>
        <Navigation kot={this.state.path} />
        Who paid already?
        <ul>
          {this.state.test.map(rekening => {
            return <li>{rekening.Name + ": €" + rekening.Geld}</li>;
          })}
        </ul>
        <button className="btn-secondary" onClick={this.vereffend}>pay off the bill</button>
      </div>
    );
  }
}

export default Rekening;
