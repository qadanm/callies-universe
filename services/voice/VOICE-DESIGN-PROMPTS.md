# Voice Design prompts — the 8-comedian cast

Paste-ready prompts for **ElevenLabs → Voice Design** (the "describe a voice" box) plus
a **preview line** for each comedian, tuned to their persona and delivery DNA
(`src/voiceProfiles.js`: pace / stability / expressiveness).

**How to use:** create each voice in Voice Design, pick the take with the clearest diction
+ widest range, save it, then set its **Voice ID** in the matching env var. Run
`pnpm --filter @callies-universe/voice cast-check` (with `ELEVENLABS_API_KEY` set) to
confirm all 8 resolve.

Keep every description about **vocal qualities and character** (warmth, cadence, energy) —
never a caricature of a group. Same bar as the comedy: the joke is the *car*, never people.

---

### mama → `VOICE_MAMA_ID`  ·  Mama Denièce — loving-savage church mom
*pace 1.0 · low stability (0.4) · very expressive (0.9)*

> A warm, full-bodied woman in her early fifties with a rich, resonant voice and a Southern,
> Sunday-morning-church cadence. Loving and playful but lightning-quick with a devastating
> one-liner — a beloved auntie roasting you at the family cookout. Highly dynamic: swings
> from a hushed, knowing setup to a big, theatrical, booming payoff, with little hums and
> "mm-mm-mm" tuts between lines. Characterful, animated, clear diction.

> **Preview:** "Mm-mm-MM. Baby, come sit by Mama. Now, I say this with love… but this paint
> job? It's a cry for help. And I'm answering. You SEE it? …Bless your heart. No."

### tony → `VOICE_TONY_ID`  ·  Tony "Two-Times" Calabrese — exasperated New Yorker
*fast pace (1.18) · low stability (0.35) · expressive (0.85)*

> A middle-aged Italian-American man from New York with a gravelly, nasal, fast-talking
> delivery and a big, exasperated, all-hands energy. Warm underneath the bluster — like
> your uncle who loves you but cannot BELIEVE what you just did. Rapid, incredulous, lots
> of rhetorical "what is this?" rises. Punchy, conversational, clear even at speed.

> **Preview:** "Two times I look at this thing. TWO times. What is this, a car or a cry for
> attention? Ya kiddin' me with the spoiler? Get outta here."

### reginald → `VOICE_REGINALD_ID`  ·  Sir Reginald Pemberton-Hare — posh narrator
*slow-measured (0.85) · high stability (0.8) · low expressiveness (0.25)*

> An elderly, posh British man with a dry, measured, refined delivery — a nature-documentary
> narrator observing a strange specimen with detached, hushed fascination. Calm, articulate,
> almost never raising his voice; the comedy is in the understatement and the perfectly timed
> pause. Rich, plummy timbre, impeccable enunciation.

> **Preview:** "Here, in its natural habitat — the supermarket car park — we observe the
> Nissan Juke. A creature, it seems, designed entirely by committee. Remarkable. Tragic."

### abuomar → `VOICE_ABUOMAR_ID`  ·  Abu Omar — warm Egyptian uncle
*medium pace (0.95) · medium stability (0.55) · warm-expressive (0.7)*

> A warm, theatrical Middle-Eastern man in his late fifties with a generous, sing-song
> cadence and a big affectionate laugh. Tells you the brutal truth like a beloved uncle who
> means well — rising, melodic, with fond exasperation. Round, resonant tone, clear diction,
> playful emphasis.

> **Preview:** "Habibi. Come, come, sit. I love you, so I tell you the truth: this car? It is
> a good car… for someone I do not like. Eh? Eh? I am joking. Mostly."

### mateo → `VOICE_MATEO_ID`  ·  Mateo "El Tigre" Rivas — telenovela hype-man
*pace 1.05 · very low stability (0.3) · max expressiveness (0.95)*

> A Latin-American man with a huge, operatic, telenovela-melodrama delivery — every line a
> dramatic event. Enormous dynamic range: breathless whispered build-ups exploding into
> passionate, rolled-R declarations. Rich, theatrical, romantic, slightly absurd in its
> intensity. Crystal-clear even at full volume.

> **Preview:** "Señoras y señores… behold. THE most TRAGIC vehicle… in all the land. I cannot
> look. I MUST look. Ay, the bumper — it weeps. ¡Qué dramático!"

### jeanluc → `VOICE_JEANLUC_ID`  ·  Jean-Luc Moreau — unbothered Frenchman
*slow (0.8) · high stability (0.85) · very low expressiveness (0.2)*

> A French man in his forties with a flat, bored, supremely unbothered delivery — utterly
> unimpressed by everything. Soft, almost a sigh; the disdain is in how little effort he
> gives. Smooth accent, minimal inflection, long unhurried pauses. Deadpan to the bone.

> **Preview:** "Mm. It is… a car. I suppose. You are proud of this? *sigh* …That is the funny
> part, non? Anyway. I have seen enough."

### priya → `VOICE_PRIYA_ID`  ·  Priya Nair — comparison auntie
*pace 1.0 · medium stability (0.5) · expressive (0.7)*

> A brisk, knowing Indian woman with a warm but lovingly-brutal delivery — the auntie who
> compliments you and destroys you in the same breath. Quick, articulate, with pointed
> emphasis and a little sing-song lilt on the backhand. Clear, confident, affectionately
> savage.

> **Preview:** "Very nice, very nice. You know, my sister's son, he also had a car like this.
> Once. Before he became… sensible. But no, no — it suits you. That is the problem."

### kenji → `VOICE_KENJI_ID`  ·  Kenji "Ken" Tanaka — zen minimalist
*very slow (0.7) · max stability (0.9) · minimal expressiveness (0.15)*

> An older Japanese man with a glacial, serene, near-monotone delivery and long, deliberate
> silences. Calm to the point of unsettling; the devastation lands in three quiet words after
> a long pause. Low, steady, unhurried; almost meditative. Pristine clarity, zero theatrics.

> **Preview:** "I look at your car. …I look for a long time. …………It is finished. No. It was
> never started."
