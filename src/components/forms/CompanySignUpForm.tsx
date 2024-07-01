import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";

export default function CompanySignUpForm() {
    const {ready, authenticated, login, user} = usePrivy();

    return (
        <div className="flex flex-col justify-center items-center gap-8">
            <div className="flex flex-col items-center gap-4">
                <p className="text-xl font-bold">Connect your Farcaster</p>
                {
                    authenticated ? 
                    <div className="flex items-center gap-2">
                        <Image 
                            className="rounded-full"
                            src={user?.farcaster?.pfp!}
                            alt={`Profile Picture for ${user?.farcaster?.username}`}
                            width={40}
                            height={40}
                            />
                        <p>{user?.farcaster?.displayName}</p>
                    </div>
                    :
                    <button 
                        onClick={login}
                        className="flex items-center gap-4 bg-[#8A63D2] px-4 py-2 rounded-xl w-max"
                    >
                        <Image
                                className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                                src="/fc-logo-transparent-white.png"
                                alt="Farcaster Logo"
                                width={40}
                                height={50}
                                priority
                            />
                        <p className="text-white font-bold text-xl">Connect</p>                  
                    </button>
                }
            </div>
            <div className="flex flex-col gap-2 items-center">
                <p className="text-xl font-bold">Company Name</p>
                <input type="text" className="text-xl rounded-xl border-2 border-black px-2 py-1" />
            </div>
            <div className="flex flex-col gap-2 items-center">
                <p className="text-xl font-bold">Company Careers Page (url)</p>
                <input type="url" className="text-xl rounded-xl border-2 border-black px-2 py-1" />
            </div>
            <button className="px-4 py-4 rounded-xl w-max bg-[#2640EB] text-white font-bold text-2xl">
                <p>Create Company Profile</p>
            </button>
        </div>
    )
}