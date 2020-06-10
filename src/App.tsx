import React, { useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import Container from "@material-ui/core/Container";
import grey from "@material-ui/core/colors/grey";

// const API_KEY = "AIzaSyAT2LO95_fxvuP39_mku1nTyJ2ZIoz-z8Y";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 3),
  },
  appName: {
    fontSize: "3.2rem",
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
}));

const useSearchFieldStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "24px",
  },
}));

type UserCoords = { latitude: number; longitude: number };

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

  const handleSearchChange = (event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;
    if (value && (/\D/.test(value) || value.charAt(0) == "0")) return;

    setSearchRadius(value);
  };

  useEffect(() => {
    (async () => {
      const {
        latitude: lat,
        longitude: lng,
      }: UserCoords = await getUserCoords();
      const radius = Number(searchRadius) * 1000;

      if (!radius) return;

      const request = {
        location: new google.maps.LatLng(lat, lng),
        radius: radius * 1000, //m
        type: "hospital",
      };

      placesService.nearbySearch(request, (results, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          console.log(results);
        }
      });
    })();
  }, [searchRadius]);

  return (
    <div className={classes.root}>
      <form action="" method="post">
        <Typography className={classes.appName}>Clinicity</Typography>

        <Container>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} sm={6} md={8}>
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
            <Grid item xs={12} sm={4} md={3}>
              <Button
                className={classes.searchButton}
                color="default"
                fullWidth
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Container>
      </form>
    </div>
  );
};

export default App;
