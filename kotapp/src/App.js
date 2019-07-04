import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Register from "./views/Register/Register";
import CreateKot from "./views/CreateKot/CreateKot";
import Login from "./views/Login/Login";
import Home from "./views/Home/Home";
import JoinKot from "./views/JoinKot/JoinKot";
import AddGeneralTask from "./views/AddGeneralTask/AddGeneralTask";
import EditGeneralTask from "./views/EditGeneralTask/EditGeneralTask";
import AddWeeklyTask from "./views/AddWeeklyTask/AddWeeklyTask";
import KotOverview from "./views/KotOverview/KotOverview";
import PlanWeeklyTask from "./views/PlanWeeklyTask/PlanWeeklyTask";
import CompletePlannedTask from "./views/CompletePlannedTask/CompletePlannedTask";
import Rekening from "./views/Rekening/Rekening";
import Stats from "./views/Stats/Stats";
import QR from "./views/QR/QR";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path="/Register" component={Register} />
        <Route path="/Login" component={Login} />
        <Route path="/CreateKot" component={CreateKot} />
        <Route exact path="/Kot/:name" component={Home} />
        <Route path="/Kot/:name/overview" component={KotOverview} />
        <Route path="/Kot/:name/AddGeneralTasks" component={AddGeneralTask} />
        <Route path="/Kot/:name/AddWeeklyTasks" component={AddWeeklyTask} />
        <Route path="/Kot/:name/WeeklyTask/:id/plan" component={PlanWeeklyTask} />
        <Route path="/PlannedTasks/:id" component={CompletePlannedTask} />
        <Route path="/GeneralTasks/:id" component={EditGeneralTask} />
        <Route path="/JoinKot/:name" component={JoinKot} />
        <Route path="/Kot/:name/Rekening" component={Rekening} />
        <Route path="/Kot/:name/Stats" component={Stats} />
        <Route path="/Kot/:name/QR" component={QR} />
      </BrowserRouter>
    );
  }
}

export default App;
