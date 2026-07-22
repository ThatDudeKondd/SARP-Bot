import { defineCommand } from "../../utils/defineCommand.js";
import setup from "./setup.js";
import configuration from "./configuration.js";

export default defineCommand({
  name: "server",
  description: "Server management commands.",

  subcommands: [setup, configuration],
});
