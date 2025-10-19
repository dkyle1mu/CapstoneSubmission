import * as logger from "firebase-functions/logger";
import {pubsub} from "firebase-functions/v1";

/**
 * Makes a request to the water update endpoint.
 * @return {Promise<Response>} The response from the water update endpoint.
 */
async function fbWater() {
  try {
    const response = await fetch("http://localhost:3000/api/updateWater", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
    });
    return response;
  } catch (error) {
    logger.error("Error in fbWater:", error);
    throw error;
  }
}

export const hourlyFunction = pubsub
  .schedule("0 * * * *")
  .timeZone("America/Chicago")
  .onRun(async () => {
    try {
      const res = await fbWater();
      switch (res.status) {
      case 200:
        logger.log("Watering time!");
        break;
      case 204:
        logger.log("No plants need watering at this time.");
        break;
      default:
        logger.error("Error occurred while updating plant watering times.");
        break;
      }
      return null;
    } catch (error) {
      logger.error("Error in hourlyFunction:", error);
      throw error;
    }
  });
