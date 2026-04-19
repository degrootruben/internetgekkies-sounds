#!/usr/bin/env node

import { readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { platform } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const soundsRoot = join(__dirname, "..", "sounds");

// Event-based sound selection: SOUND_EVENT env var determines which subfolder to use
// Fallback chain: sounds/<event>/ → sounds/default/ → sounds/ (root)
const event = process.env.SOUND_EVENT;

function getMp3Files(dir) {
  try {
    return existsSync(dir)
      ? readdirSync(dir).filter((f) => f.endsWith(".mp3")).map((f) => join(dir, f))
      : [];
  } catch {
    return [];
  }
}

let allFiles = [];
if (event) {
  allFiles = getMp3Files(join(soundsRoot, event));
}
if (allFiles.length === 0) {
  allFiles = getMp3Files(join(soundsRoot, "default"));
}
if (allFiles.length === 0) {
  allFiles = getMp3Files(soundsRoot);
}

if (allFiles.length === 0) {
  process.exit(0);
}

// Pick a random sound
const filePath = allFiles[Math.floor(Math.random() * allFiles.length)];

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

