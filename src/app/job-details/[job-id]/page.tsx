"use client";
import { JobDetails } from "@/components/composed/JobDetails";
import { ShareJobDetails } from "@/components/composed/ShareJobDetails";
import { InfoCard } from "@/components/composed/InfoCard";
import { ListCard } from "@/components/composed/ListCard";
import { InterestedButton } from "@/components/composed/buttons/InterestedButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Job } from "@/components/composed/jobs/JobRow";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobDetailsPage() {
  const searchParams = useSearchParams();

  const [jobDetails, setJobDetails] = useState<
    | {
        id: string;
        position: string;
        compensation: string;
        location: string;
        commitment: string;
        manager: {
          name: string;
          title: string;
          bio: string;
          twitter: string;
          linkedin: string;
          imgSrc: string;
        };
        teammates: [];
        posted: string;
        company: string;
      }
    | undefined
  >();

  useEffect(() => {
    const jobId = searchParams.get("job-id");
    const position = searchParams.get("position");
    console.log("🚀 ~ useEffect ~ position:", position);
    const compensation = searchParams.get("compensation");
    const location = searchParams.get("location");
    const commitment = searchParams.get("commitment");
    const managerName = searchParams.get("managerName");
    const managerTitle = searchParams.get("managerTitle");
    const managerBio = searchParams.get("managerBio");
    const managerTwitter = searchParams.get("managerTwitter");
    const managerLinkedin = searchParams.get("managerLinkedin");
    const managerImgSrc = searchParams.get("managerImgSrc");
    const posted = searchParams.get("posted");
    const company = searchParams.get("company");

    setJobDetails({
      id: jobId as string,
      position: position as string,
      compensation: compensation as string,
      location: location as string,
      commitment: commitment as string,
      manager: {
        name: managerName as string,
        title: managerTitle as string,
        bio: managerBio as string,
        twitter: managerTwitter as string,
        linkedin: managerLinkedin as string,
        imgSrc: managerImgSrc as string,
      },
      teammates: [],
      posted: posted as string,
      company: company as string,
    });
  }, [searchParams]);

  if (!jobDetails?.position) {
    // Skeleton loading state
    return (
      <div className='flex flex-col w-full'>
        <div className='relative w-full h-[276px] text-center bg-blue-overlay bg-contain bg-[#3720ca] bg-opacity-80 bg-center bg-repeat px-4'>
          <div className='w-full max-w-[1200px] mx-auto h-[276px] flex-col justify-center items-start gap-8 inline-flex'>
            <Skeleton className='w-full h-10 mb-4' />
            <Skeleton className='w-1/2 h-8' />
            <div className='flex items-center gap-4 mt-4'>
              <Skeleton className='w-10 h-10 rounded-full' />
              <Skeleton className='w-40 h-8' />
            </div>
          </div>
        </div>
        <div className='w-full bg-[#E7FB6C] h-full min-h-[137px] px-4'>
          <div className='w-full max-w-[1200px] h-full mx-auto min-h-[137px] py-8 lg:gap-0 gap-8 justify-between items-center  flex lg:flex-row flex-col'>
            <Skeleton className='w-1/3 h-10' />
            <Skeleton className='w-1/3 h-10' />
            <Skeleton className='w-1/3 h-10' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full'>
      {/* header */}
      <div className='relative w-full h-[276px] text-center bg-blue-overlay bg-contain bg-[#3720ca] bg-opacity-80 bg-center bg-repeat px-4'>
        <div className='w-full max-w-[1200px] mx-auto h-[276px] flex-col justify-center items-start gap-8 inline-flex'>
          <div className='text-center'>
            <span className='text-[#E7FB6C] text-base font-bold font-heading leading-normal'>
              Companies
            </span>
            <span className='text-white text-base font-bold font-heading leading-normal'>
              {" "}
              /{" "}
            </span>
            <span className='text-[#E7FB6C] text-base font-bold font-heading leading-normal'>
              {jobDetails?.company}
            </span>
            <span className='text-white text-base font-bold font-heading leading-normal'>
              {" "}
              /{" "}
            </span>
            <span className='text-white text-base font-normal font-heading leading-normal'>
              {jobDetails.position}
            </span>
          </div>
          <div className='w-full justify-between items-start gap-8 inline-flex'>
            <div className='grow shrink basis-0 flex-col justify-center items-start gap-2 inline-flex'>
              <div className='text-white text-3xl md:text-5xl font-bold font-heading md:leading-[72px] text-left'>
                {jobDetails.position}
              </div>
              <div className='justify-start items-center gap-4 inline-flex'>
                <Image
                  height={20}
                  width={20}
                  alt='company logo'
                  className='w-10 h-10 rounded-full'
                  src='https://via.placeholder.com/40x40'
                />
                <div className='max-w-[630px] w-full text-white text-lg font-bold font-body leading-normal'>
                  {jobDetails.company}
                </div>
              </div>
            </div>
            <Button className='pl-[19px] w-40 h-11 pr-5 py-2.5 bg-[#E7FB6C] place-self-start rounded-lg justify-center items-center gap-2 flex'>
              <Image
                height={20}
                width={20}
                alt='thumb icon'
                className='w-full max-w-[14.09px] h-4'
                src='/svg/thumb.svg'
              />
              <div className='text-blue-700 text-sm font-medium font-body leading-[21px]'>
                I&apos;m interested
              </div>
            </Button>
          </div>
        </div>
      </div>
      {/* banner */}
      <div className='w-full bg-[#E7FB6C] h-full min-h-[137px] px-4'>
        <div className='w-full max-w-[1200px] h-full mx-auto min-h-[137px] py-8 lg:gap-0 gap-8 justify-between items-center  flex lg:flex-row flex-col'>
          <div className='self-stretch justify-center items-center gap-8 inline-flex'>
            <div className='flex gap-8 '>
              <div className='h-12 w-9 place-self-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='37'
                  height='50'
                  viewBox='0 0 37 50'
                  fill='none'
                >
                  <g clipPath='url(#clip0_587_1752)'>
                    <path
                      d='M23.2829 0.497276C20.8923 0.478658 18.5726 1.43613 17.1528 3.43662C17.1509 3.43941 17.1491 3.4422 17.1473 3.44506C15.6864 5.66199 15.9449 8.78172 16.611 11.2744C16.8891 12.3148 17.5689 13.1223 18.2476 13.8943C18.9263 14.6663 19.6062 15.4072 19.9544 16.2778C20.1545 16.7784 20.3113 17.6513 20.4074 18.3836C20.5036 19.116 20.5441 19.7124 20.5441 19.7124C20.5486 19.7773 20.5771 19.8381 20.6238 19.8823C20.6705 19.9266 20.732 19.951 20.7957 19.9506H26.2118C26.2752 19.9505 26.3362 19.9259 26.3825 19.8817C26.4289 19.8375 26.4571 19.777 26.4615 19.7124C26.4615 19.7124 26.5022 19.116 26.5982 18.3836C26.6944 17.6513 26.853 16.7784 27.0531 16.2778C27.4013 15.4072 28.0794 14.6663 28.7581 13.8943C29.4368 13.1223 30.1184 12.3148 30.3965 11.2744C31.0621 8.78382 31.3637 5.63176 29.8565 3.43946C29.8502 3.43081 29.8434 3.42254 29.8362 3.41476C28.1338 1.51149 25.6734 0.515978 23.2829 0.497276ZM23.2966 1.02282C25.5414 1.04341 27.8565 1.97158 29.4544 3.7504C30.7991 5.72352 30.5582 8.72323 29.913 11.1374C29.6729 12.0357 29.0601 12.7862 28.3874 13.5513C27.7148 14.3164 26.9858 15.0925 26.59 16.0822C26.3499 16.6828 26.2021 17.5654 26.1037 18.3147C26.0226 18.9329 25.9999 19.2731 25.9872 19.4375H21.0222C21.0084 19.2732 20.9849 18.9329 20.9038 18.3147C20.8054 17.5654 20.6595 16.6828 20.4193 16.0822C20.0235 15.0925 19.2946 14.3164 18.6219 13.5513C17.9492 12.7862 17.3346 12.0357 17.0945 11.1374C16.4486 8.72054 16.2434 5.7387 17.5623 3.73336C18.8736 1.88927 21.0485 1.00217 23.2966 1.02282Z'
                      fill='#2640EB'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M20.5855 18.5292C20.0052 18.5292 19.538 19.0067 19.538 19.6V21.4129C19.538 22.0062 20.0052 22.4836 20.5855 22.4836H21.1388C21.1111 22.5683 21.0956 22.6589 21.0956 22.7532C21.0956 23.22 21.4629 23.5954 21.9196 23.5954H22.5214C22.5632 24.0215 22.9131 24.3521 23.3413 24.3521H23.6403C24.0685 24.3521 24.4185 24.0215 24.4603 23.5954H25.0616C25.5182 23.5954 25.886 23.22 25.886 22.7532C25.886 22.6589 25.8712 22.5682 25.8428 22.4836H26.4671C27.0475 22.4836 27.5146 22.0062 27.5146 21.4129V19.6C27.5146 19.0067 27.0475 18.5292 26.4671 18.5292H20.5855Z'
                      fill='#2640EB'
                    />
                    <path
                      d='M12.1527 0.240219C12.0953 0.206187 12.0271 0.196876 11.9629 0.214221C11.8988 0.231567 11.844 0.274171 11.8106 0.332759C11.7773 0.39142 11.7681 0.461232 11.7851 0.526794C11.802 0.592355 11.8438 0.648364 11.9011 0.68252L14.7839 2.38363C14.8413 2.41765 14.9095 2.42706 14.9737 2.40972C15.0378 2.39237 15.0926 2.34976 15.126 2.29118C15.1593 2.2325 15.1684 2.16271 15.1515 2.09714C15.1345 2.03158 15.0927 1.97555 15.0354 1.94142L12.1527 0.240219Z'
                      fill='#2640EB'
                    />
                    <path
                      d='M10.4328 5.90338C10.3999 5.9035 10.3674 5.9102 10.337 5.92318C10.3066 5.93616 10.2791 5.95518 10.2559 5.97905C10.2327 6.00292 10.2144 6.03125 10.2019 6.06238C10.1894 6.0935 10.1831 6.12679 10.1832 6.16043C10.1835 6.22804 10.2098 6.2928 10.2566 6.3406C10.3033 6.38841 10.3667 6.41544 10.4328 6.41567H13.7133C13.7795 6.41544 13.8428 6.38841 13.8896 6.3406C13.9364 6.2928 13.9627 6.22804 13.9629 6.16043C13.9631 6.12679 13.9567 6.0935 13.9443 6.06238C13.9318 6.03125 13.9134 6.00292 13.8902 5.97905C13.867 5.95518 13.8394 5.93616 13.8091 5.92318C13.7787 5.9102 13.7462 5.9035 13.7133 5.90338H10.4328Z'
                      fill='#2640EB'
                    />
                    <path
                      d='M13.8982 9.74431L10.4773 10.6819C10.4454 10.6905 10.4156 10.7055 10.3894 10.7259C10.3633 10.7464 10.3413 10.7719 10.3248 10.8011C10.3084 10.8302 10.2977 10.8624 10.2933 10.8958C10.289 10.9291 10.2912 10.9631 10.2997 10.9956C10.3082 11.0282 10.3229 11.0587 10.343 11.0854C10.363 11.1121 10.388 11.1346 10.4165 11.1514C10.445 11.1683 10.4765 11.1792 10.5091 11.1836C10.5418 11.188 10.5749 11.1858 10.6067 11.1771L14.0295 10.2395C14.0935 10.2216 14.1479 10.1785 14.1808 10.1197C14.2137 10.0609 14.2225 9.99119 14.2052 9.92577C14.1967 9.89324 14.1821 9.86272 14.1621 9.83599C14.1421 9.80925 14.1171 9.78681 14.0886 9.76996C14.0601 9.7531 14.0286 9.74217 13.9959 9.73776C13.9633 9.73336 13.9301 9.73559 13.8982 9.74431Z'
                      fill='#2640EB'
                    />
                    <path
                      d='M35.3524 0.0342409L31.6873 2.19668C31.63 2.23084 31.5883 2.28684 31.5713 2.35241C31.5543 2.41797 31.5635 2.48769 31.5968 2.54635C31.6132 2.57552 31.635 2.60107 31.6611 2.62159C31.6872 2.64212 31.717 2.65725 31.7488 2.66601C31.7805 2.67477 31.8136 2.67706 31.8463 2.67272C31.8789 2.66839 31.9104 2.65747 31.9389 2.6407L35.6021 0.478264C35.6306 0.461515 35.6557 0.439224 35.6758 0.412581C35.6959 0.385939 35.7106 0.35553 35.7192 0.323054C35.7278 0.290577 35.73 0.256644 35.7258 0.223282C35.7216 0.18992 35.711 0.157753 35.6945 0.128589C35.6782 0.0994174 35.6564 0.0738037 35.6303 0.0532655C35.6042 0.0327274 35.5744 0.0176216 35.5426 0.00884604C35.5109 7.05044e-05 35.4777 -0.0021925 35.4451 0.00213146C35.4125 0.00645542 35.3809 0.0174762 35.3524 0.0342409Z'
                      fill='#2640EB'
                    />
                    <path
                      d='M36.6726 5.06599L33.5808 5.9128C33.549 5.92146 33.5191 5.93641 33.493 5.95688C33.4668 5.97734 33.4448 6.00288 33.4284 6.03203C33.4119 6.06118 33.4012 6.09334 33.3969 6.12672C33.3926 6.1601 33.3947 6.19406 33.4033 6.22658C33.4117 6.25911 33.4264 6.28963 33.4465 6.31637C33.4665 6.3431 33.4915 6.36554 33.52 6.38239C33.5485 6.39925 33.58 6.41019 33.6126 6.41459C33.6453 6.41899 33.6784 6.41677 33.7102 6.40805L36.8021 5.56124C36.8339 5.55257 36.8638 5.53754 36.8899 5.51707C36.9161 5.49661 36.938 5.47107 36.9545 5.44192C36.971 5.41278 36.9817 5.38061 36.986 5.34723C36.9903 5.31385 36.9881 5.27997 36.9796 5.24746C36.9711 5.21492 36.9564 5.18441 36.9364 5.15767C36.9164 5.13094 36.8914 5.1085 36.8629 5.09165C36.8344 5.07479 36.8029 5.06385 36.7702 5.05945C36.7376 5.05505 36.7045 5.05727 36.6726 5.06599Z'
                      fill='#2640EB'
                    />
                    <path
                      d='M33.6457 9.96741C33.6127 9.96728 33.5801 9.97377 33.5497 9.98652C33.5192 9.99927 33.4915 10.018 33.4681 10.0417C33.4448 10.0654 33.4263 10.0936 33.4136 10.1246C33.4009 10.1556 33.3942 10.1889 33.3941 10.2226C33.394 10.2564 33.4005 10.2899 33.4131 10.3211C33.4256 10.3524 33.4442 10.3807 33.4675 10.4046C33.4909 10.4285 33.5187 10.4475 33.5492 10.4603C33.5798 10.4732 33.6126 10.4797 33.6457 10.4796H36.7485C36.7816 10.4797 36.8144 10.4732 36.845 10.4603C36.8755 10.4475 36.9033 10.4285 36.9267 10.4046C36.95 10.3807 36.9686 10.3524 36.9811 10.3211C36.9937 10.2899 37.0001 10.2564 37 10.2226C36.9999 10.1889 36.9933 10.1556 36.9806 10.1246C36.9679 10.0936 36.9493 10.0654 36.926 10.0417C36.9026 10.018 36.875 9.99927 36.8445 9.98652C36.8141 9.97377 36.7814 9.96728 36.7485 9.96741H33.6457Z'
                      fill='#2640EB'
                    />
                    <path
                      d='M20.805 6.58764C20.7628 6.58579 20.7209 6.5949 20.6831 6.61406C20.6452 6.63322 20.6128 6.6618 20.5887 6.69722L18.9374 9.12618C18.9184 9.15371 18.9048 9.18481 18.8976 9.21768C18.8904 9.25056 18.8896 9.28452 18.8953 9.31771C18.9009 9.3509 18.913 9.38268 18.9306 9.41111C18.9483 9.43955 18.9714 9.46409 18.9983 9.48343C19.0254 9.50275 19.0559 9.51639 19.0881 9.52363C19.1203 9.53086 19.1537 9.53157 19.1861 9.52561C19.2186 9.51964 19.2496 9.50718 19.2773 9.48893C19.3051 9.47069 19.3291 9.44703 19.3478 9.41929L20.7754 7.32297L21.6002 8.79553C21.6191 8.82943 21.6454 8.85848 21.677 8.8804C21.7087 8.90233 21.7447 8.91651 21.7826 8.92198C21.8204 8.92745 21.8589 8.92401 21.8952 8.91191C21.9316 8.89981 21.9648 8.87937 21.9922 8.85217L23.4197 7.44968L24.2167 9.43066C24.2344 9.47545 24.2642 9.51417 24.3026 9.54239C24.341 9.57062 24.3864 9.5872 24.4336 9.59017C24.4807 9.59313 24.5278 9.58239 24.5693 9.55918C24.6108 9.53597 24.645 9.50121 24.6679 9.45898L25.7275 7.5158L26.9646 10.3285C26.9834 10.3709 27.0131 10.4073 27.0505 10.4338C27.088 10.4603 27.1318 10.4757 27.1773 10.4786C27.2227 10.4816 27.2681 10.4718 27.3085 10.4503C27.3489 10.4289 27.3828 10.3965 27.4066 10.3568L28.4236 8.64428C28.4406 8.61548 28.4519 8.58353 28.4568 8.55027C28.4617 8.51702 28.4602 8.48315 28.4523 8.4505C28.4444 8.41785 28.4302 8.38709 28.4107 8.36003C28.3911 8.33296 28.3666 8.31007 28.3384 8.29271C28.3103 8.27532 28.2791 8.26383 28.2465 8.25879C28.214 8.25375 28.1808 8.25528 28.1489 8.26335C28.1169 8.27142 28.0868 8.28584 28.0603 8.30579C28.0339 8.32574 28.0115 8.35077 27.9945 8.37957L27.2253 9.67445L25.9789 6.83909C25.9596 6.79626 25.9291 6.75971 25.8908 6.73346C25.8525 6.70721 25.8078 6.69229 25.7617 6.69033C25.7156 6.68838 25.6699 6.69944 25.6296 6.72236C25.5893 6.74527 25.5559 6.7791 25.5332 6.82015L24.4829 8.74439L23.7414 6.90709C23.7258 6.86858 23.7013 6.83454 23.6699 6.80793C23.6385 6.78131 23.6012 6.76294 23.5613 6.75438C23.5214 6.74582 23.4801 6.74738 23.4409 6.75886C23.4017 6.77034 23.3658 6.79137 23.3364 6.82024L21.8755 8.25681L21.012 6.71625C20.9909 6.67865 20.9609 6.64715 20.9247 6.62465C20.8885 6.60216 20.8473 6.58942 20.805 6.58764Z'
                      fill='#2640EB'
                    />
                    <path
                      d='M1.80572 47.5463C7.67743 49.5308 19.3354 51.8104 31.1489 47.729C33.6502 46.8648 34.6675 44.2543 33.9076 42.3323C37.2968 40.5017 37.6051 37.1559 36.1979 33.818C37.1309 31.5208 38.5657 26.861 31.7603 21.656C26.9021 17.9402 23.1297 22.7922 25.878 25.0328C28.25 26.9667 29.6527 32.8776 23.3292 32.7626C17.1502 32.6502 19.3238 26.4693 21.2367 24.8173C23.5621 22.809 19.3848 17.5145 14.9352 21.2537C12.1722 23.5756 11.0031 28.0099 9.33762 28.5851C6.69351 29.4983 4.83437 29.0308 2.47615 29.2274C-1.2002 35.303 -0.223156 45.2083 1.80572 47.5463Z'
                      fill='#6576F1'
                    />
                    <path
                      d='M28.844 36.5094C28.7961 36.5092 28.7486 36.4994 28.7044 36.4805C28.6602 36.4616 28.62 36.4339 28.5862 36.3991C28.5524 36.3643 28.5257 36.3231 28.5075 36.2777C28.4893 36.2324 28.48 36.1838 28.4802 36.1348C28.4804 36.0858 28.49 36.0372 28.5085 35.992C28.527 35.9468 28.5541 35.9058 28.5881 35.8712C28.6221 35.8367 28.6625 35.8093 28.7068 35.7907C28.7512 35.7721 28.7988 35.7627 28.8467 35.7629C32.8588 35.777 35.9261 32.3553 35.9261 32.3553C35.9583 32.3186 35.9972 32.2888 36.0406 32.2676C36.084 32.2463 36.1311 32.234 36.1792 32.2315C36.2273 32.2289 36.2754 32.2361 36.3208 32.2527C36.3661 32.2692 36.4079 32.2947 36.4436 32.3278C36.4793 32.3608 36.5082 32.4007 36.5288 32.4452C36.5493 32.4897 36.5611 32.5379 36.5634 32.5871C36.5657 32.6363 36.5583 32.6854 36.5419 32.7316C36.5255 32.7779 36.5003 32.8204 36.4678 32.8567C36.4678 32.8567 33.258 36.5244 28.844 36.5094Z'
                      fill='#2640EB'
                    />
                    <path
                      d='M28.332 42.768C28.2842 42.7633 28.2378 42.7492 28.1954 42.7261C28.153 42.7031 28.1154 42.6717 28.0849 42.6339C28.0543 42.596 28.0313 42.5524 28.0173 42.5054C28.0033 42.4585 27.9985 42.4091 28.0032 42.3603C28.0077 42.3114 28.0217 42.264 28.0442 42.2207C28.0667 42.1773 28.0973 42.1389 28.1344 42.1077C28.1714 42.0765 28.2142 42.0531 28.2601 42.0388C28.3061 42.0244 28.3542 42.0195 28.402 42.0243C31.3837 42.3211 33.7109 40.8067 33.7109 40.8067C33.7924 40.7535 33.8912 40.7354 33.9857 40.7566C34.0802 40.7778 34.1626 40.8364 34.2149 40.9197C34.267 41.003 34.2846 41.104 34.2639 41.2006C34.2432 41.2971 34.1858 41.3814 34.1044 41.4348C34.1044 41.4348 31.5887 43.0921 28.332 42.768Z'
                      fill='#2640EB'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_587_1752'>
                      <rect width='37' height='50' fill='white' />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className='flex-col justify-start items-start gap-0.5 inline-flex'>
                <div className='text-blue-700 text-lg md:text-xl font-bold font-heading leading-[30px]'>
                  Know a good candidate? Get paid to refer them!
                </div>
                <div className='w-full max-w-[687px] text-blue-700 text-sm font-medium font-body leading-[21px]'>
                  Enter their email address and nominate them for a chance to
                  earn part of this role&apos;s bounty.
                </div>
              </div>
            </div>
          </div>
          <div className=' justify-center place-self-center items-center inline-flex h-11 '>
            <Input
              className='bg-mail-icon min-w-56 max-w-full focus-visible:ring-offset-[-1px] bg-left bg-no-repeat pl-8 h-full placeholder:text-gray-500 text-base placeholder:font-normal rounded-r-none focus:outline-none font-body placeholder:leading-normal'
              id='mail-input'
              placeholder='name@email.co'
            />

            <Button className='max-w-[104px] w-full h-full self-stretch pl-[19px] pr-5 py-2.5 bg-blue-700 rounded-tr-lg rounded-br-lg rounded-l-none justify-center items-center gap-2 flex'>
              <div className=' text-sm font-medium font-body leading-[21px]'>
                Nominate
              </div>
            </Button>
          </div>
        </div>
      </div>
      {/* job details */}
      <div className='flex lg:flex-row flex-col-reverse w-full max-w-[1200px] mx-auto justify-between py-16'>
        <div className='flex flex-col gap-10 md:px-0 px-4'>
          <InfoCard
            title={"Who is UMA?"}
            description={
              "We are a team aligned with the ethos of the crypto community. We believe that because UMA's optimistic oracle is the decentralized truth machine which can verify any statement proposed on the blockchain- we have the ability to truly expand what web3 is building. We are building a robust ecosystem. Our growing team is relatively small but incredibly mighty, and strives to be an engaging leader in the DeFi community."
            }
          />
          <ListCard
            title='Where we are headed:'
            listItems={[
              "We are building a robust ecosystem",
              "Our growing team is relatively small but incredibly mighty",
              "We strive to be an engaging leader in the DeFi community",
            ]}
            listType='unordered'
          />
          <InterestedButton id='modal1' />
        </div>
        <div className='flex w-full max-w-96 md:max-w-80 flex-row lg:flex-col gap-6 items-start justify-center md:py-0 pb-14'>
          <div className='flex w-full max-w-40 flex-col gap-6 '>
            <JobDetails title='Location' description={jobDetails.location} />
            <JobDetails title='Job Type' description={jobDetails.commitment} />
            <JobDetails
              title='Compensation'
              description={jobDetails.compensation}
            />
            <JobDetails
              title='Role type(s)'
              badges={["Engineering"]}
              badgeColorScheme='#D3D8FB'
            />
          </div>
          <div className='flex w-full max-w-40 flex-col gap-6 '>
            <JobDetails
              title='interest keywords'
              badges={["defi"]}
              badgeColorScheme='#E7FB6C'
            />
            <JobDetails title='hiring bounty' description='$10k' />
            <ShareJobDetails title='Share this job' />
            <InterestedButton id='modal2' />
          </div>
        </div>
      </div>
    </div>
  );
}
