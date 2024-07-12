"use client";
import { usePathname } from "next/navigation";
import { ShareButton } from "./buttons/ShareButton";
import { usePrivy } from "@privy-io/react-auth";
import { LinkIcon } from "lucide-react";

export interface ShareJobDetailsProps {
  title: string;
}

export const ShareJobDetails: React.FC<ShareJobDetailsProps> = ({ title }) => {
  const { user } = usePrivy();
  const pathName = usePathname();

  const pathNameURLEncoded = encodeURIComponent(
    "https://interested.fyi" + pathName + "?referral=" + user?.farcaster?.fid
  );
  const shareText =
    "i+found+this+job+on+%40interestedFYI+and+wanted+to+share+it!+Nominate+me+or+apply+for+the+role+if+you+think+you+would+be+a+good+fit!";
  return (
    <>
      <div className='w-full h-full max-h-[173px] flex-col justify-start items-start gap-2 inline-flex'>
        <div className='text-center uppercase text-indigo-400 text-sm font-medium font-body leading-[21px]'>
          {title}
        </div>
        {/* share buttons for twitter facebook linkedin and email */}

        <div className='flex gap-4 md:flex-row flex-col'>
          <div className='flex gap-4'>
            <a
              href={`https://twitter.com/intent/tweet?post?original_referer=https%3A%2F%2Finterested.fyi%2F&related=twitterapi%2Ctwitter&text=i+found+this+job+on+%40interestedFYI+and+wanted+to+share+it!+Nominate+me+or+apply+for+the+role+if+you+think+you+would+be+a+good+fit!&url=${pathNameURLEncoded}&via=interestedfyi`}
              target='_blank'
            >
              <ShareButton
                className='w-6 h-6  justify-center'
                icon={
                  <svg
                    role='img'
                    fill='#000000'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <title>X</title>
                    <path d='M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z' />
                  </svg>
                }
              />
            </a>
            <a
              href={`https://warpcast.com/~/compose?text=${shareText}&embeds%5B%5D=${pathNameURLEncoded}`}
              target='_blank'
            >
              <ShareButton
                className='w-6 h-6'
                icon={
                  <svg
                    width='32'
                    height='32'
                    viewBox='0 0 1260 1260'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <g clip-path='url(#clip0_1_2)'>
                      <path
                        d='M947.747 1259.61H311.861C139.901 1259.61 0 1119.72 0 947.752V311.871C0 139.907 139.901 0.00541362 311.861 0.00541362H947.747C1119.71 0.00541362 1259.61 139.907 1259.61 311.871V947.752C1259.61 1119.72 1119.71 1259.61 947.747 1259.61Z'
                        fill='#472A91'
                      ></path>
                      <path
                        d='M826.513 398.633L764.404 631.889L702.093 398.633H558.697L495.789 633.607L433.087 398.633H269.764L421.528 914.36H562.431L629.807 674.876L697.181 914.36H838.388L989.819 398.633H826.513Z'
                        fill='white'
                      ></path>
                    </g>
                    <defs>
                      <clipPath id='clip0_1_2'>
                        <rect
                          width='1259.61'
                          height='1259.61'
                          fill='white'
                        ></rect>
                      </clipPath>
                    </defs>
                  </svg>
                }
              />
            </a>
          </div>
          <div className='flex gap-4 items-center'>
            <a
              href={`mailto:?subject=Check out this job on Interested.fyi&body=I found this job on Interested.fyi and wanted to share it! Nominate me or apply for the role if you think you would be a good fit!%0D%0A%0D%0Ahttp://localhost:3000${pathName}?referral=${user?.farcaster?.fid}`}
            >
              <ShareButton
                className='w-8 h-6  justify-center'
                icon={
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    stroke='#2640EB'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    fill='white'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
                    />
                  </svg>
                }
              />
            </a>{" "}
            <ShareButton
              className='w-6 h-6  justify-center'
              icon={<LinkIcon stroke='#444444' />}
              onClick={() => {
                navigator.clipboard.writeText(
                  `http://localhost:3000${pathName}?referral=${user?.farcaster?.fid}`
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
