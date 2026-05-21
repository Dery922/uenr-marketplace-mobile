// config/env.ts
import { IP_ADDRESS } from "@/api/demon";
const ENV = {
  dev: {
    API_URL: `${IP_ADDRESS}:5000`,
  },
  prod: {
    API_URL: "https://your-app.onrender.com",
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  }
  return ENV.prod;
};

export default getEnvVars();
