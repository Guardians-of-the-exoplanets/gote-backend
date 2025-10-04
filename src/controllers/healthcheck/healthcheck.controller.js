import { healthcheck } from "../../services/healthcheck/healthcheck.service.js";

export const healthcheckController = (_, res) => {
  res.send(healthcheck());
};
