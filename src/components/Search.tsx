import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import grey from "@material-ui/core/colors/grey";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import HistoryIcon from "@material-ui/icons/History";

const useStyles = makeStyles((theme) => ({
  button: {
    background: grey[200],
    padding: theme.spacing(1, 2),
    color: grey[700],
    "&:hover": {
      border: "1px solid #ccc",
    },
  },

  section: {
    marginBottom: theme.spacing(1),
  },

  select: {
    borderRadius: "24px",
  },

  historyLink: {
    textDecoration: "none",
    fontSize: "1rem",
    fontFamily: "Open Sans",
    marginBottom: theme.spacing(2),
    display: "flex",
    color: theme.palette.primary.light,
    flexDirection: "row-reverse",
    transition: theme.transitions.create("all 0.3s"),

    "&:hover": {
      color: grey[700],
    },

    "& p": {
      display: "flex",
      alignItems: "center",
    },
  },
}));

const useSearchFieldStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "24px",
  },
}));

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

interface InputProps {
  onSuccess: (details: {
    results: google.maps.places.PlaceResult[];
    payload: any;
  }) => void;
  onFailure: (reason: string) => void;
}

const Search: React.FC<InputProps> = ({ onSuccess, onFailure }) => {
  // styles
  const searchFieldClasses = useSearchFieldStyles();
  const classes = useStyles();

  // state
  const location = useLocation();
  const [queryCoords, setQueryCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchRadius, setSearchRadius] = useState(1);
  const [searchAddress, setSearchAddress] = useState("");
  const [searchPlaceType, setSearchPlaceType] = useState("");

  // DOM
  const searchAddressElement = useRef<HTMLInputElement>();

  // services
  const placesService = useRef<google.maps.places.PlacesService>();
  const autocomplete = useRef<google.maps.places.Autocomplete>();

  const handleSearchAddressChange = (event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;
    setSearchAddress(value);
  };

  const handleSearchRadiusChange = (event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;
    if (isValidRadius(value)) {
      setSearchRadius(Number(value));
    }
  };

  const isValidRadius = (value: string) => {
    return !(value && (/\D/.test(value) || value.charAt(0) === "0"));
  };

  const handleSearchPlacesChange = (event: any) => {
    const { value } = event.target;
    setSearchPlaceType(value);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    executeSearch();
  };

  const executeSearch = (cache?: any) => {
    let radius: number, type: string, address: string;
    if (cache) {
      radius = cache.radius;
      type = cache.type;
      address = cache.address;
    } else {
      radius = searchRadius;
      type = searchPlaceType;
      address = searchAddress;
    }

    if (!radius || !type || !address) {
      onFailure("You need to fill in the input fields above!");
      return;
    }

    if (!queryCoords) {
      onFailure("We could not understand the address you specified.");
      return;
    }

    // execute nearby search
    const { lat, lng } = queryCoords;
    const request = {
      radius: radius * 1000, // meters to km
      location: new google.maps.LatLng(lat, lng),
      type: type,
    };

    placesService.current?.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        onSuccess({
          results,
          payload: {
            address,
            radius,
            type,
          },
        });
      } else {
        onFailure("Oops! I probably busted my daily quota ;)");
      }
    });
  };

  // initializer
  useEffect(() => {
    // initialize services
    placesService.current = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    autocomplete.current = new google.maps.places.Autocomplete(
      searchAddressElement.current as HTMLInputElement
    );
    autocomplete.current.setFields([
      "address_components",
      "formatted_address",
      "geometry",
      "name",
    ]);
    autocomplete.current.addListener("place_changed", () => {
      if (!autocomplete.current) return;

      const place = autocomplete.current.getPlace();

      if (!place.geometry) {
        setQueryCoords(null);
        onFailure(`Could not get details for "${place.name}". Sorry!`);
        return;
      }

      setSearchAddress(place.formatted_address as string);
      setQueryCoords({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });
  }, [onFailure]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const [address, radius, type] = [
      params.get("address"),
      params.get("radius"),
      params.get("type"),
    ];
    address && setSearchAddress(address);
    radius && isValidRadius(radius) && setSearchRadius(Number(radius));
    type && setSearchPlaceType(type);

    address &&
      radius &&
      isValidRadius(radius) &&
      type &&
      setTimeout(() => executeSearch({ address, radius, type }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <form action="" method="post" onSubmit={handleFormSubmit}>
      <Grid container spacing={2} justify="center" className={classes.section}>
        <Grid item xs={12} sm={8} md={6}>
          <Link to="/history" className={classes.historyLink}>
            <Typography>
              <HistoryIcon style={{ marginRight: 4 }} /> Search history
            </Typography>
          </Link>

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
        className={classes.section}
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
              endAdornment: <InputAdornment position="end">km</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <FormControl
            variant="outlined"
            fullWidth
            style={{ background: "transparent" }}
          >
            <InputLabel id="place-label">Type of facility</InputLabel>
            <Select
              className={classes.select}
              id="place"
              labelId="place-label"
              label="Type of facility"
              value={searchPlaceType}
              onChange={handleSearchPlacesChange}
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
            className={classes.button}
            color="default"
            fullWidth
            type="submit"
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Search;
