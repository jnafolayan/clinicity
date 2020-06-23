import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import NotFoundPage from "./pages/404";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 3),
  },

  appName: {
    display: "block",
    textDecoration: "none",
    fontSize: "3rem",
    fontFamily: "Poppins",
    marginBottom: theme.spacing(3),
    textAlign: "center",
    color: theme.palette.primary.main,
  },
}));

const App: React.FC = () => {
  const classes = useStyles();

  useEffect(() => {
    // id
    const id = Date.now().toString(32) + Math.random().toString(16).substr(2);
    if (!localStorage.id) localStorage.id = id;
  }, []);

  return (
    <div className={classes.root}>
      <Router>
        <Link to="/" className={classes.appName}>
          Clinicity
        </Link>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/history">
            <HistoryPage />
          </Route>
          <Route path="">
            <NotFoundPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
