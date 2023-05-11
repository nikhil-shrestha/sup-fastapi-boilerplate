// First we need to import axios.js
import axios from "axios";

export const baseURL = "/api/v1";

// Next we make an 'instance' of it
const instance = axios.create({
  // .. where we make our configurations
  baseURL: baseURL,
});

export const setAuthToken = (token) => {
  if (token) {
    instance.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers["Authorization"];
  }
};

export default instance;
