import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import grey from "@material-ui/core/colors/grey";
import HospitalIcon from "@material-ui/icons/House";
import RadiusIcon from "@material-ui/icons/ControlCamera";

import { GRAPHQL_URL } from "../config";
import { UserContext } from "../providers/UserProvider";

interface SearchQuery {
  _id: string;
  address: string;
  radius: number;
  type: string;
}

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "1rem",
    fontFamily: "Poppins",
  },

  underline: {
    display: "block",
    textAlign: "right",
    width: 80,
    height: 4,
    background: theme.palette.primary.main,
    borderRadius: "18px",
  },

  resultsContainer: {
    margin: theme.spacing(2, 0),
  },

  queryContainer: {
    minHeight: "70px",
    boxShadow: "none",
    border: "1px solid #ccc",
    cursor: "pointer",
    "&:hover": {
      boxShadow: theme.shadows[2],
      // borderColor: theme.palette.primary.main,
      // borderWidth: 2,
    },
  },

  queryAddress: {
    fontSize: "1rem",
    color: grey[800],
    fontWeight: theme.typography.fontWeightBold,
    fontFamily: "'Open Sans', sans-serif",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },

  querySub: {
    fontSize: "0.6rem",
    color: grey[500],
    display: "flex",
    alignItems: "center",
    fontFamily: "'Open Sans', sans-serif",
    marginRight: theme.spacing(2),
    textTransform: "uppercase",
    "& svg": {
      marginRight: theme.spacing(0.5),
      fontSize: "1.2rem",
    },
  },

  querySubContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: theme.spacing(1),
  },

  error: {
    color: grey[700],
    margin: theme.spacing(3, 0),
  },
}));

const HistoryPage: React.FC = () => {
  const classes = useStyles();
  const {
    state: { user },
  } = useContext(UserContext);
  const [results, setResults] = useState<SearchQuery[]>([]);

  useEffect(() => {
    (async () => {
      const query = `query History($uid: String!) {
        history(uid: $uid) {
          _id
          address
          radius
          type
          createdAt
        }
      }`;

      try {
        const resp = await fetch(GRAPHQL_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query,
            variables: {
              uid: user.uid,
            },
          }),
        }).then((resp) => resp.json());
        setResults(resp.data.history);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user.uid]);

  return (
    <Paper elevation={0}>
      <Container>
        <Typography className={classes.title}>Search History</Typography>
        <div className={classes.underline}></div>

        <div className={classes.resultsContainer}>
          {results.length ? (
            <Grid container spacing={2}>
              {results.map((query) => (
                <Grid item key={query._id} xs={12} sm={6} md={4}>
                  <Link
                    to={`/?address=${query.address}&radius=${query.radius}&type=${query.type}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card className={classes.queryContainer}>
                      <CardContent>
                        <Typography className={classes.queryAddress}>
                          {query.address}
                        </Typography>
                        <div className={classes.querySubContainer}>
                          <Typography className={classes.querySub}>
                            <HospitalIcon /> {query.type}
                          </Typography>
                          <Typography className={classes.querySub}>
                            <RadiusIcon /> {query.radius}
                          </Typography>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography className={classes.error}>
              You have no search history
            </Typography>
          )}
        </div>
      </Container>
    </Paper>
  );
};

export default HistoryPage;
