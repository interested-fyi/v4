import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface EndorsementCardProps {
  endorserName: string;
  photoSource?: string;
  timeCreated: string;
  endorserData: {
    name: string;
    photo_source: string;
  };
  relationship: string;
  endorsement: string;
}

export function EndorsementCard({
  endorserName,
  timeCreated,
  relationship,
  endorserData,
  endorsement,
}: EndorsementCardProps) {
  return (
    <Card className='p-4'>
      <div className='flex items-start gap-4'>
        <Avatar>
          <AvatarImage
            src={
              endorserData?.photo_source ??
              "/placeholder.svg?height=40&width=40"
            }
            alt={endorserData?.name ?? "Endorser"}
          />
          <AvatarFallback>{endorserName?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className='font-semibold text-[#2640eb]'>
            {endorserData?.name ?? "Endorser"}
          </h3>
          <p className='text-sm text-gray-500 font-medium font-body'>
            {new Date(timeCreated).toLocaleString()}
          </p>
          <p className='text-sm font-medium font-body leading-[21px] mt-1 text-gray-600'>
            {relationship}
          </p>
          <p className='text-xs text-gray-600 font-medium font-body leading-[18px] mt-2'>
            {endorsement}
          </p>
        </div>
      </div>
    </Card>
  );
}
