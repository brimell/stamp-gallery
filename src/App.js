import React from "react";
import { Switch, Route, Redirect } from "react-router";
import { HashRouter } from "react-router-dom";

import LayoutComponent from "./components/Layout/Layout";
import ErrorPage from "./pages/error/ErrorPage";

import { ToastContainer } from "react-toastify";

import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "./components/globalStyles";
import { lightTheme, darkTheme } from "./components/Themes"
import theme from './components/currTheme'

import "./styles/app.scss";

const PrivateRoute = ({ dispatch, component, ...rest }) => {
    return (
      <Route { ...rest } render={props => (React.createElement(component, props))} />
    );
  }

const App = (props) => {
  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <>
      <GlobalStyles/>
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
      </>
    </ThemeProvider>
  );
}

export default App;
