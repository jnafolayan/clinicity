import React, { useState } from "react";
import Container from "@material-ui/core/Container";

import Search from "../components/Search";
import SearchResults from "../components/SearchResults";

interface InputProps {
  db: firebase.firestore.Firestore;
}

const Home: React.FC<InputProps> = ({ db }) => {
  const [results, setResults] = useState<google.maps.places.PlaceResult[]>([]);
  const [error, setError] = useState("");

  const onSuccess = ({
    results,
    payload,
  }: {
    results: google.maps.places.PlaceResult[];
    payload: any;
  }) => {
    setResults(results);
    // save search
    console.log(payload);
    db.collection("searches").add(payload);
  };
  const onFailure = (reason: string) => {
    // clear the results
    setResults([]);
    setError(reason);
  };

  return (
    <Container>
      <Search onSuccess={onSuccess} onFailure={onFailure} />
      <SearchResults results={results} error={error} />
    </Container>
  );
};

export default Home;
