Reusable character-tile / cast-picker — the featured roaster (avatar, catchphrase, spice meter, favorite) over a tap-to-switch grid. Reads the cast from `Roaster.roster`, so it auto-extends as characters are added. App-agnostic: wrap it with your own header (Callie) and confirm CTA.

```jsx
const [sel, setSel] = useState(null);
<CastPicker initialId="mama" onChange={setSel} />
<Button block onClick={cook}>Cook it with {sel?.name}</Button>
```
