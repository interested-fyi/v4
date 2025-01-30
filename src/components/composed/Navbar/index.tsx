"use client";

import Image from "next/image";
import React from "react";
import { AspectRatio } from "../../ui/aspect-ratio";
import AuthControlledNav from "./AuthControlledNav";
import Link from "next/link";
import MobileNavbar from "./mobile/MobileNav";

const Navbar = () => {
  return (
    <header className='flex items-center justify-between py-6 gap-6 px-2 sm:px-4'>
      <Link className='mr-auto md:m-0 w-40 md:w-[165px]' href='/'>
        <AspectRatio ratio={16 / 3}>
          <Image
            width={37.5}
            height={32}
            src='/svg/small-binocular.svg'
            alt='Interested Logo'
          />
        </AspectRatio>
      </Link>
      <nav className=' md:m-0 text-black relative' role='navigation'>
        <AuthControlledNav />
      </nav>
      <MobileNavbar />
    </header>
  );
};

export default Navbar;
