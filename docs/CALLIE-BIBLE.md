# The Callie Bible — canon

> **The single source of truth for who Callie is and how the universe holds together.**
> Every copy, art, UX, and code decision checks against this doc. It is deliberately short so it
> actually gets followed. The longer playbooks — [`CREATIVE-POSITIONING-PLAN.md`](./CREATIVE-POSITIONING-PLAN.md)
> and [`CALLIES-UNIVERSE-CREATIVE-DIRECTOR-PROMPT.md`](./CALLIES-UNIVERSE-CREATIVE-DIRECTOR-PROMPT.md) —
> are the expanded strategy. **Where they conflict with this file, this file wins.**
> The canonical cast roster lives in code: `core/src/components/cast/Roaster.jsx` (`Roaster.roster`).

---

## The keystone

Twelve words that answer *why a cat, why she's everywhere, why she only reacts, why it's safe, and why it's funny* — all at once:

> **Callie loves you way too much to roast you — so she hired comedians who don't.**

Lead with this. It's the brand. Everything below is just protecting it.

---

## Who Callie is

Callie is **the host of the studio and your ally in the room** — the same character doing two jobs that never conflict:

- **Host** — it's literally *her* universe; she runs every show. (Why she's on every screen.)
- **Ally / "good cop"** — she's too soft-hearted to roast you, so she watches from the corner and reacts *on your side*. (Why she never roasts, and why getting roasted here feels like love, not bullying.)

Callie **is the "clever, never cruel" promise made adorable.** The comedians go in on your *stuff*; Callie guarantees nobody's going in on *you*. That guarantee is her whole reason to exist — not decoration, not a logo, the emotional contract of the brand.

She is **never** the one roasting. She reacts. That's the entire job, and it's enough.

---

## The three rules (non-negotiable)

1. **Callie never speaks.** She has never said a word — nobody's sure she can. She communicates entirely through reactions (her 9 states: idle, curious, cooking, delighted, savage, comfort, celebrating, empty, error). This is canon, not a limitation: it's more cat, more charming, more mysterious, and it localizes to every market for free. *Framing words come from the **UI/system voice**, never from "Callie talking."* If she must "say" something, it's a wordless bubble — an emoji, a doodle — never a sentence.

2. **Callie never holds a mic. Performers always do.** This is the one-screenshot test: any single frame, sound off, no text — a stranger must be able to tell Callie isn't the one roasting. The microphone (and the stage/spotlight/`LIVE` badge) marks a performer; the corner + a `★ Callie` tag marks the host. Encode this everywhere — app screens *and* video.

3. **The joke aims at the thing, never the person.** The car, the texts, the fit, the room, the profile — never the owner's body, worth, or identity. Callie is the living proof of this rule; if a line would punch at the person, it's off-brand and Callie wouldn't be smiling.

---

## The visual grammar (how the roles read with zero words)

| Role | Always signaled by | Never has |
|---|---|---|
| **Callie** — host + ally | the corner / host spot, a `★ Callie` tag, reaction-only, big feelings | a microphone |
| **The cast** — performers | a 🎤, the stage/spotlight, a `LIVE` badge, name + catchphrase | the host's corner |
| **You** — guest star | your upload, framed as "tonight's subject" / "now reviewing" | — |

If a screen or frame doesn't make these three legible **without reading anything**, it's not done.

---

## Who speaks (and who doesn't)

- **The UI / system voice** carries all framing copy (onboarding, tips, buttons, captions). Warm, short, verb-first. This is *not* "Callie's voice" — it's the show's narrator/host-desk captioning.
- **Callie** speaks only in reactions — face, body, the occasional wordless bubble. Zero sentences, ever.
- **The comedians** speak in-character, from the cast bible — their voice, their catchphrase, aimed at the subject. They are the only ones who "talk."

This resolves the contradiction in the earlier docs (which had Callie chatting). **Callie is wordless. The app narrates.**

---

## The backstory (fun first; lore is a reward, not a prerequisite)

Short enough to fit on a sticker; emotional first, easter eggs last:

> **Callie** opened the only comedy club where the star is *whatever you walked in with.* Trouble is, she's a
> calico with a heart three sizes too big — she'd start a roast and apologize halfway through. So she did the next
> best thing: she **hired the funniest, meanest-in-a-loving-way comedians from every corner of the world,** gave
> them a stage, and pulled up a chair in the corner to watch. She hasn't missed a show since. She's never said a
> word. She doesn't need to — her face says everything.
>
> *Deep cut for the fans: her full name is Calliope. Yes, like the muse. No, she won't talk about it. A calico is
> three colors, no two alike — just like her cast. She didn't plan that. It works anyway.*

**Do not front-load this.** Get the user to their first roast fast; reveal the universe *after* the payoff. The backstory is the About-page reward and the fandom hook — never an onboarding gate.

---

## The franchise structure

```
Callie's Universe        — the studio (one host: Callie)
 └─ "Roast My ___" shows  — Ride · Texts · Fit · Room · Profile (one per subject/site/app)
     └─ the cast          — recurring comedians who perform in every show
         └─ you           — the guest star whose thing gets roasted
```

**Canon:** one studio, many shows, one wordless host, a recurring cast you can follow across apps, one repeatable format (bring it → pick a comic → they cook → reveal → share). Same studio, different set dressing.

**Optional (nice-to-have, label as such — not required for the brand to make sense):** episode numbers, "seasons," TV-style show-graphics overlays, comedian-of-the-week, merch. Use them to *deepen*, never to *explain*.

---

## Tone

Warm, unserious, clever — never cruel, never corporate, never techy. A cat running a comedy empire *is* the joke; lean into the absurdity, don't over-explain it. Sentence case everywhere; ALL CAPS only on tiny sticker labels (`NEW`, `HOT`). Downplay "AI" in consumer-facing copy — we're a **comedy studio with a cast of characters,** not an AI tool. The look is **authored, not generated** (the hand-drawn / sticker / comic-zine house style *is* Callie's world).

---

## The "why is there a cat?" answer card (copy-pasteable)

> Callie runs the studio — it's her universe. She's a calico with too big a heart to roast anyone herself, so she
> hired a cast of comedians to do it while she watches from the corner and reacts, always on your side. She never
> roasts you, and she never says a word. The comedians bring the heat; Callie makes sure it stays clever, never cruel.

Drop this into App Store text, the About page, press, bios — anywhere the question could come up.

---

## The canon checklist (every decision passes this)

1. Is Callie the host/ally — never the one roasting?
2. Is Callie wordless (no sentences), with framing copy in the system voice?
3. Can you tell who's who **with the sound off and no text** (mic vs corner)?
4. Is the comedy aimed at the *subject*, never the person?
5. Does it feel warm, unserious, authored — not corporate, techy, or generated?
6. Does the universe feel intentional (one studio, one host, recurring cast) — not random?
7. Would someone screenshot it / tag a friend?

If any answer is "no," it's not on-brand yet.

---

*What changed from the earlier docs: Callie is now **canonically wordless** (the plan had her speaking); the headline answer to "why a cat" is the **emotional** line above, with Calliope/muse demoted to an easter egg; onboarding is **roast-first, lore-later**; and role clarity is carried by **visual grammar (mic vs no-mic)** rather than explanatory copy.*
