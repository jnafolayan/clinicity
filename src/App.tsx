import React, { useState, useEffect, useMemo, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import Container from "@material-ui/core/Container";
import grey from "@material-ui/core/colors/grey";
import PlaceCard from "./components/PlaceCard";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 3),
  },
  appName: {
    fontSize: "3.2rem",
    fontFamily: "Poppins",
    marginBottom: theme.spacing(3),
    textAlign: "center",
    color: theme.palette.primary.main,
  },
  searchButton: {
    background: grey[200],
    padding: theme.spacing(1, 2),
    color: grey[700],
    "&:hover": {
      border: "1px solid #ccc",
    },
  },

  resultsSection: {
    margin: theme.spacing(2, 0),
  },
}));

const useSearchFieldStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "24px",
  },
}));

type UserCoords = { latitude: number; longitude: number };

const DEFAULT_PAGE_LENGTH = 12;

const getUserCoords: () => Promise<UserCoords> = () =>
  new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => resolve(pos.coords));
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });

const App: React.FC = () => {
  const searchFieldClasses = useSearchFieldStyles();
  const classes = useStyles();
  const [searchRadius, setSearchRadius] = useState<string>("");
  const placesService = useMemo(
    () => new google.maps.places.PlacesService(document.createElement("div")),
    []
  );
  const [results, setResults] = useState<google.maps.places.PlaceResult[]>([]);
  const [pageLength, setPageLength] = useState<number>(DEFAULT_PAGE_LENGTH);

  const handleSearchChange = (event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;
    if (value && (/\D/.test(value) || value.charAt(0) == "0")) return;

    setSearchRadius(value);
  };

  const executeSearch = useCallback(async () => {
    const { latitude: lat, longitude: lng }: UserCoords = await getUserCoords();
    const radius = Number(searchRadius) * 1000;

    if (!radius) {
      setResults([]);
      return;
    }

    const request = {
      location: new google.maps.LatLng(lat, lng),
      radius: radius * 1000,
      type: "hospital",
    };

    console.log("searching");

    placesService.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results.slice(10));
        setResults(results);
      } else {
        setResults([]);
      }
    });
  }, [placesService, searchRadius]);

  const seeMore = () => {
    setPageLength(pageLength + DEFAULT_PAGE_LENGTH);
  };

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  return (
    <div className={classes.root}>
      <form action="" method="post">
        <Typography className={classes.appName}>Clinicity</Typography>

        <Container>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                id="search"
                label="Search radius"
                type="text"
                autoComplete="off"
                value={searchRadius}
                onChange={handleSearchChange}
                InputProps={{
                  classes: searchFieldClasses,
                  startAdornment: (
                    <InputAdornment position="start">km</InputAdornment>
                  ),
                  endAdornment: <SearchIcon />,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} sm={4} md={2}>
              <Button
                className={classes.searchButton}
                color="default"
                fullWidth
                onClick={() => executeSearch()}
              >
                Search
              </Button>
            </Grid>
          </Grid>

          <Paper elevation={0} className={classes.resultsSection}>
            {results.length ? (
              <>
                <Grid container spacing={2}>
                  {results.slice(0, pageLength).map((result) => (
                    <Grid key={result.id} item xs={12} sm={6} md={4}>
                      <PlaceCard data={result} />
                    </Grid>
                  ))}
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={4}></Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      className={classes.searchButton}
                      color="secondary"
                      fullWidth
                      onClick={() => seeMore()}
                    >
                      SEE MORE
                    </Button>
                  </Grid>
                </Grid>
              </>
            ) : null}
          </Paper>
        </Container>
      </form>
    </div>
  );
};

export default App;
