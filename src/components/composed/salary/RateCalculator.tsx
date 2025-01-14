import React from "react";
interface RateCalculatorProps {
  minSalary: string;
  medianSalary: string;
  maxSalary: string;
  currencyCode?: string;
}
/**
 * Renders a rate calculator component.
 *
 * @component
 *
 * @param {number} minSalary - The minimum salary.
 * @param {number} medianSalary - The median salary.
 * @param {number} maxSalary - The maximum salary.
 * @param {string} [currencyCode="USD"] - The currency code.
 * @returns {JSX.Element} The rendered RateCalculator component.
 */
export function RateCalculator({
  minSalary,
  medianSalary,
  maxSalary,
  currencyCode = "USD",
}: RateCalculatorProps) {
  return (
    <div className='mt-4 border border-blue-700 w-full rounded-lg'>
      <div className='flex justify-between p-4 border-b border-blue-700 w-full'>
        <span className='text-[#333333]'>Minimum</span>
        <span className='font-semibold text-[#0052cc]'>
          {formatCurrencyByCode(
            Number(minSalary.replace(",", "")),
            currencyCode
          )}
        </span>
      </div>
      <div className='flex justify-between p-4 border-b border-blue-700 w-full'>
        <span className='text-[#333333]'>Median</span>
        <span className='font-semibold text-[#0052cc]'>
          {formatCurrencyByCode(
            Number(medianSalary.replace(",", "")),
            currencyCode
          )}
        </span>
      </div>
      <div className='flex justify-between p-4'>
        <span className='text-[#333333]'>Maximum</span>
        <span className='font-semibold text-[#0052cc]'>
          {formatCurrencyByCode(
            Number(maxSalary.replace(",", "")),
            currencyCode
          )}
        </span>
      </div>
    </div>
  );
}

function formatCurrencyByCode(amount: number, currencyCode: string): string {
  try {
    // Use a default locale (e.g., 'en-US') while formatting the currency
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    });

    return formatter.format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return amount.toString(); // Fallback in case of error
  }
}
