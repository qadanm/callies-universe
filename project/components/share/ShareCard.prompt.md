The signature output — the 9:16 frame that IS the shareable content. Loud authored frame (skin) with a clean, AA-legible roast (bones), the **voice/roaster persona** tag, **Callie reacting in the corner** (the cat is a bystander, never the author), and a watermark. Highlight the punch-word via `punch:true` segments.

```jsx
<ShareCard
  roasterName="Ms. Burnt" spice="savage"
  mascot={<Mascot state="savage" size={92} />}
  roast={[
    {text: "This Civic has "},
    {text: "more body kit", punch: true},
    {text: " than horsepower."},
  ]}
/>
```
