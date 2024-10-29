import { Button } from "@/components/ui/button";
import { UserCombinedProfile } from "@/types/return_types";
import { Briefcase, Award, ThumbsUp } from "lucide-react";
import { useState } from "react";
import EndorseDialog from "../dialog/EndorseDialog";

export function EmptyEndorsementsFeedComponent({
  userProfileData,
}: {
  userProfileData: { profile: UserCombinedProfile } | undefined;
}) {
  const [endorseDialogOpen, setEndorseDialogOpen] = useState(false);
  return (
    <div className='flex flex-col items-center justify-center h-[60vh] bg-white rounded-lg p-8 text-center'>
      <div className='relative mb-6'>
        <Briefcase className='text-blue-600 w-24 h-24' />
        <Award className='text-blue-600 w-12 h-12 absolute -bottom-2 -right-2 animate-bounce' />
        <ThumbsUp className='text-blue-600 w-12 h-12 absolute -top-2 -left-2 animate-pulse' />
      </div>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>
        No Endorsements Yet
      </h2>
      <p className='text-gray-600 mb-6 max-w-md'>
        {userProfileData?.profile?.name} hasn't received any endorsements yet.
        If you've worked with them, consider being the first to endorse their
        skills!
      </p>
      <Button
        onClick={() => setEndorseDialogOpen(true)}
        className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105'
      >
        Endorse Skills
      </Button>
      <p className='text-sm text-gray-500 mt-4'>
        Your endorsement helps build their professional credibility and supports
        their job search.
      </p>
      {endorseDialogOpen && userProfileData?.profile && (
        <EndorseDialog
          isOpen={endorseDialogOpen}
          onClose={() => setEndorseDialogOpen(false)}
          user={userProfileData?.profile as UserCombinedProfile}
        />
      )}
    </div>
  );
}
