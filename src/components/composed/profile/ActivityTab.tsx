import { UserCombinedProfile } from "@/types/return_types";
import { SOCIALFEED } from "@/types/feeds";
import WarpcastActivityTab from "./WarpcastActivityTab";
import GithubActivityTab from "./GithubActivityTab";
import TwitterActivityTab from "./TwitterActivityTab";

export default function ActivityTab({
  userProfileData,
  activeFeed,
}: {
  userProfileData:
    | { success: boolean; profile: UserCombinedProfile }
    | undefined;
  activeFeed: SOCIALFEED;
}) {
  return (
    <div className='flex flex-col gap-4'>
      {activeFeed === SOCIALFEED.GITHUB && (
        <GithubActivityTab userProfileData={userProfileData} />
      )}
      {activeFeed === SOCIALFEED.FARCASTER && (
        <WarpcastActivityTab userProfileData={userProfileData} />
      )}
      {activeFeed === SOCIALFEED.X && (
        <TwitterActivityTab userProfileData={userProfileData} />
      )}
    </div>
  );
}
