# internetgekkies-sounds

A Claude Code plugin that plays random iconic Dutch Internetgekkies sound clips whenever Claude finishes a task or sends a notification.

Featuring classics like "dikke bmw", "KRAKAKA", "ik wil kaas", "mand", and many more.

## Installation

### From GitHub Marketplace

```
/plugin marketplace add degrootruben/internetgekkies-sounds
/plugin install internetgekkies-sounds@degrootruben-internetgekkies-sounds
```

### Local Development

```bash
claude --plugin-dir ~/Projects/internetgekkies-sounds
```

## How it works

The plugin registers hooks on two events:

- **Stop** — when Claude finishes responding
- **Notification** — when Claude sends a notification (permission prompts, idle prompts, etc.)

Each time, a random `.mp3` from the `sounds/` folder is played using the platform's native audio player.

## Platform support

| Platform | Audio player |
|----------|-------------|
| macOS | `afplay` (built-in) |
| Windows | PowerShell `System.Windows.Media.MediaPlayer` (built-in) |
| Linux | `mpv`, `ffplay`, or `paplay` (install one) |

## Volume

The default volume is 50 (out of 100). To change it, edit the `VOLUME` value in `hooks/hooks.json`:

```json
"command": "VOLUME=75 node \"${CLAUDE_PLUGIN_ROOT}/scripts/play-random.mjs\""
```

Set `VOLUME` to any value from `0` (silent) to `100` (max).

## Sound packs

The plugin supports community sound packs. Install extra packs by cloning them into `~/.claude/sound-packs/`:

```bash
mkdir -p ~/.claude/sound-packs
cd ~/.claude/sound-packs
git clone https://github.com/someone/their-pack
```

Any `.mp3` files in `<pack>/sounds/` are automatically added to the random rotation alongside the built-in sounds.

See [COMMUNITY_PACKS.md](COMMUNITY_PACKS.md) for available packs and [CONTRIBUTING.md](CONTRIBUTING.md) to create your own.

## Adding your own sounds

Drop any `.mp3` file into the `sounds/` folder and it will be included in the random rotation.

## Included sounds

| File | Description |
|------|-------------|
| `dikke-bmw.mp3` | Dikke BMW! |
| `horsefighter.mp3` | Horsefighter |
| `KRAKAKA.mp3` | KRAKAKA |
| `mand.mp3` | Mand! |
| `ik-wil-kaas.mp3` | Ik wil kaas |
| `rustaagh.mp3` | Rustaagh |
| `helemaal-gek.mp3` | Joost, helemaal gek |
| `biem.mp3` | Biem |
| `willy.mp3` | Willy! |
| `haha-bier.mp3` | Haha bier |
| `lidl.mp3` | Lidl |
| `knettah.mp3` | Knettah |
| `altijd-herres.mp3` | Altijd herres |
| `vuurwerkje.mp3` | Vuurwerkje afgestoken |
| `diadeem.mp3` | Diadeem |
| `doeken.mp3` | Doeken |
| ...and 26 more | |

## License

MIT
