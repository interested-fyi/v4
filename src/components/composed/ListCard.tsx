export interface ListCardProps {
  title: string;
  listItems: string[];
  listType: "ordered" | "unordered";
}
export const ListCard = ({ title, listItems, listType }: ListCardProps) => {
  const ListTag = listType === "ordered" ? "ol" : "ul";
  return (
    <div className='w-[687px] max-w-full h-[157px] max-h-full flex-col justify-start items-start gap-4 inline-flex'>
      <div className='text-blue-700 text-2xl font-bold font-heading leading-9'>
        {title}
      </div>
      <ListTag className='w-[687px] max-w-full text-gray-800 text-sm font-medium font-body pl-4 leading-[21px]'>
        {listItems.map((point, index) => (
          <li
            className={`
            ${listType === "ordered" ? "list-decimal" : "list-disc"}
            `}
            key={index}
          >
            {point}
          </li>
        ))}
      </ListTag>
    </div>
  );
};
