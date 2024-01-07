import { config } from "dotenv";
import { Logger } from "../logs/logger";

// new function
const configDotEnv = () => {
  // load the main/general .env file
  config({ path: "src/config/.env" });

  const mode = process.env.NODE_ENV; //dev|test|prod
  Logger.success("App is running in", mode, "Mode");
  Logger.info("Config file:", `src/config/${mode}.env`);

  //load the config file:
  config({ path: `src/config/${mode}.env` });
};

// export the function
export default configDotEnv;
// export the function
export { configDotEnv };

// import {configDotEnv} from 'src/config'
