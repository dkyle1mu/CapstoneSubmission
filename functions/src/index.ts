import * as logger from "firebase-functions/logger";
import {pubsub} from "firebase-functions/v1";
import fetch from "node-fetch";

/**
 * @async
 * @return {Promise<Response>}
 * @throws {Error}
 */
async function fbWater() {
  try {
    const response = await fetch("http://garden-helper.org/api/updateWater", {
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
  .schedule("*/6 * * * *")
  .timeZone("America/Chicago")
  .onRun(async () => {
    try {
      const res = await fbWater();
      switch (res.status) {
      case 200:
        logger.log("Watering time!");
        const payload = await res.json().catch(() => null);
        if (Array.isArray(payload)) {
            for (const n of payload) {
                const options = {
                    body: n,
                    data: { url: '/' },
                };
                new Notification('Watering Time!', options);
            }
        }
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
