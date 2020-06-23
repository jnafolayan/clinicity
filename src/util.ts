import { TOMTOM } from "./config";

export type UserCoords = { latitude: number; longitude: number };

export const getUserCoords: () => Promise<UserCoords> = () =>
  new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => resolve(pos.coords));
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });

export interface GeocodeResult {
  summary: any;
  results?: GeocodeCandidate[];
}

export interface GeocodeCandidate {
  address: {
    freeformAddress: string;
  };
  position: {
    lat: number;
    lon: number;
  };
  score: number;
}

export const geocode = async (address: string): Promise<GeocodeResult> => {
  const url = `https://api.tomtom.com/search/2/geocode/${address}.json?&key=${TOMTOM.API_KEY}`;
  return await fetch(url).then((resp) => resp.json());
};

export interface POICategory {
  id: number;
  name: string;
  synonyms: string[];
}

export const getPOICFor = (() => {
  let poics: POICategory[];

  return async (place: string): Promise<POICategory | null> => {
    if (!poics) {
      const url = `https://api.tomtom.com/search/2/poiCategories.json?key=${TOMTOM.API_KEY}`;
      const result: { poiCategories: POICategory[] } = await fetch(
        url
      ).then((resp) => resp.json());
      poics = result.poiCategories.map((poic) => ({
        ...poic,
        name: poic.name.toLowerCase(),
        synonyms: poic.synonyms.map((s) => s.replace(/ /g, "").toLowerCase()),
      }));
    }
    return (
      poics.find(
        (poic) => poic.name === place || poic.synonyms.includes(place)
      ) || null
    );
  };
})();

export interface NearbySearchResult {
  summary: any;
  results: NearbySearchPOI[];
}

export interface NearbySearchPOI {
  address: string;
  dist: number;
  id: string;
  name: string;
}

export const nearbySearch = async (
  lat: number,
  lon: number,
  radius: number,
  place: string
): Promise<NearbySearchResult> => {
  // get POI category
  const poic = (await getPOICFor(place)) as POICategory; // force to be valid
  const cat = poic.id;
  const url = `https://api.tomtom.com/search/2/nearbySearch/.json?lat=${lat}&lon=${lon}&radius=${radius}&categorySet=${cat}&key=${TOMTOM.API_KEY}`;
  return await fetch(url)
    .then((resp) => resp.json())
    .then((r) => ({
      summary: r.summary,
      results: r.results.map((res: any) => ({
        address: res.address.freeformAddress,
        dist: res.dist,
        id: res.id,
        name: res.poi.name,
      })),
    }));
};
