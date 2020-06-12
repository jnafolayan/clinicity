import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Home from "./pages/Home";
import SearchHistory from "./pages/SearchHistory";

import firebase from "firebase/app";
import "firebase/firestore";

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

  // state
  const db = useRef<firebase.firestore.Firestore>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // id
    const id = Date.now().toString(32) + Math.random().toString(16).substr(2);
    if (!localStorage.id) localStorage.id = id;

    firebase.initializeApp({
      apiKey: "AIzaSyAT2LO95_fxvuP39_mku1nTyJ2ZIoz-z8Y",
      authDomain: "clinicity.firebaseapp.com",
      projectId: "clinicity",
    });

    db.current = firebase.firestore();
    setReady(true);
  }, []);

  return (
    <div className={classes.root}>
      <Router>
        <Link to="/" className={classes.appName}>
          Clinicity
        </Link>
        <Switch>
          <Route path="/" exact>
            {db.current && ready && <Home db={db.current} />}
          </Route>
          <Route path="/history">
            {db.current && ready && <SearchHistory db={db.current} />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
