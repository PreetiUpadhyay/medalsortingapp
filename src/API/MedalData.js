import axios from "axios";

const headers = {
  "content-type": "application/json",
  "x-requested-with": "XMLHttpRequest",
  "x-include-content": "true",
};

const getMedalData = () => {
  const apiEndPoint = "http://localhost:3001/medals";
  return axios.get(apiEndPoint, headers);
};

export default getMedalData;
