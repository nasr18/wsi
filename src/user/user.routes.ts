import express, { Request, Response } from "express";
import { AxiosResponse } from "axios";

import users from "./payload.json";
import { getAstroCharts, getGeoTime } from "../service/findingyou.service";
import { IUserAstro, IUserGeoTime } from "./user.interface";

export const userRouter = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
  // try {
  // const response = await getGeoTime({
  //   lat: users[0].lat,
  //   lng: users[0].lng,
  //   localTime: users[0].localTime,
  // });
  // console.log("getGeoTime -> resp:", response?.data);

  // const userWithGeoTime: IUserGeoTime = Object.assign({}, users[0], {
  //   utc: response.data.time.utc,
  //   tz: response.data.time.zoneName,
  //   offset: response.data.time.gmtOffset,
  // });
  // console.log("getGeoTime -> userWithGeoTime:", userWithGeoTime);

  // const resp = await getAstrologicalCharts({
  //   lat: users[0].lat,
  //   lng: users[0].lng,
  //   utc: response.data.time.utc,
  // });
  // console.log("getAstro -> resp:", resp?.data);

  // const userWithGeoTimeAndAstroCharts: IUserAstro = Object.assign(
  //   {},
  //   userWithGeoTime,
  //   {
  //     geo: resp.data.geo,
  //     ayanamshaValue: resp.data.ayanamsha.value,
  //     chartLongitudes: resp.data.longitudes,
  //   }
  // );
  // console.log(
  //   "getGeoTime -> userWithGeoTimeAndAstroCharts:",
  //   userWithGeoTimeAndAstroCharts
  // );
  // return res.status(200).json({
  //   msg: "Data retrieved successfully!",
  //   data: userWithGeoTimeAndAstroCharts,
  // });
  // } catch (err: any) {
  //   console.error("error while fetching the products:", { err });
  //   return res.status(500).json({ msg: err.message });
  // }

  const getGeoTimeRequests = users.map((user) =>
    getGeoTime({
      lat: user.lat,
      lng: user.lng,
      localTime: user.localTime,
    })
  );

  try {
    const getGeoTimeResponses = await Promise.all(getGeoTimeRequests);
    console.log(
      "userRoutes -> getGeoTimeResponses:",
      getGeoTimeResponses.length
    );

    const getAstroChartsRequests: Promise<AxiosResponse<any, any>>[] = [];

    const usersWithGeoTime: IUserGeoTime[] = getGeoTimeResponses.map(
      (response, index) => {
        const user = users[index];
        const { utc } = response.data?.time;

        getAstroChartsRequests.push(
          getAstroCharts({
            lat: user.lat,
            lng: user.lng,
            utc,
          })
        );

        return {
          ...user,
          utc: utc as string,
          tz: response.data.time.zoneName as string,
          offset: response.data.time.gmtOffset as number,
        };
      }
    );

    const getAstroChartsResponses = await Promise.all(getAstroChartsRequests);
    console.log(
      "userRoutes -> getAstroChartsResponses:",
      getAstroChartsResponses.length
    );

    const usersWithGeoTimeAndAstroCharts: IUserAstro[] =
      getAstroChartsResponses.map((response, index) => {
        const { lat, lng, ...userWithGeoTime } = usersWithGeoTime[index];

        return {
          ...userWithGeoTime,
          geo: {
            lat,
            lng,
          },
          ayanamshaValue: response.data.ayanamsha.value,
          chartLongitudes: response.data.longitudes,
        };
      });

    return res.status(200).json({
      msg: "Data retrieved successfully!",
      data: usersWithGeoTimeAndAstroCharts,
    });
  } catch (err: any) {
    console.error("userRoutes -> responses -> err:", err.message);
    return res.status(500).json({ msg: err.message, data: [] });
  }
});
