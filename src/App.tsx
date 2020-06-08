import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 3)
  }
}));

const useSearchFieldStyles = makeStyles((theme) => ({
  root: {
  }
}));

type UserCoords = { latitude: number; longitude: number };

const getUserCoords: () => Promise<UserCoords> = () => 
  new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => resolve(pos.coords));
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });

const App: React.FC = () => {
  const searchFieldClasses = useSearchFieldStyles();
  const classes = useStyles();
  const [searchRadius, setSearchRadius] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const coords: UserCoords = await getUserCoords();
      console.log(coords);
    })();
  }, []);

  return (
    <div className={classes.root}>
      <form action="" method="post">
        <Grid container>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <TextField 
              id="search" 
              label="Search radius" 
              type="number"
              InputProps={{
                classes: searchFieldClasses,
                startAdornment: <InputAdornment position="start">km</InputAdornment>
              }}
              variant="outlined" 
              fullWidth 
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default App;
