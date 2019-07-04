import React, { Component } from "react";
import Navigation from "../../components/Navigation/Navigation";
import "./QR.css";

class QR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.match.params.name.split("-")[0],
      number: props.match.params.name.split("-")[1],
      path: props.match.params.name,
      urlJoin:
        window.location.origin +
        "/JoinKot/" +
        localStorage.getItem("name") +
        "-" +
        localStorage.getItem("number")
    };
    console.log(this.state.urlJoin);
  }

  componentDidMount() {}

  render() {
    var url = this.state.urlJoin;
    return (
      <div>
        <Navigation kot={this.state.path} />
        <div>Want to join kot? Scan this QR code and Register!</div>
        <div>
          <img
            src={
              "https://api.qrserver.com/v1/create-qr-code/?data=" +
              url +
              "&amp;size=200x200"
            }
            alt=""
            title=""
          />
        </div>
      </div>
    );
  }
}

export default QR;
