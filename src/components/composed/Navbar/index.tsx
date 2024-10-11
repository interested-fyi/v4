import Image from "next/image";
import React from "react";
import { AspectRatio } from "../../ui/aspect-ratio";
import AuthControlledNav from "./AuthControlledNav";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className='flex justify-between py-6 gap-6 px-2 sm:px-4'>
      <Link className='m-auto md:m-0 w-32 md:w-[165px]' href='/'>
        <AspectRatio ratio={16 / 3}>
          <Image
            width={37.5}
            height={32}
            src='/svg/small-binocular.svg'
            alt='Interested Logo'
          />
        </AspectRatio>
      </Link>
      <nav className='m-auto md:m-0 text-black relative' role='navigation'>
        <AuthControlledNav />
      </nav>
    </header>
  );
};

export default Navbar;
