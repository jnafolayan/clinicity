import React, { useState } from "react";
import Container from "@material-ui/core/Container";

import Search from "../components/Search";
import SearchResults from "../components/SearchResults";
import { NearbySearchPOI } from "../util";
import { firestore } from "../firebase";

const Home: React.FC = () => {
  const [results, setResults] = useState<NearbySearchPOI[]>([]);
  const [error, setError] = useState("");

  const onSuccess = ({
    results,
    payload,
  }: {
    results: NearbySearchPOI[];
    payload: any;
  }) => {
    setResults(results);

    if (!results.length) {
      setError(`Could not find any ${payload.type} in the area.`);
    } else {
      // save search
      firestore.collection("searches").add({
        ...payload,
        user: localStorage.id,
        createdAt: new Date(),
      });
    }
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
