import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export interface CheckboxGroupProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}
export const CheckboxGroup = ({
  id,
  label,
  checked,
  onChange,
}: CheckboxGroupProps) => {
  return (
    <div className='items-top flex space-x-2 text-white'>
      <Checkbox
        id={id}
        className='h-6 w-6 border border-white checked:bg-[#8A63D2]'
        checked={checked}
        onClick={onChange}
      />
      <div className='grid gap-1.5 leading-none items-center'>
        <Label
          htmlFor={id}
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          {label}
        </Label>
      </div>
    </div>
  );
};
