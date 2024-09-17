import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";

export default function NavBar() {
  const { user, logout } = usePrivy();

  return (
    <div className='flex items-center w-[100vw]'>
      <div className='flex-1'></div>
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:content-[''] before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
          src='/images/Interested-logo.png'
          alt='Interested Logo'
          width={240}
          height={50}
          priority
        />
      </div>
      <div className='flex-1 flex justify-end pr-4'>
        {user && (
          <button
            onClick={logout}
            className='rounded-lg p-2 bg-[#8A63D2] text-lg text-white font-bold'
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
