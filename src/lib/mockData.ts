export const MOCK_COMPANY_DATA = {
  id: "1",
  name: "Optimism",
  logo: "/src.jpg",
  description:
    "Optimism is a decentralized layer 2 scaling solution for Ethereum, which reduces transaction costs and latency and provides a better user experience.",
};

export const MOCK_JOB_DATA = [
  {
    id: "1",
    position: "Product Designer",
    compensation: "$75-100k",
    location: "Remote",
    commitment: "Full-time",
    manager: {
      name: "John Doe",
      title: "Design Manager",
      bio: "Experienced product designer with a passion for creating intuitive user experiences.",
      twitter: "@johndoe",
      linkedin: "linkedin.com/in/johndoe",
      imgSrc: "/src.png",
    },
    teammates: [
      {
        name: "Jane Smith",
        title: "Senior Product Designer",
        bio: "Creative and detail-oriented designer with expertise in user-centered design.",
        twitter: "@janesmith",
        linkedin: "linkedin.com/in/janesmith",
        imgSrc: "/src.png",
      },
      {
        name: "Alex Johnson",
        title: "Junior Product Designer",
        bio: "Eager to learn and contribute to the design team with a fresh perspective.",
        twitter: "@alexjohnson",
        linkedin: "linkedin.com/in/alexjohnson",
        imgSrc: "/src.png",
      },
    ],
    posted: "2 days ago",
  },
  {
    id: "2",
    position: "Software Engineer",
    compensation: "$90-120k",
    location: "San Francisco, CA",
    commitment: "Full-time",
    manager: {
      name: "Sarah Williams",
      title: "Engineering Manager",
      bio: "Experienced software engineer with a passion for building scalable and reliable systems.",
      twitter: "@sarahwilliams",
      linkedin: "linkedin.com/in/sarahwilliams",
      imgSrc: "/src.png",
    },
    teammates: [
      {
        name: "Michael Johnson",
        title: "Senior Software Engineer",
        bio: "Full-stack developer with expertise in JavaScript and React.",
        twitter: "@michaeljohnson",
        linkedin: "linkedin.com/in/michaeljohnson",
        imgSrc: "/src.png",
      },
      {
        name: "Emily Davis",
        title: "Junior Software Engineer",
        bio: "Passionate about coding and eager to learn new technologies.",
        twitter: "@emilydavis",
        linkedin: "linkedin.com/in/emilydavis",
        imgSrc: "/src.png",
      },
    ],
    posted: "1 day ago",
  },
  // ... rest of the job data
];
