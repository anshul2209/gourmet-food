if (process.env.NODE_ENV !== "production") require("dotenv").config();

const restraunts_url =
  "https://developers.zomato.com/api/v2.1/search?entity_id=1&entity_type=city";
const restraunts_details_url =
  "https://developers.zomato.com/api/v2.1/dailymenu";
const host_url = "https://www.zomato.com";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "";

module.exports = {
  restraunts_url,
  restraunts_details_url,
  host_url,
  apiEndpoint,
};
