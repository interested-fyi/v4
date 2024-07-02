import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";

export default function CandidateSignUpForm() {
  const { ready, authenticated, login, user } = usePrivy();

  return (
    <div className='flex flex-col justify-center items-center gap-8'>
      {!authenticated ? (
        <div className='flex flex-col items-center gap-4'>
          <p className='text-xl font-bold'>Connect your Farcaster</p>

          <button
            onClick={login}
            className='flex items-center gap-4 bg-[#8A63D2] px-4 py-2 rounded-xl w-max'
          >
            <Image
              className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
              src='/fc-logo-transparent-white.png'
              alt='Farcaster Logo'
              width={40}
              height={50}
              priority
            />
            <p className='text-white font-bold text-xl'>Connect</p>
          </button>
        </div>
      ) : (
        /* Check if user has accepted DCs and ask for permission
                   TODO - implement functionality to check this. Need to research
                */
        <>
          <div>
            <label className='flex gap-2 items-center'>
              <input
                type='checkbox'
                className='appearance-none w-[2em] h-[2em] rounded-md border-black border-2'
              />
              <p className='text-xl font-bold'>Accept Direct Casts</p>
            </label>
          </div>
          {/* Check if user follows interested.fyi and prompt if not */}
          <div className='flex flex-col gap-2 items-center'>
            <p className='text-lg font-bold'>
              Follow{" "}
              <a
                className='text-blue-500'
                href='https://warpcast.com/interestedfyi'
                target='_blank'
              >
                @interestedfyi
              </a>{" "}
              on Farcaster
            </p>
            <button className='flex items-center gap-4 bg-[#8A63D2] px-4 py-2 rounded-xl w-max'>
              <Image
                className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
                src='/fc-logo-transparent-white.png'
                alt='Farcaster Logo'
                width={40}
                height={50}
                priority
              />
              <p className='text-xl font-bold text-white'>Follow</p>
            </button>
          </div>
          <button className='px-4 py-4 rounded-xl w-max bg-[#2640EB] text-white font-bold text-2xl'>
            <p>Create Profile</p>
          </button>
        </>
      )}
    </div>
  );
}
