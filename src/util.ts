export type UserCoords = { latitude: number, longitude: number };

export const getUserCoords: () => Promise<UserCoords> = () =>
  new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => resolve(pos.coords));
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
