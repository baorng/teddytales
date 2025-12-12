import { Logger, LogLevel } from "@liquidmetal-ai/raindrop-framework";

export const safeLog = (
  logger: Logger,
  level: LogLevel,
  message: string,
  data?: any
) => {
  logger.logAtLevel(level, message, data);
};
