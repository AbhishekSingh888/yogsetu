/**
 * YogSetu - Verified Yoga Directory
 * Central Database File
 */

// ------------------------------------------
// TEACHERS DATABASE
// ------------------------------------------
const teachersDatabase = [
  {
    id: 1,
    name: "Anjali Sharma",
    image: "images/yoga_1.png",
    rating: 4.9,
    reviewsCount: 56,
    style: "Hatha Yoga",
    experience: "8 Years",
    rate: "₹1,200/hr",
    tagline: "Uniting breath, movement, and mindfulness in a traditional, fluid practice.",
    bio: "Anjali started her yoga journey in India, studying traditional Hatha before falling in love with the creative expression of Vinyasa. She designs sequences that challenge the body while offering a sanctuary for the mind. Her classes are energetic, inclusive, and deeply restorative.",
    specialties: ["Hatha Yoga", "Vinyasa Flow", "Pranayama (Breathwork)", "Stress Relief"],
    languages: ["English", "Hindi"],
    city: "Delhi",
    availability: ["Monday 08:00 AM", "Monday 04:00 PM", "Wednesday 09:00 AM", "Friday 08:00 AM"]
  },
  {
    id: 2,
    name: "Shubir Sharma",
    image: "images/yoga_2.png",
    rating: 4.8,
    reviewsCount: 42,
    style: "Ashtanga Yoga",
    experience: "9 Years",
    rate: "₹1,500/hr",
    tagline: "Build foundational strength, balance, and alignment from Rishikesh tradition.",
    bio: "Shubir believes that yoga is for every body. With a background in physical alignment and biomechanics, his classes focus on Ashtanga Primary Series, structural stability, and cultivating deep physical awareness. Perfect for both beginners and seasoned practitioners.",
    specialties: ["Ashtanga Primary Series", "Alignment & Biomechanics", "Hatha Basics"],
    languages: ["English", "Hindi", "Marathi"],
    city: "Mumbai",
    availability: ["Tuesday 07:00 AM", "Thursday 07:00 AM", "Saturday 10:00 AM"]
  },
  {
    id: 3,
    name: "Chetan Dev",
    image: "images/yoga_3.png",
    rating: 5.0,
    reviewsCount: 78,
    style: "Therapeutic Yoga",
    experience: "15 Years",
    rate: "₹2,000/hr",
    tagline: "Slowing down to restore the nervous system and heal somatic pain.",
    bio: "Chetan is a senior yoga therapist specializing in restorative practices. Having taught globally, he integrates mindfulness, sound baths, and somatic release in his Yin classes. His sessions are designed as deep nervous system resets to heal chronic fatigue, back pain, and anxiety.",
    specialties: ["Therapeutic Yoga", "Somatic Healing", "Sound Meditation", "Spinal Recovery"],
    languages: ["English", "Hindi", "Kannada"],
    city: "Bengaluru",
    availability: ["Monday 06:00 PM", "Wednesday 06:00 PM", "Sunday 09:00 AM"]
  },
  {
    id: 4,
    name: "Meera Nair",
    image: "images/yoga_4.png",
    rating: 4.9,
    reviewsCount: 94,
    style: "Prenatal Yoga",
    experience: "10 Years",
    rate: "₹1,400/hr",
    tagline: "Gentle prenatal sequences supporting active motherhood and breathwork.",
    bio: "Meera has spent over a decade guiding mothers through their prenatal and postnatal wellness journeys. Her sessions focus on pelvic mobility, safe restorative sequences, and emotional centering during pregnancy.",
    specialties: ["Prenatal Yoga", "Postnatal Recovery", "Restorative Flow", "Guided Breathwork"],
    languages: ["English", "Malayalam", "Tamil"],
    city: "Online",
    availability: ["Tuesday 08:00 AM", "Thursday 08:00 AM", "Friday 05:00 PM"]
  }
];

// ------------------------------------------
// JOBS DATABASE (NEW FEATURE)
// ------------------------------------------
const jobsDatabase = [
  {
    id: 1,
    title: "Corporate Yoga & Wellness Instructor",
    company: "Infosys Tech Park Hub",
    city: "Bengaluru",
    type: "Corporate",
    compensation: "₹2,500/session",
    experience: "3+ Years",
    postedDate: "July 01, 2026",
    description: "We are seeking a certified Yoga Instructor to run weekly mindfulness and chair-yoga sessions for corporate employees. The goal is to reduce workplace stress, address desk-posture fatigue, and guide brief meditation/breathwork breaks.",
    requirements: [
      "Certified Yoga Teacher (YTT 200 min)",
      "Prior experience teaching corporate groups or beginners",
      "Specialization in posture correction and Hatha yoga",
      "Strong verbal communication skills in English"
    ]
  },
  {
    id: 2,
    title: "Primary School Hatha Yoga Teacher",
    company: "Greenwood International School",
    city: "Delhi",
    type: "School",
    compensation: "₹45,000/month",
    experience: "2+ Years",
    postedDate: "June 28, 2026",
    description: "Looking for an energetic Hatha and child-friendly yoga guide to teach primary school students (Classes 1-5) twice a week. The ideal candidate will combine storytelling, somatic play, and basic breathing techniques to keep children engaged.",
    requirements: [
      "Certified Yoga Educator / Teacher",
      "Proven experience working with children or young groups",
      "Patient, energetic, and child-safe teaching methodologies",
      "Background checks and clearance required"
    ]
  },
  {
    id: 3,
    title: "Therapeutic Specialist & Somatic Guide",
    company: "Arogya Wellness Clinic",
    city: "Mumbai",
    type: "Studio",
    compensation: "₹1,800/class",
    experience: "5+ Years",
    postedDate: "June 25, 2026",
    description: "Arogya Clinic is hiring a Senior Therapeutic Yoga Teacher to guide private and group classes focusing on spine recovery, joint health, and stress relief for seniors. Restorative techniques are highly preferred.",
    requirements: [
      "AYUSH Ministry Certified or Certified Yoga Therapist",
      "Deep understanding of musculoskeletal anatomy and rehabilitation",
      "5+ years of clinical or private studio instruction experience",
      "Fluency in Hindi and English"
    ]
  },
  {
    id: 4,
    title: "Online Prenatal Yoga Coach",
    company: "YogKulam Virtual Campus",
    city: "Online",
    type: "Private",
    compensation: "₹1,500/hr",
    experience: "3+ Years",
    postedDate: "July 02, 2026",
    description: "Guiding online prenatal and postnatal group sessions. Must be highly skilled in pelvic floor health, prenatal sequencing, safe stretches, and emotional centering for expecting mothers.",
    requirements: [
      "Accredited Prenatal Yoga Teacher (RPYT)",
      "High-speed internet connection and professional online teaching environment",
      "Strong empathetic communication skills",
      "Accredited by Yoga Alliance or PYC"
    ]
  }
];
