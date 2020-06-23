import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import grey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";

import firebase from "firebase/app";
import { auth } from "../firebase";

const useStyles = makeStyles((theme) => ({
  root: {},
  subtitle: {
    color: grey[500],
  },
  card: {
    margin: theme.spacing(4, "auto"),
    maxWidth: 468,
  },
  signupBtn: {
    backgroundColor: grey[800],
    color: grey[200],
    padding: theme.spacing(1, 2),
  },
  googleBtn: {
    backgroundColor: red[700],
    color: "#fff",
  },
}));

const Signup: React.FC = () => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);

  const doGoogleLogin = (event: React.MouseEvent) => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(googleProvider);
  };

  const onChangeHandler = (event: React.ChangeEvent) => {
    const { name, value } = event.currentTarget as HTMLInputElement;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password).catch(alert);
    console.log(email, password);

    // setEmail("");
    // setPassword("");
    // setDisplayName("");
  };

  return (
    <div>
      <Container>
        <Typography variant="h5" align="center">
          Quickly find medical facilities in an area.
        </Typography>
        <Typography align="center" className={classes.subtitle}>
          Sign up for an account.
        </Typography>

        <Card className={classes.card}>
          <CardContent>
            <form action="" method="POST" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    label="Email"
                    variant="outlined"
                    placeholder="Enter your email address"
                    onChange={onChangeHandler}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="password"
                    type="password"
                    label="Password"
                    variant="outlined"
                    placeholder="Enter a password"
                    onChange={onChangeHandler}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    className={classes.signupBtn}
                    variant="contained"
                    color="primary"
                  >
                    Sign up
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="button"
                    className={classes.googleBtn}
                    variant="contained"
                    color="primary"
                    onClick={doGoogleLogin}
                  >
                    or Continue with Google
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Signup;
