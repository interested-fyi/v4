import Image from "next/image";

export default function SalaryQuizCopy() {
  return (
    <div className='flex text-heading max-w-[415px] mx-auto flex-col items-center text-center md:items-start md:text-left'>
      <Image
        src='/svg/binocular-question.svg'
        alt='binoculars'
        height={20}
        width={20}
        className='w-20 h-20 text-[#6b6bff]'
      />

      <h2 className='mt-4 text-2xl font-semibold text-gray-800'>
        Unsure what salary range you should expect for your experience?
      </h2>
      <p className='mt-2 text-gray-500'>We&apos;ve got you covered.</p>
      <p className='mt-4 text-gray-600'>
        Select the role/title that best fits your most recent title, or the
        future position you&apos;re interested in.
        <br />
        Then, tell us where you live in so we can tailor a salary range based on
        cost of living in your area.
        <br />
        <br />
        It&apos;s that easy!
      </p>
    </div>
  );
}
