Bouncy bottom sheet for modals, paywalls, and consent flows. Springs up from the bottom; the mascot can host the header. Scrim tap closes it.

```jsx
<Sheet open={open} title="Roast your profile?" header={<Mascot state="idle" size={96} />}
  onClose={close} primaryAction={<Button block>Let's go</Button>}>
  Self + opt-in friends only. Nothing posts without you.
</Sheet>
```
