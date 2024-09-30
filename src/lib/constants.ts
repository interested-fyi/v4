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
