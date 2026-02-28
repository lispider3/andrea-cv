import './style.css';

// ============ DATA ============
const experiences = [
  {
    title: "Chief Product Officer",
    company: "NDA OBO Oddin.gg",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#7C3AED"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">O</text></svg>`,
    period: "Apr 2025 – Present",
    location: "Remote",
    current: true,
    details: [
      "Leading a team of Product Managers, Scrum teams, and designers across multiple product lines in the esports betting space.",
      "Integrated AI tools into daily workflows — using Perplexity and Gemini as research assistants, Cursor, Lovable, and Antigravity for rapid prototyping, and Google AI Studio for experimentation.",
      "Developing and executing the product vision and strategy across all B2B product lines — Odds Feed, Sportsbook iFrame, and Engagement Tools.",
      "Building a culture of ownership, experimentation, and genuine human connection within the product organization.",
      "Driving cross-functional alignment between engineering, commercial, and operations teams.",
    ],
  },
  {
    title: "Chief Product Officer",
    company: "Betswap.gg",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#10B981"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`,
    period: "Apr 2024 – Apr 2025",
    location: "Remote",
    details: [
      "Led end-to-end product and technology strategy for a blockchain-based peer-to-peer betting exchange.",
      "Hired and led a team of 15+ developers and designers from zero.",
      "Defined the product roadmap for a decentralized sports betting platform.",
    ],
  },
  {
    title: "Principal Product Manager & People Lead",
    company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`,
    period: "Sep 2020 – Apr 2024",
    location: "Malta",
    details: [
      "Led the sportsbook product strategy across Betsson's portfolio of 20+ brands.",
      "Managed and mentored a team of Product Owners, fostering growth and career development.",
      "Drove the adoption of modern product management practices across the organization.",
      "Spearheaded the migration to a new sportsbook platform, managing complex stakeholder relationships.",
    ],
  },
  {
    title: "Head of Sportsbook",
    company: "BOSS. Gaming Solutions",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="4" fill="#000"/><text x="18" y="22" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="900" font-size="8" letter-spacing="0.5">BOSS.</text></svg>`,
    period: "Nov 2019 – Jan 2021",
    location: "Malta",
    details: [
      "Owned the full sportsbook product lifecycle — from third-party feed integration to front-end experience.",
      "Managed relationships with key platform providers and negotiated commercial agreements.",
      "Built and led a cross-functional team of developers, QA engineers, and designers.",
    ],
  },
  {
    title: "Head of Product",
    company: "Hardball Group / Yourbet",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#3B82F6"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="12">YB</text></svg>`,
    period: "Dec 2018 – Nov 2019",
    location: "Malta",
    details: [
      "Defined and delivered the product strategy for a startup sportsbook operation.",
      "Led end-to-end product development from concept through to market launch.",
      "Managed a team of developers and designers, shipping weekly releases.",
    ],
  },
  {
    title: "Product Manager",
    company: "FanLeague",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#06B6D4"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="12">FL</text></svg>`,
    period: "Dec 2017 – Dec 2018",
    location: "Malta",
    details: [
      "Managed a Fantasy sports product for a rapidly growing startup.",
      "Drove user engagement through gamification features and community building.",
    ],
  },
  {
    title: "Product Owner",
    company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`,
    period: "Apr 2015 – Dec 2017",
    location: "Malta",
    details: [
      "Owned the sportsbook product backlog for Betsson's flagship brands.",
      "Worked closely with development teams to deliver iterative improvements to the sportsbook experience.",
    ],
  },
  {
    title: "Sportsbook Risk Manager",
    company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`,
    period: "Sep 2011 – Apr 2015",
    location: "Malta",
    details: [
      "Managed sportsbook risk and trading operations across multiple brands.",
      "Built pricing models and managed live in-play betting risk.",
      "Transitioned from operations into product management — the rest is history.",
    ],
  }
];

