import { setDefaultResultOrder } from "dns";
import axios from "axios";

setDefaultResultOrder("ipv4first");

const findingYouApis = {
  services: "https://services.findingyou.co",
  astro: "https://astroapi.findingyou.co",
};

axios.interceptors.request.use((req) => {
  console.log("findingyouService -> request interceptor:", req.url);
  req.headers["request-startTime"] = new Date().getTime();

  return req;
});

axios.interceptors.response.use((res) => {
  const startTime = res.config.headers["request-startTime"];
  const timeElapsed = new Date().getTime() - startTime;
  console.log(
    "findingyouService -> res interceptor:",
    res.config.url,
    "took",
    timeElapsed,
    "ms"
  );
  return res;
});

const getGeoTime = ({
  lat,
  lng,
  localTime,
}: {
  lat: number;
  lng: number;
  localTime: string;
}) => {
  return axios.get(
    `${findingYouApis.services}/gtz/geotime?loc=${lat},${lng}&dtl=${localTime}`
  );
  // .then((resp) => {
  //   console.log("findingyouService -> getUtcDateTimes -> resp:", resp);
  // })
  // .catch((err) => {
  //   console.error("findingyouService -> getUtcDateTimes -> err:", err);
  // })
  // .finally(() => {
  //   console.log("finally");
  // });
};

const getAstroCharts = ({
  lat,
  lng,
  utc,
}: {
  lat: number;
  lng: number;
  utc: string;
}) => {
  // comma-separated list of required celestial bodies
  const bodies = "as,su,mo,ma,me,ju,ve,sa";
  // Ayanamsha, use tc for true citra in Indian astrology
  const aya = "tc";
  // apply ayanamsha to all longitudes
  const sid = 1;

  return axios.get(
    `${findingYouApis.astro}/positions?bodies=${bodies},aya=${aya},sid=${sid},loc=${lat},${lng}&dt=${utc}`
  );
  // .then((resp) => {
  //   console.log("findingyouService -> getAstrologicalCharts -> resp:", resp);
  // })
  // .catch((err) => {
  //   console.error("findingyouService -> getAstrologicalCharts -> err:", err);
  // })
  // .finally(() => {
  //   console.log("finally");
  // });
};

export { getGeoTime, getAstroCharts };
