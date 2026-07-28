import { defineCommand } from "../../utils/defineCommand.js";
import players from "./players.js";
import run from "./run.js";
import info from "./info.js";
export default defineCommand({
  name: "erlc",
  description: "In-game ER:LC commands",

  subcommands: [run, players, info],
});
