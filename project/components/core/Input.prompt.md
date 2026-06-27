Clean, high-contrast text field for the functional layer (sign-in, names, handles). Obvious cyan focus ring; error flips the border to danger and sets `aria-invalid`.

```jsx
<Input label="Your handle" placeholder="@yourname" hint="Friends only — opt-in" />
<Input label="Email" error="That doesn't look right" />
```

Minimal decoration by design — this is bones, not skin.
