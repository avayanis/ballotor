import * as pino from "pino";

export default pino({
  name: "ballator-api",
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: !(process.env.NODE_ENV === "production")
});
