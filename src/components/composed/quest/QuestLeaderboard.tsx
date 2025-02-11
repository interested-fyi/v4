import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry {
  name: string;
  photoSource: string;
  totalPoints: number;
  privyDid: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div className='w-full max-w-2xl bg-white rounded-xl shadow-sm overflow-hidden'>
      <div className='bg-[#4052F6] text-white p-4'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <Trophy className='h-6 w-6' />
          Top 10 Leaderboard
        </h2>
      </div>
      <div className='divide-y divide-gray-100'>
        {entries?.map((entry, idx) => (
          <Link
            href={`/profile/${entry.privyDid.replace("did:privy:", "")}`}
            key={entry.privyDid}
            className='flex items-center justify-between p-4'
          >
            <div className='flex items-center gap-4'>
              <span
                className={`text-lg font-bold ${
                  idx <= 3 ? "text-[#4339F2]" : "text-gray-500"
                }`}
              >
                #{idx + 1}
              </span>
              <Avatar>
                <AvatarFallback>{entry.name[0] + entry.name[1]}</AvatarFallback>
                <AvatarImage src={entry.photoSource} alt={entry.name} />
              </Avatar>
              <span className='font-medium'>{entry.name}</span>
            </div>
            <span className='text-sm font-medium text-[#4339F2]'>
              {entry.totalPoints.toLocaleString()} pts
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
