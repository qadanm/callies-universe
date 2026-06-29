# Writing style: sound like a person, not an AI

## The hard rule
**No em dashes. No en dashes. Anywhere a user can read it.** Not in the app, not on the
websites, not in the roasts the show puts out. Those two characters give away machine writing
faster than anything else, so they are banned from every user-facing surface. (Internal engine
code, build scripts, and team docs are not policed. Write those however you want.)

Allowed and totally normal: the hyphen ("-"), the ellipsis character, and curly quotes.
Those are just regular human typography.

## Why
Everything here is a comedy brand built for fun. It has to read like a real person wrote
it on purpose. One stray em dash makes a roast, a button, or a landing page feel
auto-generated, and that kills the bit. We are a roast studio hosted by a cat. Act like it.

## How to write a dash like a human would
- An aside in the middle of a sentence: use commas, or parentheses.
- Explaining or expanding a point: use a colon, or just start a new sentence.
- A pause for comedic timing in a roast or a line of dialogue: use "..." or a period. Never a dash.
- A range or a price: write "5 to 10", or use a hyphen ("5-10").

Vary it. Do not turn every dash into a comma. Pick whatever a person would actually type.

## Other AI tells to drop (a vibe, not a blocklist)
- Filler words: seamless, robust, leverage, elevate, delve, tapestry, boasts, unleash,
  supercharge, "in the realm of", "a testament to", "look no further", "whether you are X or Y".
- Throat-clearing transitions: "Furthermore", "Moreover", "Additionally", "In today's world".
- The tidy rule-of-three on everything, the "not only X but also Y", the over-balanced
  corporate cadence.
- Emoji used as bullet points.

## The voice we DO want
- Unserious, warm, funny. Have a sense of humor about it.
- Short. Punchy. Verb-first. A real person texting a friend, not a brand "delighting a user".
- Confident enough to be plain. If a line sounds like a press release, rewrite it simpler and meaner.
- Not cringe. Do NOT force Gen-Z slang ("rizz", "no cap", "it's giving") to seem young.
  Forced slang is worse than plain. Reach for slang only when it is genuinely the funniest,
  most natural word, and even then, a pinch.
- The comedians still talk in their own voices (the cast bible). Callie still says nothing
  (see [CALLIE-BIBLE.md](./CALLIE-BIBLE.md)).

## Where this applies
Every user-facing surface: the app UI, all six websites, the generated roasts and the offline
fallback sets, App Store copy, legal, and the on-screen captions. Internal-only code, build
scripts, and team docs are out of scope.

## How it is enforced
- `pnpm run lint:human` ([scripts/check-human-copy.mjs](../scripts/check-human-copy.mjs)) scans
  the user-facing UI source (the websites, the app, the shared components, the gallery) and fails
  on any em or en dash. It runs inside `pnpm run verify`, so a stray dash cannot ship to users.
- The roast-writing prompts in `services/brain` tell the model never to use em or en dashes and
  to write the way a real comedian talks, so generated scripts comply at the source.
- This file and [CALLIE-BIBLE.md](./CALLIE-BIBLE.md) are the canon. When in doubt, read it out
  loud. Sounds like a person, ship it. Sounds like a chatbot, fix it.
