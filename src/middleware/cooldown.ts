import { Message } from "discord.js";
import { logger } from "../utils/logger.js";

interface Cooldown {
  expiresAt: number;
}

const cooldowns = new Map<string, Cooldown>();

export function getCooldownKey(userId: string, commandName: string): string {
  return `${userId}:${commandName}`;
}

export function setCooldown(
  userId: string,
  commandName: string,
  cooldownMs: number,
): void {
  const key = getCooldownKey(userId, commandName);
  cooldowns.set(key, {
    expiresAt: Date.now() + cooldownMs,
  });

  // Auto-cleanup after cooldown expires
  setTimeout(() => {
    cooldowns.delete(key);
  }, cooldownMs);
}

export function getCooldown(userId: string, commandName: string): number {
  const key = getCooldownKey(userId, commandName);
  const cooldown = cooldowns.get(key);

  if (!cooldown) return 0;

  const remainingMs = cooldown.expiresAt - Date.now();
  return remainingMs > 0 ? remainingMs : 0;
}

export function hasCooldown(userId: string, commandName: string): boolean {
  return getCooldown(userId, commandName) > 0;
}

export async function checkCooldown(
  message: Message,
  commandName: string,
  cooldownMs: number = 3000,
): Promise<boolean> {
  if (hasCooldown(message.author.id, commandName)) {
    const remaining = getCooldown(message.author.id, commandName);
    const seconds = (remaining / 1000).toFixed(1);

    await message.reply(
      `⏱️ Please wait ${seconds}s before using \`${commandName}\` again.`,
    );

    return false;
  }

  setCooldown(message.author.id, commandName, cooldownMs);
  return true;
}
