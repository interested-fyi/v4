import { Badge } from "../ui/badge";

export interface JobDetailsProps {
  title: string;
  description?: string;
  badges?: string[];
  badgeColorScheme?: "#E7FB6C" | "#D3D8FB";
}
export const JobDetails: React.FC<JobDetailsProps> = ({
  title,
  description,
  badges,
  badgeColorScheme,
}) => {
  return (
    <div className='w-full h-full max-h-[53px] flex-col justify-start items-start gap-2 inline-flex'>
      <div className='text-left uppercase text-indigo-400 text-sm font-medium font-body leading-[21px]'>
        {title}
      </div>
      {description ? (
        <div className='text-left text-nowrap text-gray-800 text-base font-medium font-body leading-normal'>
          {description}
        </div>
      ) : null}
      {badges?.map((badge) => (
        <Badge
          className={`text-center text-blue-700 hover:text-[#E7FB6C] text-sm font-medium font-body bg-[${badgeColorScheme}] rounded-md justify-center items-center inline-flex leading-[21px]`}
          key={badge}
        >
          {badge}
        </Badge>
      ))}
    </div>
  );
};
