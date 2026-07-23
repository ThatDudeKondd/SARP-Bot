import { defineCommand } from "../../utils/defineCommand.js";
import run from "./run.js";

export default defineCommand({
  name: "erlc",
  description: "In-game ER:LC commands",

  subcommands: [run],
});
