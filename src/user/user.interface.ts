interface IGeo {
  lat: number;
  lng: number;
}

interface IUser {
  name: string;
  gender: string;
  localTime: string;
}

interface IGeoTime {
  utc: string;
  tz: string;
  offset: number;
}

interface IAstro {
  geo: IGeo;
  ayanamshaValue: number;
  chartLongitudes: {
    [key: string]: number;
  };
}

type IUserGeo = IUser & IGeo;

type IUserGeoTime = IUserGeo & IGeoTime;

type IUserAstro = IUser & IGeoTime & IAstro;

export { IUserGeoTime, IUserAstro };
