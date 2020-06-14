import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LocationIcon from "@material-ui/icons/Room";
import grey from "@material-ui/core/colors/grey";
import green from "@material-ui/core/colors/green";
import { NearbySearchPOI } from "../util";

interface PlaceCardProps {
  data: NearbySearchPOI;
}

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "110px",
    boxShadow: "none",
    border: "1px solid #ccc",
    cursor: "pointer",
    "&:hover": {
      boxShadow: theme.shadows[2],
    },
  },
  title: {
    fontSize: "1rem",
    color: grey[800],
    fontWeight: theme.typography.fontWeightBold,
    fontFamily: "'Open Sans', sans-serif",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
  vicinity: {
    fontSize: "0.8rem",
    color: grey[500],
    display: "flex",
    alignItems: "center",
    fontFamily: "'Open Sans', sans-serif",
    marginTop: theme.spacing(1),
  },
  distance: {
    color: grey[600],
    fontSize: "0.9rem",
    fontFamily: "'Open Sans', sans-serif",
    textAlign: "right",
  },
  online: {
    color: green[400],
  },
}));

const PlaceCard: React.FC<PlaceCardProps> = ({ data }) => {
  const classes = useStyles();
  const isOpen = true;

  return (
    <Card
      className={classes.root}
      style={isOpen ? { borderColor: green[400] } : {}}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Typography className={classes.title}>{data.poi.name}</Typography>
            <Typography className={classes.vicinity}>
              <LocationIcon /> {data.address.freeformAddress}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography className={classes.distance}>
              {(data.dist / 1000).toFixed(1)}km
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
