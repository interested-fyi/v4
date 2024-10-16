export interface User {
  object: string;
  user: {
    object: string;
    fid: number;
    custody_address: string;
    username: string;
    display_name: string;
    pfp_url: string;
    profile: {
      bio: {
        text: string;
      };
    };
    follower_count: number;
    following_count: number;
    verifications: any[];
    verified_addresses: {
      eth_addresses: any[];
      sol_addresses: any[];
    };
    active_status: string;
    power_badge: boolean;
    viewer_context: {
      following: boolean;
      followed_by: boolean;
    };
  };
}

export const users = [
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
];

export const jobPositions = [
  {
    "Developer Support": [
      "Support Engineer",
      "Technical Writer",
      "Technical Trainer",
      "UX Content Designer",
      "Developer Ralations Manager",
      "Consultant",
      "Standards Architect",
    ],
  },
  {
    "Software Development": [
      "Security Auditor",
      "Embedded Software Engineer",
      "Mobile Developer",
      "Back End Engineer",
      "Front End Engineer",
      "Full Stack Engineer",
      "Blockchain Engineer",
      "Protocol Engineer",
      "DevOps Engineer",
      "Security Engineer",
      "Infrastructure Engineer",
      "Machine Learning Developer",
      "Quality Assurance Engineer",
      "User Interface Engineer",
      "Scrum Master/Dev Project Manager",
      "Technical Program Manager",
      "Technical Business Analyst",
      "Technical Architect/Sales Engineer",
    ],
  },
  {
    Research: [
      "Qualitative/Quantitative Researcher",
      "Crypto/Data Science Researcher",
    ],
  },

  {
    Executive: [
      "CEO",
      "CFO",
      "Chief Counsel",
      "People Head",
      "Lead Managing Director",
      "Head Managing Director",
      "Lead Professional Services",
      "Head Professional Services",
      "Lead Regional Director",
      "Head Regional Director",
      "Lead Strategic Initiatives Director",
      "Chief Strategy Officer",
      "COO",
      "CTO",
      "Head",
      "Co-Head",
    ],
  },
  {
    Finance: [
      "Accountant",
      "Controller",
      "Financial Analyst",
      "Corporate Development Manager",
    ],
  },
  {
    "Business Support": [
      "Executive Assistant",
      "Admiintstrative Assistant",
      "Technical Scribe",
      "Office Manager",
      "Travel Specialist",
      "Business Project Manager",
      "Business Operations Manager",
    ],
  },
  {
    Labs: [
      "Venture Fund Business Associate",
      "Venture Fund Platform Director",
      "Venture Fund Portfolio Manager",
      "Venture Fund Partner",
      "Accelerator Business Associate",
      "Accelerator Program Manager",
      "Accelerator Program Director",
      "Accelerator Director",
      "Business Operations & Strategy",
    ],
  },
  {
    Legal: [
      "Legal Counsel",
      "Legal Assistant",
      "Contract Administrator",
      "Corporate Compliance Analyst",
      "Paralegal",
      "Goverment Affairs Specialist",
    ],
  },
  {
    Product: [
      "Product Designer",
      "Design Researcher",
      "Design Strategist",
      "Design Operations Analyst",
      "Instructional Designer",
      "Product Manager/Owner",
      "Product Marketer/Strategist",
    ],
  },
  {
    Marketing: [
      "Social Marketer",
      "Brand Marketer",
      "Communications Specialist",
      "Community Builder",
      "Public Relations Specialist",
      "Content Specialist",
      "Growth Marketer",
      "Email Marketer",
      "Events Specialist",
      "Video Producer",
      "General Marketer",
      "SEO Specialist",
      "Editor",
      "Graphic Designer",
      "Video Editor",
      "Web Designer",
    ],
  },
  {
    People: [
      "People Partner",
      "Total Rewards Analyst",
      "Talent & Performance Specialist",
      "People Service Delivery Specialist",
      "HRIS Analyst",
      "Talent Acquisition Specialist",
      "Payroll Specialist",
      "Recruiting Coordinator",
      "HR Business Operations/Project Manager",
    ],
  },
  {
    "Business Development": [
      "Business Developer",
      "Solutions Sales & Business Developer",
      "Account Manager",
      "Strategic Partnerships Manager",
      "Customer Success Manager",
    ],
  },
  {
    IT: [
      "Helpdesk Analyst",
      "Information Systems/Security Analyst",
      "Systems Administrator",
    ],
  },
];
