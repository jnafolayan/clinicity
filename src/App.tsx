import React, { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import HomePage from "./pages/Home";
import HistoryPage from "./pages/History";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import NotFoundPage from "./pages/404";

import UserProvider, { UserContext } from "./providers/UserProvider";
import { auth } from "./firebase";
import { generateUserDocument } from "./helpers/userDocument";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 3),
  },

  appName: {
    display: "block",
    textDecoration: "none",
    fontSize: "2.3rem",
    fontFamily: "Poppins",
    marginBottom: theme.spacing(3),
    textAlign: "center",
    color: theme.palette.primary.main,
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  const {
    state: { user },
    dispatch,
  } = useContext(UserContext);

  useEffect(() => {
    // // id
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await generateUserDocument(user);
        dispatch({ type: "auth", payload: userDoc });
      } else {
        dispatch({ type: "auth", payload: null });
      }
    });
  }, []);

  return (
    <UserProvider>
      <div className={classes.root}>
        <Router>
          <Link to="/" className={classes.appName}>
            Clinicity
          </Link>
          <Switch>
            <PrivateRoute user={user} path="/" exact component={HomePage} />
            <PrivateRoute user={user} path="/history" component={HistoryPage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="" component={NotFoundPage} />
          </Switch>
        </Router>
      </div>
    </UserProvider>
  );
};

interface PrivateProps {
  user: any;
  path: string;
  exact?: boolean;
  component: React.ElementType;
}

const PrivateRoute: React.FC<PrivateProps> = ({
  user,
  path,
  exact = false,
  component: Component,
  ...rest
}) => (
  <Route
    path={path}
    exact={exact}
    {...rest}
    render={(props) =>
      user ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

export default App;
