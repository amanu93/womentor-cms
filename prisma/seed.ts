/* Seeds the database with the content currently live on womentorafrica.com
   and creates the first admin user from ADMIN_EMAIL / ADMIN_PASSWORD. */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ----- Admin user -----
  const email = process.env.ADMIN_EMAIL ?? "admin@womentorafrica.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Administrator", role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
  });

  // ----- Settings -----
  await prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  // ----- Home content -----
  await prisma.homeContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroTitle: "Lifting as\nWe Rise",
      heroSubtitle:
        "A Pan-African movement of women in investment and finance — mentoring, supporting, and championing each other to rise and lead with purpose.",
      heroQuote:
        "Together, we're building confidence, capability, and community across borders. Because when one woman rises, an entire continent moves forward.",
      approachIntro:
        "At Womentor Africa, we've seen that true career advancement for women comes from a balanced approach built on three pillars — Mentorship, Leadership Development, and Sponsorship.\nTogether, these pillars create a proven pathway for women to grow, lead, and shape Africa's investment and finance landscape.",
      mentorshipBody:
        "At the heart of Womentor Africa is our flagship mentorship program — a curated experience connecting women in investment and finance across the continent for real, measurable growth.\n\nOur program brings together women who have walked the path — those who have navigated the challenges, broken barriers, and reached leadership — to guide those rising behind them. It's about creating a visible pathway to leadership, shaped by women who know what it takes to get there.",
      expectIntro: "Each mentorship cycle is designed to deliver growth that lasts personally, professionally, and collectively.",
      expectCtaBody:
        "Whether you're seeking guidance, ready to mentor others, or positioned to do both your next chapter starts here.",
      quoteText:
        "By joining Womentor Africa, you're not just advancing your career — you're contributing to a movement that is redefining what leadership in the African investment ecosystem looks like.",
      impactIntro: "A growing community of women lifting each other across Africa's investment ecosystem.",
      communityBody: "Join us in shaping Africa's next generation of women leaders.",
      partnerBody: "Collaborate to expand opportunities for women across Africa's investment ecosystem.",
      followBody: "Stay connected for updates, events, and stories.",
      menteeBenefits:
        "Receive personalized guidance tailored to your goals\nLearn from world-class mentors across industries\nGrow your network and professional confidence",
      mentorBenefits:
        "Share your expertise and make a lasting impact\nConnect with motivated mentees worldwide\nStrengthen your leadership and coaching skills",
    },
  });

  const empty = async (name: "aboutSlide" | "pillar" | "feature" | "expectTab" | "faq" | "stat" | "partner") =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((await (prisma as any)[name].count()) as number) === 0;

  if (await empty("aboutSlide")) {
    await prisma.aboutSlide.createMany({
      data: [
        {
          order: 0,
          heading: "The Why",
          title: "Because When Women Rise, Africa Rises",
          content:
            "Across Africa, talented women in investment and finance often face invisible ceilings, limited networks, few role models, and scarce mentorship.\n\nWomentor Africa bridges this gap. We create a space where women lift each other, share wisdom, and open doors for those coming after them.",
          image: "/images/illustrations/womenPicture.svg",
        },
        {
          order: 1,
          heading: "Our VISION",
          title: "",
          content:
            "To build a Pan-African network of women in investment and finance who lift each other to lead — creating a continent where women's leadership is visible, valued, and transformational.",
          image: "/images/illustrations/womenPicture.svg",
        },
        {
          order: 2,
          heading: "Our MISSION",
          title: "",
          content:
            "To empower African women professionals through mentorship, sponsorship, and development — connecting ambition with opportunity, and experience with purpose.",
          image: "/images/illustrations/womenPicture.svg",
        },
      ],
    });
  }

  if (await empty("pillar")) {
    await prisma.pillar.createMany({
      data: [
        { order: 0, title: "Mentorship", icon: "handshake", color: "orange", description: "One-on-one, structured, and purpose-driven guidance that nurtures confidence and accountability." },
        { order: 1, title: "Training & Development", icon: "book", color: "amber", description: "Practical learning experiences that strengthen leadership, technical, and interpersonal skills." },
        { order: 2, title: "Sponsorship", icon: "megaphone", color: "pink", description: "Turning mentorship into action through allyship, where women and men actively open doors, amplify voices, and create visibility for women leaders across Africa." },
      ],
    });
  }

  if (await empty("feature")) {
    await prisma.feature.createMany({
      data: [
        { order: 0, title: "Tiered Mentorship Levels", description: "From Super Mentors to emerging professionals, every participant is both a teacher and a learner — ensuring growth flows in every direction." },
        { order: 1, title: "Pan-African Matching", description: "Mentees connect with mentors across countries and markets, gaining diverse insights, shared strategies, and cross-border connections." },
        { order: 2, title: "Purpose-Driven Design", description: "Using AI-enabled matching, each mentor–mentee connection is based on shared goals, expertise, and aspirations — ensuring every relationship starts with purpose and ends with measurable growth." },
        { order: 3, title: "Community Integration", description: "Mentorship is only the beginning — participants access training, peer learning, and sponsorship opportunities within the wider Womentor Africa ecosystem." },
      ],
    });
  }

  if (await empty("expectTab")) {
    await prisma.expectTab.createMany({
      data: [
        {
          order: 0,
          title: "Duration & Structure",
          body:
            "Each mentorship relationship is designed around **six structured sessions**, guided by clear milestones and mutual goals.\n\nMentors and mentees meet regularly — virtually or in person — to review progress, reflect, and adjust as needed. Sessions are typically scheduled **monthly or bi-weekly**, depending on availability and preference, and usually last **no more than an hour**.\n\nThis flexible approach ensures every connection is intentional, sustainable, and focused on measurable growth — turning each session into a meaningful step toward leadership and professional confidence.",
        },
        {
          order: 1,
          title: "Support & Resources",
          body:
            "The Womentor Africa team provides continuous support throughout the program, including:\n\n- An Orientation session to get you started.\n- Structured mentorship guides and milestone templates\n- Learning materials and access to group sessions\n- Ongoing check-ins for accountability and encouragement",
        },
        {
          order: 2,
          title: "Commitment & Engagement",
          body:
            "Mentors and mentees dedicate approximately **2–3 hours per month** to conversations, goal reviews, and reflection.\n\nThe program is flexible — built to accommodate busy professionals while maintaining depth and consistency.",
        },
        {
          order: 3,
          title: "Outcomes & Growth",
          body:
            "Mentorship at Womentor Africa is not just about learning — it's about transformation. Each connection adds another link to the chain of women lifting women across Africa.\n\nParticipants leave the program equipped not only with new knowledge, but with a renewed sense of purpose and belonging in Africa's investment landscape.\n\n**For mentees:**\n\n- Meaningful professional relationships that open doors and expand visibility.\n- The knowledge and confidence to navigate your own path to leadership — with clarity, strategy, and support.\n- Access to spaces and conversations that have traditionally been closed off — the advantage of networks, insight, and opportunity.\n- A deeper understanding of how to champion other women as you grow.\n\n**For mentors:**\n\n- The opportunity to contribute to Africa's leadership legacy by guiding the next generation of women in investment and finance.\n- Fresh perspective and access to ground-level insights from emerging talent — a rare advantage that bridges the generational gap often missed in boardrooms and leadership circles.\n- Reconnection to purpose — shaping not just individual careers, but the collective trajectory of women in Africa's investment ecosystem.",
        },
      ],
    });
  }

  if (await empty("faq")) {
    await prisma.faq.createMany({
      data: [
        { order: 0, question: "Who can apply to be a mentor or mentee?", answer: "Women in investment or finance across Africa — from entry level to senior leadership — who believe in collaboration and shared growth." },
        { order: 1, question: "Can someone be both a mentor and a mentee?", answer: "Yes, absolutely! Many participants serve in both roles, creating a dynamic learning environment where everyone contributes and grows." },
        { order: 2, question: "How are matches made?", answer: "We use AI-enabled matching based on shared goals, expertise, and aspirations to ensure every mentor-mentee connection starts with purpose." },
        { order: 3, question: "What kind of support will I receive?", answer: "You'll receive orientation sessions, structured guides, milestone templates, learning materials, access to group sessions, and ongoing check-ins." },
        { order: 4, question: "Is there a cost to participate?", answer: "The mentorship program is free for all participants. We believe in removing barriers to professional growth and development." },
        { order: 5, question: "What happens after the mentorship cycle?", answer: "Participants remain part of the Womentor Africa community, with access to ongoing training, peer learning, and sponsorship opportunities." },
        { order: 6, question: "How can companies or organizations partner with Womentor Africa?", answer: "We welcome partnerships with organizations committed to advancing women in investment and finance. Please contact us to discuss partnership opportunities." },
      ],
    });
  }

  if (await empty("stat")) {
    await prisma.stat.createMany({
      data: [
        { order: 0, value: "200+", label: "Women Connected", description: "Building relationships that elevate leadership.", icon: "link" },
        { order: 1, value: "14", label: "Countries Represented", description: "From Dakar to Nairobi — one Pan-African network.", icon: "globe" },
        { order: 2, value: "25+", label: "Investment Institutions Engaged", description: "Fund managers, Investment Vehicles, and finance leaders united by purpose.", icon: "building" },
        { order: 3, value: "600+", label: "Mentorship Hours Completed", description: "Structured sessions driving measurable growth.", icon: "clock" },
        { order: 4, value: "75%", label: "Mentees Became Mentors", description: "Sustaining the cycle of leadership and empowerment.", icon: "trend" },
        { order: 5, value: "20+", label: "Learning Sessions & Events", description: "Spaces where ideas, confidence, and opportunity meet.", icon: "calendar" },
      ],
    });
  }

  if (await empty("partner")) {
    await prisma.partner.createMany({
      data: [
        { order: 0, name: "AFIG Funds", logo: "/images/logos/AFIGLOGO.png", website: "https://www.afigfunds.com/" },
        { order: 1, name: "Mastercard Foundation", logo: "/images/logos/Africa_Growth_Fund_Logo-partnership_1.png", website: "" },
        { order: 2, name: "MEDA", logo: "/images/logos/meda.svg", website: "https://www.meda.org/" },
        { order: 3, name: "Zare Innovations", logo: "/images/logos/zareInnovations.svg", website: "https://zareinnovations.com/" },
        { order: 4, name: "Triple C Advisory", logo: "/images/logos/TripleAdvisory.svg", website: "" },
      ],
    });
  }

  console.log(`Seeded. Admin login: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
