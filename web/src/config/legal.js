// Legal suite — ONE shared source for every site (the network entity owns the apps).
// These are genuine STARTING DRAFTS, not legal advice: have counsel review + file the
// actual trademark/copyright registrations (a webpage asserts rights; filings secure
// them). `updated` is set per build by the page from a passed date.

export const ENTITY = "Callie's Universe";
export const CONTACT = "legal@calliesuniverse.com";
export const DMCA_AGENT = "dmca@calliesuniverse.com";

export const LEGAL_DOCS = [
  { slug: "terms", title: "Terms of Service" },
  { slug: "privacy", title: "Privacy Policy" },
  { slug: "cookies", title: "Cookie Policy" },
  { slug: "acceptable-use", title: "Acceptable Use" },
  { slug: "dmca", title: "Copyright & DMCA" },
  { slug: "ip", title: "Trademarks & IP" },
];

const P = (...paras) => paras;

export const LEGAL = {
  terms: {
    title: "Terms of Service",
    intro: `These Terms govern your use of ${ENTITY} and its apps and websites (the “Service”). By using the Service you agree to them.`,
    sections: [
      { h: "The Service", body: P(`${ENTITY} creates entertainment: AI-assisted comedic “roasts” of things you submit (a photo, a screenshot), delivered as text and short videos performed by original fictional characters. It is for fun and is not advice of any kind.`) },
      { h: "Your content & your license to us", body: P(`You keep ownership of what you upload (“Your Content”). You grant us a worldwide, royalty-free license to host, process, and transform Your Content solely to generate and deliver your roast and to operate the Service. You confirm you have the right to upload it — don't upload other people's photos, private messages, or copyrighted material without permission.`) },
      { h: "What we make for you", body: P(`The generated roast and video (“Output”) are yours to share and post. The characters, voices, names, scripts, music, artwork, and the Service itself remain ${ENTITY}'s property (see Trademarks & IP). We grant you a personal license to use the Output; you may not resell it or imply endorsement.`) },
      { h: "Acceptable use", body: P(`You must follow our Acceptable Use Policy. The comedy targets the submitted thing — never a real person, group, or protected class — and you agree not to use the Service to harass, defame, or harm anyone.`) },
      { h: "Payments & credits", body: P(`Roasts may require credits purchased through the app store or our checkout. Credits are digital goods consumed on delivery and are non-refundable except where required by law or the app store's policies.`) },
      { h: "Disclaimers & liability", body: P(`The Service is provided “as is,” without warranties. To the maximum extent permitted by law, ${ENTITY} is not liable for indirect or consequential damages, and our total liability is limited to what you paid us in the prior 12 months.`) },
      { h: "Changes & contact", body: P(`We may update these Terms; continued use means acceptance. Questions: ${CONTACT}.`) },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: `How ${ENTITY} handles your data. Short version: we use your upload to make your roast, we don't sell your data, and we keep as little as possible.`,
    sections: [
      { h: "What we collect", body: P(`The photo or screenshot you submit (to generate the roast); minimal details you enter (e.g., the car's make/model); an anonymous device identifier for credits; and basic, privacy-respecting analytics. No account or email is required to use the core experience.`) },
      { h: "How we use it", body: P(`Your upload is sent to our processing service only to identify/understand the subject and generate the roast and video. We aim comedy at the thing, never at a person. We use AI providers (e.g., Anthropic for text, ElevenLabs for voices) under their terms to produce the Output.`) },
      { h: "Retention", body: P(`We don't sell your data. We retain uploads only as long as needed to deliver and (briefly) support your roast, then delete them. Generated Output you save lives on your device unless you share it.`) },
      { h: "Payments", body: P(`Purchases are handled by the app stores (Apple/Google) or Stripe. We never see or store your card details.`) },
      { h: "Your rights", body: P(`Depending on where you live (e.g., GDPR/CCPA), you may request access to or deletion of your data. Email ${CONTACT}.`) },
      { h: "Children", body: P(`The Service is rated for teens and up and is not directed to children under 13 (or the equivalent age in your region).`) },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    intro: `How our websites use cookies and similar technologies.`,
    sections: [
      { h: "What we use", body: P(`We keep this light: essential storage to run the site, and privacy-respecting, aggregate analytics to understand what's working. We don't use third-party advertising cookies.`) },
      { h: "Your choices", body: P(`You can block or clear cookies in your browser. Essential storage is required for the site to function; analytics are aggregate and non-identifying.`) },
    ],
  },
  "acceptable-use": {
    title: "Acceptable Use Policy",
    intro: `The Service is for good-natured comedy. These rules keep it that way.`,
    sections: [
      { h: "Don't", body: P(`Upload other people's photos, faces, or private messages without consent; target a real person, group, or protected class; upload illegal, sexual, hateful, or harassing material; or attempt to defame or harm anyone.`) },
      { h: "The comedy", body: P(`Roasts are aimed at the submitted object (a car, an outfit, a room) — never a person's body, identity, or worth. We may refuse, filter, or remove content and may suspend accounts that break these rules.`) },
      { h: "Reporting", body: P(`See something that violates this policy? Tell us at ${CONTACT}.`) },
    ],
  },
  dmca: {
    title: "Copyright & DMCA",
    intro: `${ENTITY} respects intellectual property and expects users to do the same.`,
    sections: [
      { h: "Takedown requests", body: P(`If you believe content on the Service infringes your copyright, send a notice to our designated agent at ${DMCA_AGENT} including: identification of the work, the infringing material and its location, your contact info, a good-faith statement, and a statement under penalty of perjury that you're authorized to act.`) },
      { h: "Counter-notice & repeat infringers", body: P(`We will remove infringing material, notify the user, and accept counter-notices as the law provides. We terminate repeat infringers.`) },
    ],
  },
  ip: {
    title: "Trademarks & Intellectual Property",
    intro: `Everything that makes ${ENTITY} ${ENTITY} is protected intellectual property.`,
    sections: [
      { h: "Our marks", body: P(`“${ENTITY},” “Roast My Ride,” the other “Roast My ___” names and logos, and the character names are trademarks of ${ENTITY}. You may not use them without written permission, or in any way that implies affiliation or endorsement.`) },
      { h: "Original characters", body: P(`Callie and the entire comedian cast are ORIGINAL fictional characters — their designs, names, personalities, catchphrases, voices, and artwork are created by and owned by ${ENTITY}. They are not impersonations of any real person, and they may not be copied, reproduced, or used to train models without permission.`) },
      { h: "Our content", body: P(`The software, scripts, voice models, music, artwork, the design system, and the look and feel of the Service are owned by ${ENTITY} and protected by copyright and other laws. © ${ENTITY}. All rights reserved.`) },
      { h: "What you can do", body: P(`You may share the roast Output we make for you. Everything else requires our written permission. Licensing or press: ${CONTACT}.`) },
    ],
  },
};
