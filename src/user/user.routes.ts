import express, { Request, Response } from "express";
import { AxiosResponse } from "axios";

import users from "./payload.json";
import { getAstroCharts, getGeoTime } from "../service/findingyou.service";
import { IUserAstro, IUserGeoTime } from "./user.interface";

export const userRouter = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
  const getGeoTimeRequests = users.map((user) =>
    getGeoTime({
      lat: user.lat,
      lng: user.lng,
      localTime: user.localTime,
    })
  );

  try {
    const getGeoTimeResponses = await Promise.all(getGeoTimeRequests);

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
