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

// Play using the platform's audio player
const os = platform();
let player;

if (os === "darwin") {
  // macOS
  player = spawn("afplay", [filePath], { stdio: "ignore" });
} else if (os === "win32") {
  // Windows — use PowerShell to play mp3 via Windows Media Player COM object
  const psScript = `
    Add-Type -AssemblyName presentationCore
    $player = New-Object System.Windows.Media.MediaPlayer
    $player.Open([Uri]"${filePath.replace(/\\/g, "\\\\")}")
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
          ? ["-nodisp", "-autoexit", filePath]
          : cmd === "mpv"
            ? ["--no-video", filePath]
            : [filePath];
      player = spawn(cmd, args, { stdio: "ignore" });
      break;
    } catch {
      continue;
    }
  }
}

