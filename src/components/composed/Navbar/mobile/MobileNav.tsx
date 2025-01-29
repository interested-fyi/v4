"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Banknote, Compass, User, Sword } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

const navItems = [
  { name: "Talent", href: "/explore-talent", icon: Users },
  { name: "Salary Quiz", href: "/salary-quiz", icon: Banknote },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Quest", href: "/quest", icon: Sword },
  { name: "Profile", href: "/profile", icon: User },
];

export default function MobileNavbar() {
  const pathname = usePathname();
  const { user } = usePrivy();

  return (
    <nav className='md:hidden fixed z-50 bottom-4 left-4 right-4'>
      <div className='bg-[#F5F5FF] rounded-2xl shadow-lg border border-gray-200'>
        <ul className='flex justify-around items-center h-16'>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name} className='max-w-12 text-nowrap'>
                <Link
                  href={
                    item.href === "/profile" && user?.id
                      ? `/profile/${user.id.replace("did:privy:", "")}`
                      : item.href
                  }
                  className={`flex flex-col items-center p-2 transition-colors ${
                    isActive
                      ? "text-[#4339F2]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`w-6 h-6 ${
                      isActive ? "stroke-[#4339F2]" : "stroke-gray-600"
                    }`}
                  />
                  <span className='text-xs mt-1 font-medium'>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
