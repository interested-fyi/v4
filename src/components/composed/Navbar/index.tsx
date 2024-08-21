import Image from "next/image";
import React from "react";
import { AspectRatio } from "../../ui/aspect-ratio";
import AuthControlledNav from "./AuthControlledNav";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className='flex relative justify-between w-full items-center px-2 sm:px-5 max-h-20'>
      <Link className='w-32 md:w-[165px]' href='/'>
        <AspectRatio ratio={16 / 3}>
          <Image
            width={165}
            height={28}
            src='/images/main-logo.png'
            alt='Interested Logo'
          />
        </AspectRatio>
      </Link>
      <nav
        className='flex justify-between gap-3 items-center h-16  text-black relative'
        role='navigation'
      >
        <AuthControlledNav />
      </nav>
    </header>
  );
};

export default Navbar;
