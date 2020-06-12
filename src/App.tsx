import React, { useState, useEffect, useRef, ChangeEvent } from "react";
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
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";

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

  chips: {
    display: "flex",
    flexWrap: "wrap",
  },

  chip: {
    margin: theme.spacing(0, 0.3),
  },

  searchSection: {
    marginBottom: theme.spacing(1),
  },

  multipleSelect: {
    borderRadius: "24px",
    "& > div": {
      // padding: theme.spacing(2, 2),
    },
  },

  resultsSection: {
    margin: theme.spacing(2, 0),
  },

  error: {
    color: grey[700],
    textAlign: "center",
    margin: theme.spacing(3, 2),
  },
}));

const useSearchFieldStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "24px",
  },
}));

const DEFAULT_PAGE_LENGTH = 9;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const placesList = [
  "hospital",
  "pharmacy",
  "clinic",
  "dentist",
  "doctor",
  "drugstore",
];

const App: React.FC = () => {
  // styles
  const searchFieldClasses = useSearchFieldStyles();
  const classes = useStyles();

  // state
  const [searchRadius, setSearchRadius] = useState(1);
  const [searchAddress, setSearchAddress] = useState("");
  const [searchPlaces, setSearchPlaces] = useState<string[]>([]);
  const [results, setResults] = useState<google.maps.places.PlaceResult[]>([]);
  const [pageLength, setPageLength] = useState(DEFAULT_PAGE_LENGTH);
  const [error, setError] = useState("");

  // DOM
  const searchAddressElement = useRef<HTMLInputElement>();

  // services
  const placesService = useRef<google.maps.places.PlacesService>();
  const geocoder = useRef<google.maps.Geocoder>();
  const autocomplete = useRef<google.maps.places.Autocomplete>();

  const handleSearchAddressChange = (event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;
    setSearchAddress(value);
  };

  const handleSearchRadiusChange = (event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;
    if (value && (/\D/.test(value) || value.charAt(0) === "0")) return;
    setSearchRadius(Number(value));
  };

  const handleSearchPlacesChange = (event: any) => {
    const { value } = event.target;
    setSearchPlaces(value);
  };

  const executeSearch = async (r: number = searchRadius) => {
    if (!searchRadius || !searchPlaces.length || !searchAddress) {
      setResults([]);
      return;
    }

    // get coordinates from address
    const geocoderRequest = {
      address: searchAddress,
    };
    geocoder.current?.geocode(geocoderRequest, (results, status) => {
      if (status === "OK") {
        // execute nearby search
        const request = {
          radius: searchRadius * 1000, // meters to km
          location: results[0].geometry.location,
          type: "searchPlaces",
        };

        console.log(request);

        placesService.current?.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            setResults(results);
          } else {
            setError("Oops! I probably busted my daily quota ;)");
            setResults([]);
          }
        });
      } else {
        setError("Ouch! Could not get the reference coordinates :(");
        setResults([]);
      }
    });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    executeSearch();
  };

  const seeMore = () => {
    setPageLength(pageLength + DEFAULT_PAGE_LENGTH);
  };

  useEffect(() => {
    placesService.current = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    geocoder.current = new google.maps.Geocoder();
    autocomplete.current = new google.maps.places.Autocomplete(
      searchAddressElement.current as HTMLInputElement
    );
  }, []);

  return (
    <div className={classes.root}>
      <Typography className={classes.appName}>Clinicity</Typography>
      <form action="" method="post" onSubmit={handleFormSubmit}>
        <Container>
          <Grid
            container
            spacing={2}
            justify="center"
            className={classes.searchSection}
          >
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                id="address"
                label="Reference location"
                type="text"
                autoComplete="off"
                value={searchAddress}
                onChange={handleSearchAddressChange}
                inputProps={{
                  ref: searchAddressElement,
                }}
                InputProps={{
                  classes: searchFieldClasses,
                  endAdornment: <SearchIcon />,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
            className={classes.searchSection}
          >
            <Grid item xs={12} sm={3} md={2}>
              <TextField
                id="radius"
                label="Search radius"
                type="text"
                autoComplete="off"
                value={searchRadius === 0 ? "" : searchRadius}
                onChange={handleSearchRadiusChange}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  classes: searchFieldClasses,
                  endAdornment: (
                    <InputAdornment position="end">km</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <FormControl
                variant="outlined"
                fullWidth
                style={{ background: "transparent" }}
              >
                <InputLabel id="places-label">Places</InputLabel>
                <Select
                  className={classes.multipleSelect}
                  id="places"
                  labelId="places-label"
                  label="Places"
                  multiple
                  value={searchPlaces}
                  onChange={handleSearchPlacesChange}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {(selected as string[]).map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {placesList.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} sm={4} md={2}>
              <Button
                className={classes.searchButton}
                color="default"
                fullWidth
                type="submit"
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
            ) : (
              <Typography className={classes.error}>{error}</Typography>
            )}
          </Paper>
        </Container>
      </form>
    </div>
  );
};

export default App;
