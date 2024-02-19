import axios from "axios";
import { defineConfig } from "cypress";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8081";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8001";

export default defineConfig({
  e2e: {
    baseUrl: FRONTEND_URL,
    setupNodeEvents(on, _config) {
      // implement node event listeners here
      on("task", {
        async seedDatabase() {
          const { data } = await axios.post(
            `${BACKEND_URL}/api/v1/testing/db/seed`,
          );
          return data;
        },
      });
    },
    experimentalStudio: true,
  },
});
