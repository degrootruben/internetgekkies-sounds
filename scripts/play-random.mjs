#!/usr/bin/env node

import { readdirSync } from "fs";
import { join, dirname } from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { platform } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const soundsDir = join(__dirname, "..", "sounds");

// Get all mp3 files
const files = readdirSync(soundsDir).filter((f) => f.endsWith(".mp3"));
if (files.length === 0) {
  process.exit(0);
}

// Pick a random sound
const file = files[Math.floor(Math.random() * files.length)];
const filePath = join(soundsDir, file);

// Volume: 0-100, check VOLUME env var first, then CLAUDE_PLUGIN_OPTION_VOLUME, default 50
const volumePercent = Math.max(0, Math.min(100, parseInt(process.env.VOLUME || process.env.CLAUDE_PLUGIN_OPTION_VOLUME || "50", 10)));
const volumeNormalized = volumePercent / 100; // 0.0 - 1.0

// Play using the platform's audio player
const os = platform();
let player;

if (os === "darwin") {
  // macOS — afplay uses 0.0 to 1.0 scale
  player = spawn("afplay", ["-v", String(volumeNormalized), filePath], { stdio: "ignore" });
} else if (os === "win32") {
  // Windows — MediaPlayer.Volume uses 0.0 to 1.0 scale
  const psScript = `
    Add-Type -AssemblyName presentationCore
    $player = New-Object System.Windows.Media.MediaPlayer
    $player.Open([Uri]"${filePath.replace(/\\/g, "\\\\")}")
    $player.Volume = ${volumeNormalized}
    $player.Play()
    Start-Sleep -Milliseconds 500
    while ($player.Position -lt $player.NaturalDuration.TimeSpan) { Start-Sleep -Milliseconds 200 }
    $player.Close()
  `;
  player = spawn("powershell", ["-NoProfile", "-Command", psScript], {
    stdio: "ignore",
  });
} else {
  // Linux — try mpv, then ffplay, then paplay
  for (const cmd of ["mpv", "ffplay", "paplay"]) {
    try {
      const args =
        cmd === "ffplay"
          ? ["-nodisp", "-autoexit", "-volume", String(volumePercent), filePath]
          : cmd === "mpv"
            ? ["--no-video", `--volume=${volumePercent}`, filePath]
            : [filePath];
      player = spawn(cmd, args, { stdio: "ignore" });
      break;
    } catch {
      continue;
    }
  }
}

