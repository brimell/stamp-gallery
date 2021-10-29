// -- React and related libs
import React from "react";
import { Switch, Route, Redirect } from "react-router";
import { HashRouter } from "react-router-dom";

// -- Redux
import { connect } from "react-redux";

// -- Custom Components
import LayoutComponent from "./components/Layout/Layout";
import ErrorPage from "./pages/error/ErrorPage";

// -- Third Party Libs
import { ToastContainer } from "react-toastify";

// -- Component Styles
import "./styles/app.scss";

const PrivateRoute = ({ dispatch, component, ...rest }) => {
    return (
      <Route { ...rest } render={props => (React.createElement(component, props))} />
    );
  }

const App = (props) => {
  return (
    <div>
      <ToastContainer/>
      <HashRouter>
        <Switch>
          <Route path="/" exact render={() => <Redirect to="/dashboard" />} />
          <PrivateRoute path="/" dispatch={props.dispatch} component={LayoutComponent} />
          <Route path="/error" exact component={ErrorPage} />
          <Route component={ErrorPage}/>
          <Route path='*' exact={true} render={() => <Redirect to="/error" />} />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
