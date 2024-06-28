import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24"> 
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/Interested-logo.png"
          alt="Interested Logo"
          width={240}
          height={50}
          priority
        />
      </div>
      <div className="rounded-lg shadow-lg bg-[#2640EB] mt-8 py-8 px-16 flex flex-col items-center justify-center">
        <h2 className="text-white text-2xl font-extrabold">Looking for us?</h2>
        <div className="text-white text-xl">We&apos;re revamping. Check back soon!</div>
      </div>
    </main>
  );
}
