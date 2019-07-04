import React, { Component } from "react";

import fire from "../../config/fire";
import Navigation from "../../components/Navigation/Navigation";

// import "./Home.css";

class KotOverview extends Component {

    componentDidMount() {
        this.authListener();
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
            <div>
                <Navigation />
                <h1>Kot overview</h1>
            </div>
        );
    }
}

export default KotOverview;
