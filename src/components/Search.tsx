import React, { useState, useEffect } from "react";
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import HistoryIcon from "@material-ui/icons/History";
import {
  geocode,
  GeocodeCandidate,
  nearbySearch,
  NearbySearchPOI,
} from "../util";

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
    paddingRight: theme.spacing(2) + "px!important",
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
  onSuccess: (details: { results: NearbySearchPOI[]; payload: any }) => void;
  onFailure: (reason: string) => void;
}

const Search: React.FC<InputProps> = ({ onSuccess, onFailure }) => {
  // styles
  const searchFieldClasses = useSearchFieldStyles();
  const classes = useStyles();

  // state
  const location = useLocation();
  const [searchRadius, setSearchRadius] = useState(1);
  const [searchAddress, setSearchAddress] = useState("");
  const [searchPlaceType, setSearchPlaceType] = useState("");
  const [addressAuto, setAddressAuto] = useState<GeocodeCandidate[]>([]);
  const [
    addressAutoValue,
    setAddressAutoValue,
  ] = useState<GeocodeCandidate | null>(null);
  const [addressAutoOpen, setAddressAutoOpen] = useState(false);
  const addressAutoLoading = addressAutoOpen && addressAuto.length === 0;

  const handleAddressAutoSelect = (
    event: any,
    newValue: GeocodeCandidate | null
  ) => {
    setAddressAutoValue(newValue);

    if (newValue) {
      setSearchAddress(newValue.address.freeformAddress!);
    }
  };

  const handleSearchAddressChange = async (event: React.ChangeEvent<any>) => {
    const { value } = event.target as HTMLInputElement;
    // update visuals first
    setSearchAddress(value);

    if (value) {
      const options = await geocode(value);
      setAddressAuto(options.results || []);
    } else {
      setAddressAuto([]);
    }
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

  const executeSearch = async (cache?: any) => {
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

    // first geocode the address
    let addressGeo;

    if (
      addressAutoValue &&
      addressAutoValue.address.freeformAddress === address
    ) {
      addressGeo = addressAutoValue;
    } else if (address) {
      const g = await geocode(address);
      if (g.results) {
        addressGeo = g.results[0];
      }
    }

    if (!addressGeo) {
      onFailure(`We could not understand the address "${address}"`);
      return;
    }

    const { lat, lon } = addressGeo.position;
    const { results } = await nearbySearch(lat, lon, radius * 1000, type);

    onSuccess({
      results,
      payload: {
        address,
        radius,
        type,
      },
    });
  };

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

          <Autocomplete
            id="address"
            open={addressAutoOpen}
            onOpen={() => {
              setAddressAutoOpen(true);
            }}
            onClose={() => {
              setAddressAutoOpen(false);
            }}
            loading={addressAutoLoading}
            value={addressAutoValue}
            onChange={handleAddressAutoSelect}
            inputValue={searchAddress}
            onInputChange={handleSearchAddressChange}
            options={addressAuto}
            getOptionLabel={(option: any) =>
              (option as GeocodeCandidate).address.freeformAddress
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Reference address"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  classes: searchFieldClasses,
                  endAdornment: <SearchIcon />,
                }}
                fullWidth
              />
            )}
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
