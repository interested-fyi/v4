import { Sparkles, MessageCircle } from "lucide-react";

export function EmptyActivityFeedComponent() {
  return (
    <div className='flex flex-col items-center justify-center h-[60vh] bg-white rounded-lg p-8 text-center'>
      <div className='relative mb-6'>
        <Sparkles className='text-blue-600 w-24 h-24 animate-pulse' />
        <MessageCircle className='text-blue-600 w-12 h-12 absolute -bottom-2 -right-2 animate-bounce' />
      </div>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>No Activity Yet</h2>
      <p className='text-gray-600 mb-6 max-w-md'>
        It looks like there isn't anything posted yet
      </p>
    </div>
  );
}
