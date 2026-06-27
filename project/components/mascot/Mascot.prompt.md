**Callie** — the mascot of **Callie's Universe** and the recognizable face of *every* app in it. A kawaii, squishy **calico cat** (cream + ginger + charcoal — the same coat the brand palette is derived from). One character, reused everywhere via a named state system.

**Callie reacts, she never narrates** — she's the wordless emotional surrogate (no localization, ever). The character cast does the talking.

```jsx
<Callie state="savage" size={140} />
<Callie state="comfort" size={120} />
<Callie state="idle" placeholderTag />
```

Nine canonical states: `idle`, `curious`, `cooking`, `delighted`, `savage`, `comfort`, `celebrating`, `empty`, `error`. (`Mascot` is a legacy alias for `Callie` — identical art.)

### `CallieHost` — the brain (same module)
Drop `CallieHost` (alias `MascotHost`) in wherever Callie should feel alive. It plays an entrance state, idle-cycles a context pool, reacts to user events, and can float a Clippy-style tip.

```jsx
<CallieHost context="home" size={120} bubble />
<CallieHost context="call" event={answered ? "answer" : null} />
```

Personality per app/screen lives in the `CALLIE_SCRIPT` data block at the bottom of `Mascot.jsx` — edit data, not the component. PLACEHOLDER art: swap the calico cat for final illustration keyed to the same state names; every app picks it up.
