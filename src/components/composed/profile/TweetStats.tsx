import { MessageCircle, Repeat2, Heart, Bookmark } from "lucide-react";

interface TweetStatsProps {
  likeCount: number;
  retweetCount: number;
  bookmarkCount: number;
  commentCount: number;
}

export default function TweetStats({
  likeCount,
  retweetCount,
  bookmarkCount,
  commentCount,
}: TweetStatsProps) {
  return (
    <div className='flex justify-between items-center max-w-full w-full mx-auto px-6 pt-3 bg-white'>
      <StatButton
        icon={<MessageCircle className='w-5 h-5' />}
        count={commentCount}
        label='Comments'
      />
      <StatButton
        icon={<Repeat2 className='w-5 h-5' />}
        count={retweetCount}
        label='Retweets'
      />
      <StatButton
        icon={<Heart className='w-5 h-5' />}
        count={likeCount}
        label='Likes'
      />
      <StatButton
        icon={<Bookmark className='w-5 h-5' />}
        count={bookmarkCount}
        label='Bookmarks'
      />
    </div>
  );
}

interface StatButtonProps {
  icon: React.ReactNode;
  count: number;
  label: string;
}

function StatButton({ icon, count, label }: StatButtonProps) {
  return (
    <div
      className='flex items-center space-x-2 px-2'
      aria-label={`${count} ${label}`}
    >
      {icon}
      <span className='text-sm text-gray-500'>{count}</span>
    </div>
  );
}
