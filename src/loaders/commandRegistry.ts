import { UnifiedCommand } from "../types/UnifiedCommand.js";

let allCommands: UnifiedCommand[] = [];

export function setCommandRegistry(commands: Map<string, UnifiedCommand>) {
  allCommands = [...commands.values()];
}

export function getCommandRegistry(): UnifiedCommand[] {
  return allCommands;
}
