import axios from "axios";
import { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
export const baseURL = "http://localhost:7228/api/";
const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem("Token")
        ? JSON.parse(localStorage.getItem("Token") || "null")
        : null
    }`,
    Accept: "application/json, text/plain, */*",
  },
});

export default api;