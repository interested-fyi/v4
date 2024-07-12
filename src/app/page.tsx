import { SignupForms } from "./../components/composed/SignupForms";
import Image from "next/image";

export default function Home() {
  return (
    <main className='flex  min-h-screen flex-col gap-8 items-center justify-start '>
      <section className='w-full max-w-full bg-[#2640EB] py-24 sm:p-8 p-2 md:p-24'>
        <div className='flex relative md:flex-row flex-col w-full'>
          <div className='flex flex-col gap-8 relative z-10'>
            <div className='flex flex-col gap-0 md:gap-4 text-nowrap'>
              <h1 className='font-heading text-3xl md:text-6xl font-bold text-[#919CF4] h-[60px]'>
                LET&apos;S FIND THE CRYPTO
              </h1>
              <h1 className='font-heading text-6xl md:text-8xl font-bold text-[#ffffff] h-24'>
                COMPANY
              </h1>
              <h1 className='font-heading text-3xl md:text-6xl font-bold text-[#919CF4] h-[60px]'>
                THAT INTERESTS
              </h1>
              <h1 className='font-heading text-6xl md:text-8xl font-bold text-[#ffffff] h-24'>
                YOU .
              </h1>
            </div>
            {/* <p className='text-[16px]  font-body text-[#ffffff] max-w-[548px]'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p> */}
          </div>

          <div className='absolute right-0 md:right-10 top-0 h-full w-[50vw] z-[0] flex place-items-center'>
            <div className='relative h-full w-full'>
              <Image
                className='dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
                src='/illustration.svg'
                alt='Interested illustration'
                sizes='50vw'
                fill
                priority
              />
            </div>
          </div>
        </div>
        <SignupForms />
      </section>
    </main>
  );
}