const testimonials = [
  { name: "Greg Bennett", role: "CEO", company: "Max Entertainment", relation: "Andrea reported to me", text: `Andrea is a conscientious and talented Product Owner who I would recommend without reservation.\n\nHe inspires his teams and they respond with loyalty and respect. The developers on his team would claim him as their Product Owner with pride while I was at Betsson and they looked to him for guidance and reassurance. We worked through some extremely difficult periods together and his resolution to achieve things, and his determination to always do better than last time really stood out.\n\nHe is hard-working, often staying late in order to complete wire-frames, or update stories for developers, or even just to make sure that the next Sprint planning session went smoothly with everyone knowing before they arrived what was going to be discussed. He couples that with a sense of humour that rarely ebbs, and an ability to stay up to date with things that occasionally surprised even me.\n\nThere's a saying in Product: "make the difference". Andrea certainly does.` },
  { name: "James Zerafa", role: "Chief Operating Officer", company: "", relation: "Worked on different teams", text: `I worked with Andrea for more than four years and instantly noticed his potential. He is the type of guy that will perform, no matter what you throw at him. Mostly contributing to this, is his approach and way of dealing with any problems that would arise. Also, his wide experience in the Product/Sportsbook field makes him a strong candidate for quite a few roles, since he has the understanding of both a technical and operational point of view. I would highly recommend Andrea, and would love to work with him again in the future should our paths cross.` },
  { name: "Markus Jennemyr", role: "CFO", company: "SeQura", relation: "Andrea reported to me", text: `Andrea came on board to take responsibility and co-ordinate the strategic and tactical roadmap and execution at FanLeague. His impact was immediate where his experience and passion made a big difference. A key quality Andrea has is the willingness and character to 'say no' when things don't make sense. Say no to strong minded founders when their ideas are too crazy. Andrea did an excellent job of managing idea generation and customer feedback into a structured development process together with our CTO in Sweden and Dev team in Ukraine. It was a pleasure working with Andrea and I wish him all the best in the future.` },
  { name: "Rosaire Galea Cavallaro", role: "Vice President, Business Development", company: "", relation: "Worked on the same team", text: `A true professional, excellent work ethics and passionate about what he does. I worked directly with Andrea during our time together at Betsson. He is a guy who always brings good vibes to the office but works hard and knows exactly what should be done in order to get things done. Furthermore I did work indirectly with Andrea even when we were not at the same company by closing deals that were of mutual benefit to both of the companies in question. Super nice guy, the only tricky thing about Andrea is that his jokes are on another level and not everyone gets them :) I recommend Andrea with all my heart, he is one of the few people that I would have absolutely no problem in recommending because one thing is for sure: he will not let himself or any others down. Having him in any company is a massive asset and a big plus from all aspects.` },
  { name: "Veronica Zammit", role: "Head of Product - Sportsbook", company: "Singular (part of Flutter)", relation: "Worked on the same team", text: `I have worked with Andrea on multiple projects at Betsson. Andrea's expertise in Sportsbook and market offerings is truly exceptional, and his contributions have been instrumental in driving our team's success.\n\nAndrea is resilient, collaborative, and data-driven. His extensive experience in trading has proven invaluable on numerous occasions, providing crucial insights and guiding our decision-making processes. Andrea is always willing to share his knowledge, teaching his peers and providing essential context to the tasks at hand, which greatly enhances our team's overall competence.\n\nAndrea's most notable strength lies in his ability to foster effective communication and build strong teams. He excels at creating a collaborative atmosphere, ensuring that every team member feels included and valued.\n\nI am confident that Andrea will continue to excel and bring his dedication, expertise, and team spirit to any future endeavours.` },
  { name: "Dimitris Arampatzis", role: "Head of Product | Sportsbook Experience", company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`, relation: "Worked on the same team", text: `I have had the privilege of closely working with Andrea for the past two years, and I continue to be thoroughly impressed by his profound SB product knowledge and his exceptional leadership skills. Andrea possesses an unmatched product expertise, which he consistently shares generously with his colleagues. Moreover, Andrea has a remarkable ability to lead and inspire his teams to collaborate effectively, creating a working atmosphere in which people genuinely enjoy working together. He provides strong mentorship and a clear path to both individual and team success.\n\nKudos to you, Andrea. Thank you for being such an outstanding and inspiring colleague to work alongside.` },
  { name: "Dennis Mifsud", role: "Head of Sportsbook Engineering", company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`, relation: "Worked on the same team", text: `Andrea worked with me as the product manager for the tech team I led. From the moment he joined he made an impact immediately. His vast knowledge of sports and trading proved invaluable to arriving at the correct initiatives to chase and push for. He regularly listens to ideas coming from within the team and masterfully brings out the product value for everything. He often works far beyond the call of duty and even took some shots for the tech team. Within Product he gets down to incredible detail and his organisational skills, as well as his pride in his work is exemplary.\n\nAs a person, Andrea is welcoming, helpful and loves having to teach something to someone. He also has a sense of humour, which helped a lot in times of trouble.\n\nTruly a pleasure to have worked with him.` },
  { name: "David Attard", role: "Head of Sportsbook", company: "LeoVegas Group", relation: "Worked on the same team", text: `Andrea is quite simply a first class gregarious person. His work ethic, hard work, willingness to learn and the ability to always come up with solutions no matter how complex the problem is, never ceases to impress me.\n\nI've known Andrea for almost 10 years and we currently work and play football together. The way he looks and deals with things in life inspires me. With his "outside the box" thinking he has the ability to make complex stuff look simple, and implements the solution with ease. That is why I see him as a great leader at work and an "on-and-off the pitch" captain.\n\nAndrea has a unique blend of sportsbook knowledge no matter if it is a product, trading or business. He constantly looks into new ways of improving the product to provide better stability and customer experience. His hard work and dedication is second to none.\n\nAndrea and his capabilities make a difference in whatever he does and leaves an impact to whoever he works with.` },
  { name: "Graziella Grech", role: "Head of Human Resources", company: "Enteractive", relation: "Worked on the same team", text: `I was impressed by Andrea's way of dealing with the different internal stakeholders and the way he adapts to the different company exigencies. His strong work ethic made it easy to work hand in hand with him even when building the Sportsbook team which he led. Adopting a transformational management style, he aided his subordinates progress in their career.\n\nHe makes everyone feel valued and manages to uplift employees morale even in the most tense situations. Andrea is very loyal, insightful, and has the ability to adapt to any environment making him an asset to any company.` },
  { name: "Thanasis Fouras", role: "Head of Esports Product", company: "BETER", relation: "Reported to Andrea directly", text: `Words cannot fully express my gratitude for Andrea. He is an exceptional manager who balances trust and autonomy with unwavering support for his team. It's rare to find someone of his caliber, and I feel fortunate to have had the opportunity to work with him. Andrea is a true leader, consistently boosting team members' confidence and always ready to stand up for them when needed. Any organization would be incredibly fortunate to have him.` },
  { name: "Kristina Aus", role: "Principal Product Delivery Manager | iGaming", company: "", relation: "Reported to Andrea directly", text: `I would like to take a moment to express my appreciation for Andrea. I was lucky to have him as my manager at the start of my Betsson Career.\n\nFrom the very beginning, his unwavering support, extensive industry knowledge, and remarkable ability to help overcome difficulties have made a profound difference in my day to day work life. Andrea consistently went above and beyond to ensure that I felt valued and heard within the team. Whether it was providing constructive feedback, offering guidance, or lending an empathetic ear, his dedication to my growth and well-being has been truly exceptional.\n\nFurthermore, his vast knowledge of the industry has been invaluable. His deep understanding of current trends, market dynamics, and best practices has not only helped me navigate complex projects but has also broadened my own perspective.\n\nThank you for being an exceptional leader and for not being afraid to push for what is right.` },
  { name: "Massimo Nastasi", role: "Principal Product Designer | Design System Lead", company: "", relation: "Reported to Andrea directly", text: `Andrea is not only a great manager, very professional and with extraordinary people skills but also a natural team leader.\n\nHe is the perfect union between passion, enthusiasm and ability. Having him as manager at Betsson has been for me not only a reason for learning but a source of inspiration and ambition.\n\nHis brilliant competence makes him a professional like few and by the simple human side, a person who is impossible to forget.` },
  { name: "Olivier Vencencius", role: "Sportsbook Product", company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`, relation: "Worked on the same team", text: `I had the chance of working closely with Andrea for three years at Betsson, and I can confidently say he excels at building teams and innovative products. His in-depth understanding of the Sportsbook industry, including trading, user experience, and supplier management, is truly impressive. He brings a well-rounded perspective that really benefits any challenge he tackles.\n\nAndrea is not only knowledgeable but also a fantastic team player. He easily creates a great work environment and is always willing to support his colleagues. His honesty and clarity about goals and areas needing improvement are refreshing and invaluable. Besides, his innovative mindset, particularly his early exploration of AI and automation to enhance efficiency, makes him a visionary leader.\n\nAs a people manager, Andrea is exceptional. His team members are motivated, well-informed, and reliably produce top-notch work. You can always count on him and his team to deliver excellent results. Andrea is an outstanding professional, colleague, and leader, and I highly recommend him for any position that values expertise, creativity, and strong leadership.` },
  { name: "Christian Azzopardi", role: "Product Manager", company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`, relation: "Reported to Andrea directly", text: `I have been under Andrea's leadership for around 2 and a half years now and I cannot stress how pleasant it is to have a manager with the qualities that Andrea brings to me and my colleagues. He is the true definition of what a "people manager" should be all about, not to mention his vast knowledge in the area of sports and iGaming in general.\n\nAndrea manages to strike a perfect balance between being professional and also making work a pleasant experience for the whole team. It is also thanks to him that our team is so united, dedicated and proud of our deliveries. Andrea simply likes to share his knowledge with anyone that needs it, and he takes pride in selflessly making his team members learn, grow and advance in their career path.\n\nWith his skills in managing both projects and people, his daily self-driven approach and care while doing his job, and his attitude filled with good vibes and tons of patience in tackling complex problems, I would recommend Andrea to anyone needing a strong manager to undertake any kind of challenging endeavour.` },
  { name: "Christina Petrina Basdekidi", role: "Product Design Manager", company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`, relation: "Reported to Andrea directly", text: `I had the pleasure of working with Andrea, who served as my manager in the Sportsbook UX team.\n\nAndrea is an outstanding communicator and an exceptional people manager. Andrea's approach to management is truly commendable. He fostered a collaborative and inclusive environment where every team member felt valued and heard. His knack for recognizing individual strengths and providing constructive feedback helped us grow both personally and professionally.\n\nUnder Andrea's leadership, our team consistently delivered high-quality projects on time, often exceeding client expectations. His strategic vision and keen eye for detail ensured that our designs were not only user-friendly but also innovative and impactful.\n\nI wholeheartedly recommend Andrea for any leadership role.` },
  { name: "Dániel Füleki", role: "Product Design Manager", company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`, relation: "Reported to Andrea directly", text: `You can't often meet a manager who perfectly mix the highest level of professionalism with empathy and humor. But Andrea is without doubt a great member of this special club. I can't imagine he wouldn't be able to cope in any position where he should motivate and engage his colleagues in order to work together as a high-efficient team.` },
  { name: "Daniel Farrugia", role: "Senior Product Owner | iGaming Specialist", company: "", relation: "Andrea was senior to Daniel but didn't manage directly", text: `We meet many people during our careers, but only some leave positive marks, and one of them, without exaggeration, is Andrea Spiteri. We have joined our efforts numerous times during my 3-year-journey at Betsson Group. In some of those years, I had the pleasure to be guided and supervised by Andrea who always leads by example.\n\nAndrea is a great manager and an outstanding mentor. His rare mix of productivity and ambition sets a great example for others and explains why people often rely on his opinion and expertise, no matter where they fall on the org chart.\n\nAndrea is innovative, organized, and can work through crises and produce new ways to achieve goals. He knows how to handle any situation calmly and patiently, and always managed to keep the team morale up.` },
  { name: "Patricia Vosinaki", role: "Senior Product Partner Manager", company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`, relation: "Worked on the same team", text: `I have worked together with Andrea in Betsson since I joined the company, and I can say he is the perfect combination of a person who will put his experience and expertise in practice in the most effective and productive way, alongside a great personality and attitude.\n\nA true team player always willing to help and a great people's manager, always supportive towards his team. And at the same time, an experienced professional, a critical thinker and a person one can rely on to get the job done.\n\nI highly recommend Andrea, as he would be a great asset to any company!` },
  { name: "János Halász", role: "Senior Product Owner", company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`, relation: "Reported to Andrea directly", text: `I have worked together with Andrea for 18 months. He saw the potential in me as a product owner without any prior knowledge in sportsbook domain and he offered me a position in his team. He helped me a lot with getting up to speed, sharing his vast domain knowledge, connecting me with the right people who can help me learn more and giving me the freedom in my work to be the most efficient.\n\nAndrea has a talent in managing people, he is very good at inspiring his team. He always walks the extra mile; he is committed to deliver excellence. He protects his team. He establishes a good atmosphere during the meetings. He has very good communication skills. I really enjoy working with him and I can wholeheartedly recommend him.` },
  { name: "Katerina Diamanti", role: "Senior Product Owner", company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`, relation: "Reported to Andrea directly", text: `Andrea has been my line manager in sportsbook product development since I joined Betsson as a product owner and I am thrilled to say that not only he is a product manager with a solid product and industry expertise, but a great people leader as well.\n\nAndrea has supported me in starting my role as product owner as he has always a strategic vision for the team, providing clear actionable plans.\n\nHe is an excellent communicator and what really stands out is his positive attitude and commitment to excellence, something that inspires everyone around him.` },
  { name: "Dale Chetcuti", role: "Software Engineering Team Lead", company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`, relation: "Worked on the same team", text: `I have been working with Andrea for around 2 years now. During this time, he has been a pillar to our teams as a product manager, as he has always given us ample knowledge and support to deliver as much as we can with the best quality possible.\n\nApart from being very knowledgeable in Sportsbook, he is also very dedicated and is a great person to work with. Although he is not my manager, he has supported me and given me a lot of advice throughout these 2 years, which helped me get to where I am now.\n\nI do not have one bad word to say about him, and these last 2 years have been an honour and a pleasure working with him. I would highly recommend him for any position as he will be a great asset to any company.` },
  { name: "Konstantinos Arampatzis", role: "Sportsbook Product Manager", company: "B2Tech", relation: "Worked on the same team", text: `I highly recommend Andrea for his strong Product Management skills and for his deep Sportsbook knowledge. His exceptional problem-solving abilities, innovative thinking and creative approach to challenges are invaluable in finding unique solutions and making improvements in the quality of the product.\n\nAndrea is a great colleague, assisting everyone in embracing the Organisation's culture, an inspiring leader and a great friend.` },
  { name: "Anthony Mamo", role: "Sportsbook Manager", company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`, relation: "Worked on different teams", text: `Andrea is a highly skilled professional with a remarkable ability to blend industry knowledge with a personable approach. His deep knowledge of the sportsbook industry is impressive, and his ability to apply this expertise to drive successful outcomes has been invaluable to our team.\n\nHe's like the secret sauce that makes a team a well-oiled machine—kind of like the garlic in a great pasta dish!\n\nI highly recommend him for any role that values expertise and a positive, engaging work environment.` },
  { name: "Glenn Camilleri", role: "European & Esports Trading Manager", company: "Betsson Group",
    logo: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="8" fill="#F59E0B"/><text x="18" y="23" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-weight="700" font-size="14">B</text></svg>`, relation: "Worked on different teams", text: `I have the pleasure of working with Andrea on several projects. He is a professional and a leader in his field, who always delivers high-quality results and innovative solutions.\n\nHe is always looking for ways to improve the product and the user experience. He is also a great communicator and a team player.\n\nHe is one of the best product managers I have ever worked with, and I would highly recommend him for any position that requires a strong vision, a strategic mindset, and a hands-on approach.` },
  { name: "Mark Buhagiar Fava", role: "Program Manager", company: "Singular", relation: "Worked on the same team", text: `When I first met Andrea, I thought he was another arrogant "Mr know it all" person, not entirely his fault I was surrounded by such people back then. Few weeks later and it feels it's been a lifetime working with Andrea, his character and charisma are something very hard to explain in simple words.\n\nI've had the pleasure to work with Andrea for more than a year at Betsson. It didn't take me long to realise that he is a very talented person, with a remarkable trading and sportsbook knowledge. Andrea is a very passionate person, who loves his job and takes pride in what he does.\n\nAnyone who knows Andrea can agree that he is an outspoken person but very good at listening and teaching others, as well as accepting critique and learning from people. His teams take pride in recognising him as their superior, and they will follow him blindly.\n\nAndrea is definitely someone I would recommend as a hard-working, unique person who can bring a difference wherever he goes.` },
  { name: "Daniel Menczel", role: "Staff Technology Program Manager", company: "Diligent Corporation", relation: "Client / External partner", text: `Andrea and me are working together more than a year ago, but I feel it is 10. We went thru many hard days. Create great ideas, build them from scratch and now we see them on Production. He is a very good team player, leader, motivator and keen to improve his skills as well always. He is open for discussions, find the best solution and keep the goal front of him always. I rely on him and happy to work together day by day.` },
  { name: "Karen Lim 林妍菁", role: "Project Management Practitioner, PMP", company: "", relation: "Worked on the same team", text: `I've had the opportunity to work with Andrea on several occasions. Andrea is the epitome of a 'doer'—someone who not only initiates projects with enthusiasm but sees them through to completion with exceptional diligence.\n\nResourcefulness is second nature to Andrea. Faced with challenges, Andrea has consistently demonstrated an impressive ability to leverage available resources and find innovative solutions.\n\nAs a problem solver, Andrea approaches complex situations with a clear, analytical mind, dissecting issues and synthesizing information to arrive at practical solutions that benefit the entire team.\n\nIn summary, Andrea is an invaluable asset to any team, and I wholeheartedly endorse him for any endeavor he chooses to pursue.` },
  { name: "Alan Brincat", role: "Online Marketing and Growth Strategist", company: "", relation: "Andrea reported to me", text: `Andrea is a pleasure to work and a seasoned expert when it comes to online gaming and product management. His experience and knowledge across all aspects of the sports betting vertical is impeccable. In fact, he is one of the selected few I still look toward for guidance and advice on sports related matters up until the very day. Andrea worked with me at Hardball Ltd and was brilliant at every stage of the process, working diligently and efficiently in a challenging role.` },
  { name: "Sam J", role: "Product Owner", company: "Play'n GO", relation: "Worked on the same team", text: `When I started working with Andrea in the Betsson Sportsbook Team, it was clear that he was a pillar of the product organisation there.\n\nWith his friendly and inclusive attitude, he made me feel comfortable and as a valued part of the team. He has an extensive knowledge in sports and trading, and he will teach anybody who wants to learn anything within the area.\n\nHe was a true leader to his development teams, and they had a strong team spirit and bond. Even when facing difficult challenges or people, he kept the morale and spirit high.\n\nI would love to work with Andrea again at any time.` },
  { name: "Kevin Falzon", role: "", company: "", relation: "Worked on the same team", text: `Andrea is a rare breed in the industry.\n\nHis roots as a trader, coupled with his passion for sports (particularly football), have equipped him with the sort of extensive domain knowledge that can only be acquired through years of hands-on experience. Moreover, he is thoroughly acquainted with the technical aspects of online betting, and understands what can be done and within what time-frame.\n\nHis being a successful trader turned successful product-owner, along with his sensible pragmatism and quick wit, make him truly outstanding in his field.` },
  { name: "David Bibor", role: "Delivering high-performing IT products for millions", company: "", relation: "Worked on the same team", text: `While Andrea is always easy-going, he works with amazing diligence and perseverance, and behind the funny sentences he shares there are years of hard work. His decisions are always backed by facts, his opinions always backed by careful consideration. Andrea is the kind of professional we rarely have the chance to work with, and without whom we would certainly find our days harder.` },
  { name: "Raisa Pierre", role: "UX Design | Product Design", company: "", relation: "Reported to Andrea directly", text: `I enjoyed working with Andrea is an excellent manager. His communication helped lift our spirits as a team with a combination of humor and empathy. He shares knowledge and answers every doubt and query calmly, and he even follows up to make sure my issues get resolved or not.` },
  { name: "Dino Ramic", role: "Digital Marketing Specialist", company: "", relation: "Worked on the same team", text: `Andrea is one of the most organized people I met. Work dedication, knowledge, setting teams and people around him on the right mindset is just one of the biggest assets he possesses. Analytical skills and approaching people on very kind but yet professional way is something what drives success in any workspace and business.\n\nFrom the professional side I can say he is a full package, very technical oriented, deep understanding and expertise of his business area and for sure he stands as one of the main "wheels" in any company structures.` },
  { name: "Lara Tedesco", role: "Strategic Planning | Project & Product Management", company: "", relation: "Worked on the same team", text: `After working with Andrea for well over a year, it is clear that not only does he bring with him a wealth of knowledge in his area but also has a refreshing work ethic. His positivity, leadership and eagerness to bring teams together and solve problems make him an MVP in any team he is in!` }
];

const achievementStories = {
  "Years in iGaming \& Sportsbook": "From sportsbook risk management to the C-suite — I started as a trader at Betsson in 2011, learning odds inside out. That domain expertise became the foundation for everything that followed: product ownership, people leadership, and ultimately running entire product organizations across iGaming and esports.",
  "PM / PO / Designers Recruited": "Across Betsson, BOSS Gaming, Betswap, and Oddin.gg, I've personally recruited and interviewed over 50 product managers, product owners, and designers. Hiring for character and culture fit first — skills can be taught, but attitude and values are non-negotiable.",
  "Largest Department Managed": "At Betsson Group, I led a department of 50+ people spanning product managers, designers, QA engineers, and developers across multiple sportsbook squads. Keeping everyone aligned, motivated, and shipping required a mix of clear strategy and genuine human connection.",
  "Providers Integrated": "From odds feeds and trading platforms to payment providers and front-end frameworks — I've managed the integration of 25+ third-party providers. Each one taught me something about vendor management, technical due diligence, and knowing when to build vs. buy.",
  "Different Sportsbooks Managed": "Betsson, Betsafe, NordicBet, CasinoEuro, Yourbet, BOSS Gaming, Betswap, and more — each with different markets, different customers, and different challenges. This breadth gives me a rare perspective on what works across segments.",
  "Departments Built From Zero": "At Betswap, I was employee #1 in product and built a 15-person team in 6 months. At BOSS Gaming, I established the sportsbook department. At Hardball/Yourbet, I set up both Product and Operations from scratch. Building from zero is where I thrive.",
  "Product Managers Mentored": "My proudest achievement isn't any product launch — it's watching the people I've mentored grow into leaders themselves. Several of my former reports are now Heads of Product and Senior POs at major companies.",
  "Sports Manually Traded": "Before product management, I spent 4 years as a sportsbook risk manager, manually trading 20+ sports from football to table tennis. This hands-on trading experience gives me an edge that no product course can teach."
};

const achievements = [
  { value: 15, suffix: "+", label: "Years in iGaming & Sportsbook" },
  { value: 50, suffix: "+", label: "Largest Department Managed" },
  { value: 25, suffix: "+", label: "Providers Integrated" },
  { value: 50, suffix: "+", label: "PM / PO / Designers Recruited" },
  { value: 10, suffix: "+", label: "Different Sportsbooks Managed" },
  { value: 4, suffix: "+", label: "Departments Built From Zero" },
  { value: 5, suffix: "+", label: "Product Managers Mentored" },
  { value: 20, suffix: "+", label: "Sports Manually Traded" },
];

// ============ INIT ============
const initParticles = () => {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '-4px';
    p.style.animationDuration = (6 + Math.random() * 8) + 's';
    p.style.animationDelay = (Math.random() * 6) + 's';
    container.appendChild(p);
  }
};

const initThemeToggle = () => {
  const toggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
    toggle.checked = true;
  }

  toggle.addEventListener('change', () => {
    const isLight = toggle.checked;
    document.documentElement.classList.toggle('light', isLight);
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
};

const initNavbar = () => {
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('burger-btn');
  const links = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
};

const initReveal = () => {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  window.observeReveals = () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  };
};

const initInteractions = () => {
  // Show more experience
  const expBtn = document.getElementById('show-more-exp');
  if (expBtn) {
    expBtn.addEventListener('click', () => {
      document.querySelectorAll('.exp-hidden').forEach(el => el.classList.remove('exp-hidden'));
      expBtn.closest('.show-more-wrap').style.display = 'none';
      window.observeReveals();
    });
  }

  // Show more testimonials
  const testBtn = document.getElementById('show-more-test');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      document.querySelectorAll('.test-card-hidden').forEach(el => el.classList.remove('test-card-hidden'));
      testBtn.closest('.show-more-wrap').style.display = 'none';
      window.observeReveals();
      setTimeout(checkReadMore, 50);
    });
  }

  setTimeout(checkReadMore, 100);
};

