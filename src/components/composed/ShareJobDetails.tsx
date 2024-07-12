import { MailIcon } from "lucide-react";
import { ShareButton } from "./buttons/ShareButton";

export interface ShareJobDetailsProps {
  title: string;
}
export const ShareJobDetails: React.FC<ShareJobDetailsProps> = ({ title }) => {
  return (
    <div className='w-full h-full max-h-[173px] flex-col justify-start items-start gap-2 inline-flex'>
      <div className='text-center uppercase text-indigo-400 text-sm font-medium font-body leading-[21px]'>
        {title}
      </div>
      {/* share buttons for twitter facebook linkedin and email */}
      <div className='flex gap-4 md:flex-row flex-col'>
        <div className='flex gap-4'>
          <ShareButton
            className='w-6 h-6  justify-center'
            icon={
              <svg
                role='img'
                fill='#2640EB'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <title>X</title>
                <path d='M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z' />
              </svg>
            }
          />
          <ShareButton
            className='w-6 h-6'
            icon={
              <svg
                role='img'
                fill='#2640EB'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <title>Facebook</title>
                <path d='M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z' />
              </svg>
            }
          />
        </div>
        <div className='flex gap-4 items-center'>
          <ShareButton
            className='w-6 h-6  justify-center'
            icon={
              <svg
                role='img'
                fill='#2640EB'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                xmlns='http://www.w3.org/2000/svg'
              >
                <title>LinkedIn</title>
                <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
              </svg>
            }
          />
          <ShareButton
            className='w-10 h-6  justify-center'
            icon={
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='#2640EB'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='white'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};
