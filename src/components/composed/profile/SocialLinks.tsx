import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SocialLinks({
  connectedSocials,
}: {
  connectedSocials: {
    platform: string;
    url: string | null;
    image: string;
    alt: string;
  }[];
}) {
  return (
    <div className='flex justify-start max-w-[343px] mx-auto gap-4 mt-8'>
      {connectedSocials.length > 0
        ? connectedSocials.map((social, index) => (
            <Link key={index} target={"_blank"} href={social.url || "#"}>
              <Button className='bg-[#919cf4] bg-opacity-30 hover:bg-opacity-90 hover:bg-[#919cf4] w-[55px] h-8'>
                <Image
                  src={social.image}
                  alt={social.alt}
                  height={16}
                  width={16}
                />
              </Button>
            </Link>
          ))
        : null}
    </div>
  );
}