const initCountUp = () => {
  const counters = document.querySelectorAll('.achiev-value');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        const step = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = prefix + current + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
};

const initHeroTestimonials = () => {
  const slides = document.querySelectorAll('.hero-testimonial-slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
};

const checkReadMore = () => {
  document.querySelectorAll('.test-card:not(.test-card-hidden)').forEach(card => {
    const textEl = card.querySelector('.test-text');
    const btnEl = card.querySelector('.read-more-btn');
    if (textEl && btnEl && !card.dataset.checked) {
      card.dataset.checked = 'true';
      if (textEl.scrollHeight > textEl.clientHeight + 2) {
        btnEl.classList.add('show');
        btnEl.addEventListener('click', () => {
          textEl.classList.toggle('clamped');
          btnEl.textContent = textEl.classList.contains('clamped') ? 'READ MORE ▸' : 'SHOW LESS ▴';
        });
      }
    }
  });
};

// ============ RENDER ============
const renderHero = () => `
  <section class="hero" aria-label="Hero">
    <div class="hero-overlay"></div>
    <div class="hero-particles" id="hero-particles"></div>
    <div class="hero-content">
      <div class="hero-tag"><span>Chief Product Officer</span></div>

      <div class="hero-photo">
        <img src="/profile.jpg" alt="Andrea Spiteri — Chief Product Officer" loading="eager" width="180" height="180" onerror="this.src='https://ui-avatars.com/api/?name=Andrea+Spiteri&size=512&background=E10600&color=fff'" />
      </div>

      <h1 class="hero-headline">Andrea <span class="text-red">Spiteri</span></h1>

      <p class="hero-subtitle">
        Building products, growing people, and having a good time doing it. Over a decade in the gaming & esports industry.
      </p>

      <div class="hero-stats">
        <div class="stat-box">
          <span class="stat-box-value"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span>
          <span class="stat-box-label">Sportsbook Expert</span>
        </div>
        <div class="stat-box">
          <span class="stat-box-value"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg></span>
          <span class="stat-box-label">AI‑Fluent</span>
        </div>
        <div class="stat-box">
          <span class="stat-box-value"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg></span>
          <span class="stat-box-label">Product Strategy</span>
        </div>
        <div class="stat-box">
          <span class="stat-box-value"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
          <span class="stat-box-label">People Leadership</span>
        </div>
      </div>

      <div class="hero-cta-row">
        <a href="/andrea-spiteri-cv.pdf" download class="btn-f1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download CV
        </a>
        <a href="#contact" class="btn-f1 btn-f1-outline">
          Get in Touch <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>

      <div class="hero-testimonial-banner" aria-label="Testimonial highlights">
        <div class="hero-testimonial-track" id="hero-testimonial-track">
          <div class="hero-testimonial-slide active">
            <q>There's a saying in Product: "make the difference". Andrea certainly does.</q>
            <cite>— Greg Bennett, CEO, Max Entertainment</cite>
          </div>
          <div class="hero-testimonial-slide">
            <q>He is the true definition of what a "people manager" should be all about.</q>
            <cite>— Christian Azzopardi, Product Manager, Betsson</cite>
          </div>
          <div class="hero-testimonial-slide">
            <q>A natural team leader. The perfect union between passion, enthusiasm and ability.</q>
            <cite>— Massimo Nastasi, Principal Product Designer</cite>
          </div>
          <div class="hero-testimonial-slide">
            <q>Any organization would be incredibly fortunate to have him.</q>
            <cite>— Thanasis Fouras, Head of Esports Product, BETER</cite>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-scroll-indicator">
      <div>Scroll</div>
      <div class="scroll-arrow"></div>
    </div>
  </section>
`;

const renderAbout = () => `
  <section class="section section-dark" id="about" aria-label="About Me">
    <div class="container">
      <div class="reveal">
        <div class="section-tag"><span>Who I Am</span></div>
        <h2 class="section-title">About <span class="text-red">Me</span></h2>
      </div>

      <div class="reveal about-text">
        I lead product teams with a simple conviction: great products are built by empowered people. With over a decade in iGaming and Sportsbook, my approach trades corporate bureaucracy for radical candor and high-trust leadership. I specialise in building resilient cultures where teams have the clarity to execute, the safety to innovate, and the support to lead through turbulence.
      </div>

      <div class="reveal ai-tools-callout">
        <div class="ai-tools-label"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg> AI Tools I Use Daily</div>
        <div class="ai-tools-badges">
          <span class="ai-badge">Antigravity</span>
          <span class="ai-badge">Cursor</span>
          <span class="ai-badge">Lovable</span>
          <span class="ai-badge">Gemini</span>
          <span class="ai-badge">Perplexity</span>
        </div>
      </div>

      <div class="about-grid">
        <div class="reveal about-card">
          <div class="about-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>
          <div class="about-card-title">People First</div>
          <div class="about-card-desc">I hire for character, chemistry & culture above all else.</div>
        </div>
        <div class="reveal about-card">
          <div class="about-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg></div>
          <div class="about-card-title">Grow Together</div>
          <div class="about-card-desc">Helping my team find their path, feel successful, and enjoy the ride.</div>
        </div>
        <div class="reveal about-card">
          <div class="about-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
          <div class="about-card-title">Thrive Under Pressure</div>
          <div class="about-card-desc">The tighter the deadline, the sharper I get.</div>
        </div>
        <div class="reveal about-card">
          <div class="about-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></div>
          <div class="about-card-title">Connections Matter</div>
          <div class="about-card-desc">Relationships are the most important factor in everything I do.</div>
        </div>
      </div>
    </div>
  </section>
`;

const renderAchievements = () => `
  <section class="section section-dark" id="achievements" aria-label="Key Achievements">
    <div class="container">
      <div class="reveal">
        <div class="section-tag"><span>Track Record</span></div>
        <h2 class="section-title">Key <span class="text-red">Achievements</span></h2>
        <p class="section-subtitle">The numbers behind over a decade of building products, teams, and businesses.</p>
      </div>

      <div class="achiev-grid">
        ${achievements.slice(0, 3).map(a => `
          <div class="reveal achiev-card achiev-card--primary" data-label="${a.label}" onclick="openAchievModal(this)">
            <div class="achiev-value" data-target="${a.value}" data-prefix="${a.prefix || ''}" data-suffix="${a.suffix || ''}">${a.prefix || ''}0${a.suffix || ''}</div>
            <div class="achiev-label">${a.label}</div>
            <div class="achiev-card-hint">Click for story</div><div class="achiev-bar"></div>
          </div>
        `).join('')}
      </div>
      <div class="achiev-inline reveal">
        ${achievements.slice(3).map(a => `<span class="achiev-chip" data-label="${a.label}" onclick="openAchievModal(this)"><span class="achiev-chip-num" data-target="${a.value}" data-prefix="${a.prefix || ''}" data-suffix="${a.suffix || ''}">${a.prefix || ''}${a.value}${a.suffix || ''}</span> ${a.label}</span>`).join('<span class="achiev-sep">·</span>')}
      </div>
    </div>
  </section>
`;

const renderOffTrack = () => `
  <section class="section section-dark" id="offtrack" aria-label="Beyond Work">
    <div class="container">
      <div class="reveal">
        <div class="section-tag"><span>Off The Track</span></div>
        <h2 class="section-title">Beyond <span class="text-red">Work</span></h2>
        <p class="section-subtitle">Languages, education, and the things that keep me going when the laptop is closed.</p>
      </div>

      <div class="offtrack-grid">
        <!-- Languages -->
        <div class="reveal offtrack-panel">
          <div class="offtrack-panel-header">
            <span class="offtrack-panel-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
            <span class="offtrack-panel-title">Languages</span>
          </div>
          <div class="offtrack-panel-body">
            <div class="lang-row">
              <div class="lang-info">
                <span class="lang-name">Maltese</span>
                <span class="lang-level">Native</span>
              </div>
              <div class="lang-bar"><div class="lang-fill" style="width:100%"></div></div>
            </div>
            <div class="lang-row">
              <div class="lang-info">
                <span class="lang-name">English</span>
                <span class="lang-level">Native</span>
              </div>
              <div class="lang-bar"><div class="lang-fill" style="width:100%"></div></div>
            </div>
            <div class="lang-row">
              <div class="lang-info">
                <span class="lang-name">Italian</span>
                <span class="lang-level">Native</span>
              </div>
              <div class="lang-bar"><div class="lang-fill" style="width:100%"></div></div>
            </div>
            <div class="lang-row">
              <div class="lang-info">
                <span class="lang-name">Spanish</span>
                <span class="lang-level">Beginner</span>
              </div>
              <div class="lang-bar"><div class="lang-fill" style="width:25%"></div></div>
            </div>
            <div class="lang-row">
              <div class="lang-info">
                <span class="lang-name">French</span>
                <span class="lang-level">Beginner</span>
              </div>
              <div class="lang-bar"><div class="lang-fill" style="width:25%"></div></div>
            </div>
            <div class="lang-row">
              <div class="lang-info">
                <span class="lang-name">Greek</span>
                <span class="lang-level">Beginner</span>
              </div>
              <div class="lang-bar"><div class="lang-fill" style="width:25%"></div></div>
            </div>
          </div>
        </div>

        <!-- Education -->
        <div class="reveal offtrack-panel">
          <div class="offtrack-panel-header">
            <span class="offtrack-panel-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 10 3 12 0v-5"/></svg></span>
            <span class="offtrack-panel-title">Education</span>
          </div>
          <div class="offtrack-panel-body">
            <div class="edu-item">
              <div class="edu-degree">BSc Physical Education (Sports)</div>
              <div class="edu-meta">University of Malta</div>
              <div class="edu-meta">2008 – 2012</div>
            </div>
            <div class="edu-item">
              <div class="edu-degree">Matriculation Certificate</div>
              <div class="edu-meta">Physics & Mathematics</div>
            </div>
          </div>
        </div>

        <!-- Interests -->
        <div class="reveal offtrack-panel offtrack-panel--wide">
          <div class="offtrack-panel-header">
            <span class="offtrack-panel-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></span>
            <span class="offtrack-panel-title">Interests</span>
          </div>
          <div class="offtrack-interests">
            <div class="interest-chip">
              <span class="interest-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg></span>
              <span class="interest-label">CrossFit</span>
            </div>
            <a href="/f1-quiz/" class="interest-chip interest-chip--link" style="text-decoration:none;">
              <span class="interest-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg></span>
              <span class="interest-label">Formula 1</span>
              <span class="interest-flag">Quiz</span>
            </a>
            <div class="interest-chip">
              <span class="interest-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg></span>
              <span class="interest-label">Football</span>
            </div>
            <div class="interest-chip">
              <span class="interest-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg></span>
              <span class="interest-label">Traveling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const renderExperience = () => `
  <section class="section section-dark" id="experience" aria-label="Career Experience">
    <div class="container">
      <div class="reveal">
        <div class="section-tag"><span>Career</span></div>
        <h2 class="section-title">What I <span class="text-red">Do</span></h2>
        <p class="section-subtitle">From sportsbook trading floors to the C-suite — the full journey.</p>
      </div>

      <div class="experience-list">
        ${experiences.map((exp, i) => `
          <div class="reveal exp-card ${exp.current ? 'exp-card--current' : ''} ${i >= 3 ? 'exp-hidden' : ''}">
            ${exp.current ? '<div class="exp-badge">Current</div>' : ''}
            <div class="exp-logo">${exp.logo || ''}</div>
            <div class="exp-info">
              <div class="exp-title">${exp.title}</div>
              <div class="exp-company">${exp.company}</div>
              <div class="exp-meta">
                <span>${exp.period}</span>
                <span class="exp-meta-sep">|</span>
                <span>${exp.location}</span>
              </div>
              <div class="exp-details">
                ${exp.details.map(d => `
                  <div class="exp-detail">
                    <div class="exp-detail-dot"></div>
                    <span>${d}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      ${experiences.length > 3 ? `
        <div class="show-more-wrap">
          <button id="show-more-exp" class="show-more-btn">
            Show All ${experiences.length} Roles ▾
          </button>
        </div>
      ` : ''}
    </div>
  </section>
`;

const renderTestimonials = () => `
  <section class="section section-dark" id="testimonials" aria-label="Testimonials">
    <div class="container">
      <div class="reveal">
        <div class="section-tag"><span>Social Proof</span></div>
        <h2 class="section-title">What People <span class="text-red">Say</span></h2>
        <p class="section-subtitle">Recommendations from colleagues and leaders I've had the honour to work with. <span class="endorsement-badge"><span class="endorsement-badge-num">${testimonials.length}</span> LinkedIn Recommendations</span></p>
      </div>



      <div class="testimonials-grid">
        ${testimonials.map((t, i) => `
          <div class="reveal test-card ${i >= 4 ? 'test-card-hidden' : ''}">
            <div class="test-quote-icon">❝</div>
            <div class="test-text clamped">"${t.text}"</div>
            <button class="read-more-btn">READ MORE ▸</button>
            <div class="test-footer">
              <div class="test-name">${t.name}</div>
              <div class="test-role">${t.role}${t.company ? ` — ${t.company}` : ''}</div>
              <div class="test-relation">${t.relation}</div>
            </div>
          </div>
        `).join('')}
      </div>

      ${testimonials.length > 4 ? `
        <div class="show-more-wrap" style="margin-top:24px;">
          <button id="show-more-test" class="show-more-btn">
            Show All ${testimonials.length} Testimonials ▾
          </button>
        </div>
      ` : ''}
    </div>
  </section>
`;

const renderFooter = () => `
  <footer class="footer" id="contact" role="contentinfo">
    <div class="container">
      <div class="footer-links">
          <a href="/andrea-spiteri-cv.pdf" download><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download CV</a>
          <a href="mailto:andrealispider@gmail.com"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> Email</a>
          <a href="https://www.linkedin.com/in/andrea-spiteri/" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn</a>
        </div>
      <p class="footer-copy">© ${new Date().getFullYear()} Andrea Spiteri — All rights reserved</p>
    </div>
  </footer>
`;

// ============ MOUNT ============

const renderModal = () => `
  <div class="modal-overlay" id="achiev-modal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeAchievModal()">&times;</button>
      <div class="modal-value" id="modal-value"></div>
      <div class="modal-label" id="modal-label"></div>
      <div class="modal-story" id="modal-story"></div>
    </div>
  </div>
`;

const renderApp = () => {
  const app = document.querySelector('#app');
  app.innerHTML = `
    ${renderHero()}
    ${renderAbout()}
    ${renderAchievements()}
    ${renderExperience()}
    ${renderTestimonials()}
    ${renderOffTrack()}
    ${renderFooter()}
    ${renderModal()}
  `;

  initParticles();
  window.observeReveals();
  initInteractions();
  initCountUp();
  initHeroTestimonials();
};


// Modal functions
window.openAchievModal = (card) => {
  const label = card.dataset.label;
  const valueEl = card.querySelector('.achiev-value');
  const value = valueEl ? valueEl.textContent : '';
  const story = achievementStories[label] || 'Story coming soon...';
  
  document.getElementById('modal-value').textContent = value;
  document.getElementById('modal-label').textContent = label;
  document.getElementById('modal-story').textContent = story;
  document.getElementById('achiev-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeAchievModal = () => {
  document.getElementById('achiev-modal').classList.remove('active');
  document.body.style.overflow = '';
};

// Close modal on overlay click or Escape
document.addEventListener('click', (e) => {
  if (e.target.id === 'achiev-modal') closeAchievModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAchievModal();
});

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initReveal();
  renderApp();
});
