export interface InfoCardProps {
  title: string;
  description: string;
}
export const InfoCard = ({ title, description }: InfoCardProps) => {
  return (
    <div className='w-[687px] max-w-full flex-col justify-start items-start gap-4 inline-flex'>
      <div className='text-blue-700 text-2xl font-bold font-heading leading-9'>
        {title}
      </div>
      <div className='w-[687px] max-w-full text-gray-800 text-sm font-medium font-body leading-[21px]'>
        {description}
      </div>
    </div>
  );
};
