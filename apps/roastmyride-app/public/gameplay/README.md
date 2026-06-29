# Gameplay backgrounds

Drop **licensed / royalty-free** vertical gameplay loops here (e.g. `subway-1080.mp4`),
then register them in `src/gameplayBackgrounds.js` with a `src` pointing at the
public path:

```js
{ id: "subway", label: "Subway run", style: "runner", src: "/gameplay/subway-1080.mp4", credit: "your-license" }
```

The app serves `public/` at the site root, so `/gameplay/<file>` resolves in the
live reel automatically (it layers a looping `<video>` behind the scene).

Guidelines:
- **We ship no copyrighted footage.** Use clips you have the rights to (CC0,
  purchased, or self-recorded). Don't commit Minecraft/Subway Surfers captures.
- Vertical **1080×1920**, clean loop, ~15 to 30s, muted-friendly (audio is mixed
  separately, see the render audio mix).
- With no files here, the reel uses the deterministic in-scene faux backdrops
  (`blocks` / `runner` / `parkour`), so it always looks like *something*.

For the **exported** video: a `src` that is an absolute `http(s)` URL works
directly in Remotion's `<OffthreadVideo>`. For a local file, host it (or place it
in the Remotion bundle's public dir and use `staticFile`) and pass it via the
render CLI `--bg <url>` / the API.
