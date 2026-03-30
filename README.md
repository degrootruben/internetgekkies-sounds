# internetgekkies-sounds

A Claude Code plugin that plays random iconic Dutch [Internetgekkies](https://www.youtube.com/@Internetgekkies) sound clips whenever Claude finishes a task or sends a notification.

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

## Adding your own sounds

Drop any `.mp3` file into the `sounds/` folder and it will be included in the random rotation.

## Included sounds

| File | Description |
|------|-------------|
| `dikke-bmw.mp3` | Dikke BMW! |
| `KRAKAKA.mp3` | KRAKAKA |
| `mand.mp3` | Mand! |
| `ik-wil-kaas.mp3` | Ik wil kaas |
| `rustaagh.mp3` | Rustaagh |
| `helemaal-gek.mp3` | Helemaal gek |
| `biem.mp3` | Biem |
| `willy.mp3` | Willy |
| `haha-bier.mp3` | Haha bier |
| `lidl.mp3` | Lidl |
| `knettah.mp3` | Knettah |
| `altijd-herres.mp3` | Altijd herres |
| `vuurwerkje.mp3` | Vuurwerkje |
| `diadeem.mp3` | Diadeem |
| `doeken.mp3` | Doeken |
| ...and 26 more | |

## License

MIT
