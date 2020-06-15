import React from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useTheme } from "@material-ui/core";

export default function NotFound() {
  const theme = useTheme();

  return (
    <Container>
      <Paper elevation={0}>
        <Typography
          variant="h3"
          style={{
            fontFamily: "Poppins",
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(2),
          }}
        >
          Oops!
        </Typography>
        <Typography
          variant="h5"
          style={{
            fontFamily: "Open Sans",
          }}
        >
          We could not find the page you were looking for.&nbsp;
          <Link
            to="/"
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
            }}
          >
            Go home.
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
