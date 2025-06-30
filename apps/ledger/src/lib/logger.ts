import { Logger } from "@repo/logger";
import { env } from "../config/env";

const logger = Logger.getLogger({
  level: "trace",
  prettyPrint: true,
  environment: env.NODE_ENV,
});

export default logger;
