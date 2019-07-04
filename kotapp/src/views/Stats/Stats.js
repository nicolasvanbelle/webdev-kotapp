import React, { Component } from "react";

import fire from "../../config/fire";
import Navigation from "../../components/Navigation/Navigation";
import "./Stats.css";

class Stats extends Component {
  constructor(props) {
    super(props);
    this.showStats = this.showStats.bind(this);
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
          stats: Object.entries(kot.Score)
        });
        // console.log("kotInfo", this.state.kot.Score);

        let temp = [];
        this.state.stats.forEach(stat => {
          var uuid = stat[0];
          // console.log("uuid", uuid);

          var userNames = fire
            .firestore()
            .collection("/Users")
            .where("Uid", "==", uuid)
            .get();
          userNames.then(snap => {
            snap.docs.forEach(doc => {
              let user = doc.data();
              temp.push({ Name: user.Name, Points: stat[1] });
              // this.state.stats
              // console.log("test", doc.data());
            });
            this.setState({
              test: temp
            });
          });
        });
      });
  }

  componentDidMount() {
    //   fire.firestore()
    //   .collection("/Users")
    //   .doc("/" + this.state.kot.Score)
    //   .get()
  }

  showStats() {}

  render() {
    return (
      <div>
        <Navigation kot={this.state.path} />
        Who did the most in this house?
        <ul>
          {this.state.test.map(score => {
            console.log("score");
            return (
              <li>{score.Name + ": " + score.Points + " Tasks Completed"}</li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Stats;
