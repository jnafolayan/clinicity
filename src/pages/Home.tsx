import React, { useState, useContext } from "react";
import Container from "@material-ui/core/Container";

import Search from "../components/Search";
import SearchResults from "../components/SearchResults";
import { NearbySearchPOI } from "../util";
import { UserContext } from "../providers/UserProvider";
import { GRAPHQL_URL } from "../config";

const HomePage: React.FC = () => {
  const {
    state: { user },
  } = useContext(UserContext);
  const [results, setResults] = useState<NearbySearchPOI[]>([]);
  const [error, setError] = useState("");

  const onSuccess = async ({
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
      const query = `mutation Search($uid: String!, $radius: Float!, $address: String!, $type: String!) {
        search(uid: $uid, radius: $radius, address: $address, type: $type) {
          _id
        }
      }`;

      try {
        await fetch(GRAPHQL_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query,
            variables: {
              uid: user.uid,
              radius: parseFloat(payload.radius),
              address: payload.address,
              type: payload.type,
            },
          }),
        });
      } catch (error) {
        console.error(error);
      }
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

export default HomePage;
