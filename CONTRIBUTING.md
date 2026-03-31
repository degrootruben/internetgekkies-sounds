# Contributing Sound Packs

## Creating a sound pack

A sound pack is a separate repository with this structure:

```
my-pack/
  sounds/       <- your .mp3 files go here
  pack.json     <- metadata
  LICENSE       <- required
```

### pack.json

```json
{
  "name": "my-pack",
  "description": "A short description of your pack",
  "author": "your-github-username",
  "license": "MIT"
}
```

### Sound file guidelines

- Format: `.mp3` only
- Keep clips short (under 10 seconds)
- Use lowercase kebab-case filenames: `my-sound-clip.mp3`
- No silence padding at the start or end

### Copyright

- Only include audio you have the right to distribute
- Do not include copyrighted music, TV/movie clips, or other protected content without permission
- You are responsible for the content in your pack
- Packs without a LICENSE file will not be listed in the community registry

## Adding your pack to the registry

1. Publish your pack as a public GitHub repository
2. Open a PR to this repo adding your pack to `COMMUNITY_PACKS.md`
3. Include: pack name, your username, a short description, and a link

## Installing a pack

```bash
mkdir -p ~/.claude/sound-packs
cd ~/.claude/sound-packs
git clone https://github.com/you/your-pack
```

The plugin automatically scans `~/.claude/sound-packs/*/sounds/` for `.mp3` files.
