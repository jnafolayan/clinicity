import React, { useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import grey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";
import PlaceCard from "./PlaceCard";
import { NearbySearchPOI } from "../util";

interface InputProps {
  results: NearbySearchPOI[];
  error: string;
}

const useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2, 0),
  },

  error: {
    color: red[400],
    textAlign: "center",
    margin: theme.spacing(3, 2),
  },

  button: {
    background: grey[200],
    padding: theme.spacing(1, 2),
    color: grey[700],
    "&:hover": {
      border: "1px solid #ccc",
    },
  },
}));

const DEFAULT_PAGE_LENGTH = 9;

const SearchResults: React.FC<InputProps> = ({ results, error }) => {
  const classes = useStyles();

  const [pageLength, setPageLength] = useState(DEFAULT_PAGE_LENGTH);

  const seeMore = () => {
    setPageLength(pageLength + DEFAULT_PAGE_LENGTH);
  };

  return (
    <Paper elevation={0} className={classes.section}>
      {results.length ? (
        <>
          <Grid container spacing={2}>
            {results.slice(0, pageLength).map((result) => (
              <Grid key={result.id} item xs={12} sm={6} md={4}>
                <Link
                  to={`https://google.com/search?q=${encodeURI(
                    result.poi.name
                  )}`}
                  style={{ textDecoration: "none" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlaceCard data={result} />
                </Link>
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={4}></Grid>
            <Grid item xs={12} md={4}>
              <Button
                className={classes.button}
                color="secondary"
                fullWidth
                onClick={() => seeMore()}
              >
                SEE MORE
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography className={classes.error}>{error}</Typography>
      )}
    </Paper>
  );
};

export default SearchResults;
