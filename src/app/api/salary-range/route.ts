import { SalaryFormData } from "@/components/composed/salary/SalaryRangeFinder";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { category, role, seniority, location } =
    (await req.json()) as SalaryFormData;

  // TODO: determine the min, median, and max salary based on the formData

  // For now, we'll just return some dummy data
  const minSalary = 100000;
  const medianSalary = 145000;
  const maxSalary = 200000;

  return NextResponse.json({
    minSalary,
    medianSalary,
    maxSalary,
  });
}
