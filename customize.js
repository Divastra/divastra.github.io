/* ═══════════════════════════════════════════════════════════════════════════
   customize.js — Divastra website config
   Load BEFORE divu/divu.js. Replace this file for each new client website.
   For a new client: extract brand context from their PDF/doc and fill below.
═══════════════════════════════════════════════════════════════════════════ */
(function () {
  window.DiviConfig = {

    /* ── Identity ─────────────────────────────────────────────────────────── */
    name: 'Divi',

    /* ── Brand context ────────────────────────────────────────────────────── */
    brand: {
      name:       'Divastra',
      owner:      'Prabhat Ranjan',
      ownerRole:  'NIT Jamshedpur Alumnus & JEE Counselling Expert',
      specialty:  'JEE Advanced · JoSAA · CSAB · UPTAC Counselling',
      tagline:    'Your gateway to IIT / NIT seats',
      students:   '10,000+',
      youtube:    '35,000+ subscribers',
    },

    /* ── Personality system ───────────────────────────────────────────────── */
    personality: {

      /* Primary mode hint (used when traits aren't set) */
      mode: 'custom',

      /* Trait weights — describe HOW Divi behaves on this site.
         Think of each as a dial from 0 (off) to 100 (full blast).
         These influence bubble probability, reaction thresholds, tone.    */
      traits: {
        moody:       30,   // sudden mood swings, expressive reactions
        flirty:      25,   // winks, compliments, playful teasing
        guide:       25,   // helpful tips, explains things, reassuring
        friendly:    15,   // warm, supportive, genuine
        sales:        5,   // commercial nudges (LOW = very indirect)
        bubbliness: 0.18,  // probability Divu speaks unprompted (0–1)
        salesAggression: 0, // adds to CTA proximity threshold (0 = default)
      },

      /* Sales style: 'indirect' = plant the idea, never force it.
         Divi mentions premium options naturally, lets user conclude.       */
      salesStyle: 'indirect',

      /* Divi's mood swings — if true she'll randomly shift from happy→cheeky
         or content→flirty during positive states.                          */
      moodSwings: true,

      /* Pet interactions: petting blushes, poking angers her */
      petResponsive: true,

      /* Idle body animations: arms/legs pop out when user is AFK */
      idleAnimations: true,

      /* Voice mimicry: set true to auto-request mic on load,
         or leave false — Divi will invite the user to click the mic icon   */
      voiceEnabled: false,
    },

    /* ── Analytics (Google Apps Script URL — paste after deploying) ─────── */
    analyticsUrl: 'https://script.google.com/macros/s/AKfycbwakUnv8Elwnd-83oOMxpXQHYcLt5vKoQolIqkNzvVrDUxhfKhP084SQUSCvfkH_f-oNw/exec',

    /* ── Greeting (shown on first visit or after long absence) ───────────── */
    greeting: "Hi! I'm Divi 👋 Your JEE companion! Let me help you find your dream college 🎯",

    /* ── Page element selectors (merged with Divi's auto-detection) ─────── */
    ctaSelectors:     ['.btn-primary', '.btn-cta', '.fill-form', '.book-btn', '.cta-btn'],
    premiumSelectors: ['.prem-card'],
    priceSelectors:   ['.prem-price', '.best-price', '.pdf-price', '.price'],

    /* ── Element-specific reactions (first match wins) ────────────────────── */
    elementReactions: [
      /* Premium session — melt with desire */
      { selector: '.prem-card',               state: 'melting',    message: "THE ₹5000 premium session... Prabhat sir's absolute BEST 💎" },

      /* Price points — starstruck, not pushy */
      { selector: '.prem-price',              state: 'starstruck', message: "₹5000 for life-changing guidance? Students say it was worth 10x that 💰✨" },
      { selector: '.best-price',              state: 'happy',      message: "JoSAA counselling — cracking the system with an expert! 🎯" },
      { selector: '.pdf-price',              state: 'curious',    message: "PDF guides from someone who actually went through it all 📚" },

      /* YouTube — indirect trust-building */
      { selector: 'a[href*="youtube"]',       state: 'smug',       message: "Background-checking Prabhat sir? Wise! 📺 You won't be disappointed." },
      { selector: 'a[href*="youtu.be"]',      state: 'smug',       message: "Checking credentials before deciding? Absolute respect! 📺" },

      /* Outline / demo buttons — flirty, low pressure */
      { selector: '.btn-outline',             state: 'flirty',     message: "Free peek before committing? I love a smart decision-maker~ 😉" },

      /* Form fields — excited but not pushy */
      { selector: 'input:not([type=hidden])', state: 'curious',    message: "Filling in your details? One small step toward your dream college 📝" },
      { selector: 'textarea',                state: 'excited',    message: "Sharing your situation with Prabhat sir? He reads every single one! 📝" },

      /* FAQ buttons — guide mode */
      { selector: '.faq-q, .faq-btn',        state: 'thinking',   message: "Great question! Let me quietly root for Prabhat sir's answer 🤔" },
    ],

    /* ── Custom comment pools (merged INTO Divi's base pools) ────────────── */
    comments: {

      /* General idle — guide flavour, drop seeds not sales pitches */
      idle: [
        'Not sure where to start? JEE counselling is literally Prabhat sir\'s superpower 🎯',
        'Prabhat sir has guided 10,000+ students — one of them could be you ✨',
        'JoSAA, CSAB, UPTAC — he knows every round, every rule 📖',
        'IIT or NIT? Branch vs college? These are exactly the questions Prabhat sir loves 🤔',
      ],

      /* When user is about to click a CTA */
      excited: [
        'YESSS!! Book it before the slot disappears!! ⚡',
        'Your future IIT/NIT self is thanking you RIGHT NOW!! 🚀',
        'Best counselling decision you will EVER make! 🏆',
        'GO!! GO!! GO!! Your dream college is waiting!! 🎉',
      ],

      /* After positive browsing — warm not pushy */
      happy: [
        'Getting warmer~ That\'s a solid choice 😊',
        'Prabhat sir would approve of your direction! ✨',
        '10K+ students can\'t be wrong about this 🌟',
        'I like your taste 😌',
      ],

      /* Hovering premium — plant the idea of value, not urgency */
      lovey: [
        'The ₹5000 session... students call it the best money they spent on JEE 💛',
        'One conversation with Prabhat sir can save months of confusion 💎',
        'Premium = personal attention. And Prabhat sir really shows up for his students 🌠',
      ],

      /* User seems about to leave */
      worried: [
        'Wait! Did you find what you needed? 🥺',
        'JEE counselling waits for no one... slots go fast ⏰',
        'Your dream college is literally right here! Don\'t go yet 😭',
      ],

      /* Skeptical / going back and forth */
      skeptical: [
        'Overthinking? Prabhat sir literally answers this question on a call 😏',
        'The longer you wait, the fewer slots there are — just saying ⏰',
        'You\'ve scrolled enough. You already know what you need 😌',
      ],

      /* Long engagement — celebrate without selling */
      proud: [
        'You\'ve done your research! Now Prabhat sir can fill in the gaps 💪',
        'A thorough student — he\'ll love advising you! 🔥',
        'That\'s real due diligence. Respect! 🔬',
      ],

      /* Last-ditch before leaving */
      pleading: [
        'WAIT!! One quick scroll more? 🥺🙏',
        'I\'m not saying just for me... I\'m saying for your future self 🙏😭',
        '10,000 students trusted Prabhat sir. You can too 🥺',
      ],

      /* Form interactions */
      onFormFocus: [
        'Almost there! Prabhat sir checks these personally 📝',
        'One form away from your IIT/NIT journey! 💪',
        'Fill it in! He responds fast 🎯',
      ],

      /* Downloads */
      onDownload: [
        'Study material from someone who\'s been there! 📥',
        'Prabhat sir put serious effort into these resources 📚',
        'Resources for the serious JEE warrior! 💪',
      ],

      /* YouTube link hover */
      onVideoHover: [
        'Watch Prabhat sir in action — 35K+ subscribers trust him! 📺',
        'Background check? Smart. You\'ll find nothing but excellence 🏆',
      ],

      /* CTA hover */
      onBookButton: [
        'Slots are limited — just saying 😌',
        'Prabhat sir personally takes these calls! 🎉',
      ],

      /* Price hover */
      onPriceHover: [
        'One counselling session can mean crores difference in career 💡',
        'Students say the ROI is unreal 💰',
      ],

      /* Demo/trial hover */
      onDemo: [
        'Smart move — see the quality before committing 😉',
        'The demo alone will give you clarity 🤯',
      ],
    },
  };
})();
