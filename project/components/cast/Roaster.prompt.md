The **voice cast** — the eight named roasters who actually deliver the roast (the cast performs; Callie the mascot only reacts). Each `id` is a unique, recognizable kawaii bust in Callie's world.

```jsx
<Roaster id="mama" size={120} ring />
<Roaster id="kenji" size={96} />

// build cast tiles from the static roster metadata:
Roaster.roster.map(r => <Roaster key={r.id} id={r.id} ring />)
// r = { id, name, tag, register, spice, phrase, ring, ... }
```

Cast: `reginald` (posh nat-geo narrator), `tony` (exasperated New Yorker), `abuomar` (warm Egyptian uncle), `mama` (loving-savage mom), `mateo` (telenovela hype-man), `jeanluc` (unbothered Frenchman), `priya` (comparison auntie), `kenji` (zen minimalist).

Each character's comedy aims at the **car**, never their culture — keep copy affectionate (PG-13). PLACEHOLDER art, built to be swapped for final illustration keyed to the same `id`.
