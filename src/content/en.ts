import type { Dictionary } from "./types";
const dictionary = {
  lang: "en",
  meta: {
    title: "KANIQ · A home for your language",
    description:
      "Pick your care, stay and company. See how recovery and Korea fit together.",
    quoteTitle: "KANIQ · Start your quote",
    quoteDescription: "Explore the steps before launch.",
    ogAlt: "Family visiting a palace in Seoul",
  },
  previewBand:
    "Preview site — KANIQ’s registration is in progress. Requests are not saved or answered yet.",
  header: {
    skip: "Skip to content",
    nav: {
      care: "Find care",
      plan: "Your journey",
      refer: "Refer someone",
      trust: "Trust",
    },
    language: "Language",
    phase2Soon: "Opens in December",
  },
  hero: {
    homeFor: "Care, in your language",
    headline: ["Care your insurance won’t cover, planned in Korea."],
    lede: "Pick your care, stay and company. See how recovery and Korea fit together.",
    quoteForPlan: "Start a quote for this plan",
  },
  planner: {
    legend: {
      treatment: "Treatment",
      days: "Days in Korea",
      travelers: "Travelers",
    },
    pax: {
      one: "1 traveler",
      two: "2 travelers",
      group: "3+ travelers",
    },
    title: "{name}, {n} days",
    subtitle: {
      one: "For 1 traveler, arriving at Incheon",
      two: "For 2 travelers, arriving at Incheon",
      group: "For a group, arriving at Incheon",
    },
    rooms: {
      one: "Hotel near your hospital",
      two: "Twin room near your hospital",
      group: "Family residence near your hospital",
    },
    dayTitles: {
      arrive: "Arrive",
      treatment: "Treatment",
      early: "Early recovery",
      culture: "Recovery and culture",
      free: "Free days",
      home: "Check-up and fly home",
    },
    fixed: {
      pickup: "Airport pickup with a local-language driver",
      escort: "A coordinator accompanies you to the hospital",
      finalCheck: "Final check and a written medical report",
      dropoff: "Airport drop-off and follow-up hotline",
    },
    tracks: {
      Move: "Move",
      Stay: "Stay",
      Treat: "Treat",
      Taste: "Taste",
      Feel: "Feel",
      See: "See",
    },
    badges: {
      ok: "Doctor OK",
      from: "OK from day {n}",
      afterDoctor: "After your doctor’s OK",
      notUntil: "Not until day {n}",
    },
    priceLabel: "Reference treatment price",
    priceNote:
      "An indicative range; your hospital confirms the individual plan.",
    feeLabel: "Your fee to KANIQ",
    photoAlt: "A bowl of samgyetang",
    treatments: {
      implants: {
        name: "Dental implants",
        treat: "Implant placement at the dental clinic",
        early: [
          "Samgyetang, soft and lukewarm",
          "Hanok tea ceremony",
          "Flat walk along Cheonggyecheon",
        ],
        mid: [
          "Gyeongbokgung in hanbok",
          "Gwangjang Market food tour",
          "Day templestay",
        ],
        late: ["Hot spring day trip", "Overnight templestay"],
      },
      lasik: {
        name: "LASIK",
        treat: "Eye exam and LASIK",
        early: [
          "Rest with eyes closed at the hotel",
          "Indoor hanbok portrait",
          "Hanjeongsik lunch",
        ],
        mid: ["Bukchon and Namsan by day", "Nanta performance", "Jjimjilbang"],
        late: ["Han River cycling", "Swimming pool"],
      },
      screening: {
        name: "Health screening",
        treat: "Full-day screening with sedated endoscopy",
        early: [
          "Rice porridge after the endoscopy",
          "Changdeokgung secret garden",
          "Hanok tea ceremony",
        ],
        mid: [
          "Results with an English report",
          "Cooking class",
          "DDP and Dongdaemun",
        ],
        late: ["Day trip to Suwon fortress", "Korean spa"],
      },
      "womens-health": {
        name: "Women’s health",
        treat: "Gynecologic check-up with a female doctor",
        early: [
          "Quiet room, female coordinator on call",
          "Hanok tea ceremony",
          "Temple food lunch",
        ],
        mid: [
          "Herbal medicine consultation",
          "Gyeongbokgung in hanbok",
          "Spa day",
        ],
        late: ["Overnight templestay", "Hot spring retreat"],
      },
      fertility: {
        name: "Fertility consultation",
        treat: "Tests and consultation with a fertility specialist",
        early: [
          "Residence with a kitchen",
          "Seoul Forest walk",
          "Hanjeongsik dinner",
        ],
        mid: [
          "Treatment plan and remote follow-up schedule",
          "Bukchon hanok village",
          "A traditional music performance",
        ],
        late: ["Day trip to Gapyeong", "Korean spa"],
      },
    },
  },
  care: {
    implants: "Dental implants",
    lasik: "LASIK",
    screening: "Health screening",
    fertility: "Fertility consultation",
    dental: "Dental care",
    eye: "Eye care",
    "womens-wellness": "Women’s wellness",
    "womens-health": "Women’s health",
    "serious-referral": "Serious illness referral",
    "student-checkup": "Student check-ups",
  },
  local: {
    title: "A home for your language",
    priorityTitle: "Priority care",
    priorityCare: ["implants", "lasik", "screening", "fertility"],
    specialTitle: "Made for your visit",
    special: "An English medical report for your doctor at home",
    photoAlt: "Family visiting a palace in Seoul",
    photoCaption: "Care and culture, with room to recover.",
  },
  messenger: {
    channel: "WhatsApp",
    chatOn: "Chat on {name}",
    opensAtLaunch: "Opens at launch",
  },
  doctorOk: {
    badge: "Doctor OK",
    title: "Your recovery sets the pace",
    intro:
      "Illustrative recovery rules. Your treating clinician confirms which activities suit your condition.",
    caption: "Sample rules by day after treatment",
    activity: "Activity",
    rows: [
      {
        activity: "Jjimjilbang",
        after: "LASIK",
        okFromDay: 3,
      },
      {
        activity: "Hot spring day trip",
        after: "Dental implants",
        okFromDay: 1,
      },
      {
        activity: "Spicy food",
        after: "Dental implants",
        okFromDay: 3,
      },
      {
        activity: "Gyeongbokgung in hanbok",
        after: "LASIK",
        okFromDay: 2,
      },
      {
        activity: "Overnight templestay",
        after: "Dental implants",
        okFromDay: 4,
      },
    ],
    legendOk: "Cleared by doctors",
    legendNot: "Not yet",
    cellOk: "Available",
    cellNot: "Wait",
  },
  recovery: {
    title: "What a recovery week looks like",
    intro:
      "An example of gentle activities around treatment, subject to your clinician’s advice.",
    cols: {
      stage: "Stage",
      stay: "Stay",
      see: "See",
      eat: "Eat",
      culture: "Culture",
    },
    rows: [
      {
        stage: "D0",
        note: "Treatment day",
        stay: "Rest near hospital",
        see: "None; companions may walk",
        eat: "Porridge, lukewarm meals",
        culture: "None",
      },
      {
        stage: "D1–2",
        note: "Early recovery",
        stay: "Same hotel",
        see: "Flat walks, 1–2 hours",
        eat: "Samgyetang, hanjeongsik, cafés",
        culture: "Tea ceremony, indoor hanbok portrait",
      },
      {
        stage: "D3–5",
        note: "Recovery and culture",
        stay: "Hanok stay if suitable",
        see: "Namsan, Bukchon, Han River",
        eat: "Market tour, cooking class",
        culture: "Palace, performance, day templestay",
      },
      {
        stage: "Check-up and fly home",
        note: "After your doctor’s check",
        stay: "Flexible",
        see: "Day trips outside Seoul",
        eat: "Flexible",
        culture: "Spa or overnight templestay with medical clearance",
      },
    ],
  },
  trust: {
    title: "Who pays what",
    intro: "Three simple fee principles, shown before you decide.",
    sample: "Sample",
    receipt: {
      title: "Who pays what",
      sub: "A dental journey, as an example",
      rows: [
        {
          what: "Your treatment",
          who: "Paid to the hospital",
          amount: "Walk-in price",
        },
        {
          what: "Pickup and hotel",
          who: "Paid to the provider before booking",
          amount: "As quoted",
        },
        {
          what: "Coordinator, interpreter and local-language hotline",
          who: "KANIQ",
          amount: "₩0",
        },
        {
          what: "KANIQ coordination",
          who: "Paid by the hospital",
          amount: "Not yours",
        },
      ],
      total: "What you pay KANIQ",
      seal: "NO PATIENT FEE · KANIQ",
    },
    records: {
      title: "The people behind your care",
      intro:
        "Illustrative records, not a list of currently available providers.",
      figureAlt: "Doctor, patient and interpreter discussing care",
      figureCaption: "An interpreter can join the consultation.",
      labels: {
        registration: "Registration",
        accreditation: "Accreditation",
        specialists: "Specialists",
        languages: "Languages",
      },
      hospitals: [
        {
          kind: "Dental implants and prosthetics, Seoul",
          specialists: "14",
          languages: "English, Japanese, Mongolian",
          doctorBio: "Prosthodontist; Korean and English",
        },
        {
          kind: "Women’s health and fertility, Seoul",
          specialists: "9",
          languages: "Japanese, Russian, Indonesian",
          doctorBio: "Obstetrician and gynecologist; Korean and Japanese",
        },
      ],
    },
    steps: {
      title: "If something goes off-plan",
      intro: "A clear sequence to follow with your coordinator.",
      items: [
        {
          title: "Tell your coordinator",
          body: "Explain what happened in your language.",
        },
        {
          title: "Contact the hospital",
          body: "The coordinator arranges a clinical review.",
        },
        {
          title: "Agree the next step",
          body: "Discuss the available options and any costs.",
        },
        {
          title: "Escalate the issue",
          body: "Use the dispute process if it remains unresolved.",
        },
      ],
    },
  },
  templates: {
    title: "Six ways to begin",
    intro: "Six plans to start from. Pick one to start your quote.",
    cta: "Get PDF / start quote",
    items: [
      {
        name: "Dental implants",
        length: "7 Days",
        highlight: "Recovery and a gentle cultural visit",
        interest: "dental",
      },
      {
        name: "LASIK",
        length: "5 Days",
        highlight: "Recovery and a gentle cultural visit",
        interest: "eye",
      },
      {
        name: "Health screening",
        length: "5 Days",
        highlight: "Recovery and a gentle cultural visit",
        interest: "screening",
      },
      {
        name: "Women’s wellness",
        length: "7 Days",
        highlight: "Recovery and a gentle cultural visit",
        interest: "womens-health",
      },
      {
        name: "Fertility consultation",
        length: "10 Days",
        highlight: "Recovery and a gentle cultural visit",
        interest: "fertility",
      },
      {
        name: "Family screening",
        length: "7 Days",
        highlight: "Recovery and a gentle cultural visit",
        interest: "screening",
      },
    ],
  },
  ambassador: {
    title: "Bring someone into the circle",
    intro:
      "Students, community members and organizations can introduce someone and choose where thanks go.",
    giveLegend: "Choose a destination for thanks",
    options: [
      {
        label: "Personal",
        note: "Receive personally",
      },
      {
        label: "Mission support",
        note: "Support a mission",
      },
      {
        label: "Community fund",
        note: "Support your community",
      },
      {
        label: "Scholarship",
        note: "Support a student",
      },
    ],
    signupNote: "Joining and referral codes open at launch.",
    preview: {
      title: "Referral overview",
      sample: "Sample preview",
      code: "Referral code",
      cols: ["Person", "Inquiry", "Consultation", "Booking", "Care"],
      rows: [
        {
          name: "A.",
          care: "Health screening",
          stage: 1,
        },
        {
          name: "B.",
          care: "Dental care",
          stage: 2,
        },
        {
          name: "C.",
          care: "Eye care",
          stage: 3,
        },
      ],
      foot: "Only a preview; no amounts or issued codes.",
    },
  },
  organizations: {
    title: "For institutions, too",
    intro:
      "Partnership models for organizations connecting people with care in Korea.",
    note: "Partnership inquiries open at launch.",
    items: [
      {
        who: "Universities",
        what: "Student check-ups and visiting families",
      },
      {
        who: "Community associations",
        what: "Local-language care guidance",
      },
      {
        who: "Faith organizations",
        what: "Care journeys and community support",
      },
      {
        who: "Public institutions",
        what: "Group screening and cooperation",
      },
    ],
  },
  footer: {
    tagline: "You decide. We handle the complexity.",
    regMedical: "Medical tourism registration",
    regTravel: "Travel agency registration",
    feeTitle: "Our fee principles",
    fee: [
      "Patients pay KANIQ ₩0",
      "Same treatment price as a direct visit",
      "The hospital pays for coordination",
    ],
    privacyTitle: "Privacy",
    privacy:
      "The preview validates your input without saving it or sending it to providers.",
    disputeTitle: "Disputes",
    dispute: "Speak to your coordinator, then use the issue process.",
  },
  msgbar: {
    previewNote: "Preview — messenger channels open at launch.",
  },
  quote: {
    title: "Start your quote",
    intro: "Explore the steps before launch.",
    previewNotice: "Before registration, requests are not saved or answered.",
    steps: ["Care", "Dates", "Contact"],
    stepOf: "Step {n} of 3",
    interestLegend: "Care of interest",
    timingLegend: "When would you visit?",
    timing: {
      "within-3-months": "Within 3 months",
      "3-6-months": "3–6 months",
      "not-sure": "Not sure yet",
    },
    pickupLabel: "I would like airport pickup",
    stayLabel: "Preferred stay",
    stayNone: "No preference",
    stay: {
      "near-hospital": "Near the hospital",
      hanok: "Hanok stay",
      "family-residence": "Family residence",
    },
    nameLabel: "Name",
    methodLabel: "Contact method",
    method: {
      email: "Email",
      whatsapp: "WhatsApp",
      line: "LINE",
      messenger: "Messenger",
      kakaotalk: "KakaoTalk",
    },
    contactLabel: "Contact details",
    residenceLabel: "Country of residence",
    optional: "Optional",
    privacy:
      "For quote preparation, care interest, dates, name, contact and residence are checked without storage during preview; after launch, retained for up to one year and shared with your selected hospital.",
    consentLabel: "I agree to the privacy notice",
    next: "Next",
    back: "Back",
    submit: "Submit preview",
    sending: "Sending",
    errors: {
      required: "Please complete this field.",
      invalid: "Please check this value.",
      too_long: "This entry is too long.",
      network: "Unable to send. Please try again.",
    },
    doneTitle: "Preview completed",
    donePreview:
      "Your input was checked; it has not been saved and you will not receive a reply.",
    backHome: "Back to home",
  },
  live: {
    replyPromise: "Reply within 24 hours",
    quoteDone: "Your request is ready for review.",
  },
} satisfies Dictionary;
export default dictionary;
