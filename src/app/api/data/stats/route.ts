// app/api/stats/route.ts
import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const statType =
    (url.searchParams.get("type") as keyof typeof labelMap) || "";

  const labelMap = {
    companies: "Companies",
    jobs: "Job Attestations",
    users: "Users Brought Onchain",
  };
  const label = labelMap[statType];
  try {
    switch (statType) {
      case "companies":
        const { data: companies, error: companiesError } = await supabase
          .from("companies")
          .select("company_name", { count: "exact" })
          .eq("approved", true);

        if (companiesError) {
          console.error("Companies query error:", companiesError);
          return NextResponse.json(
            { error: "Database query failed" },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { value: companies?.length, label },
          { status: 200 }
        );

      case "jobs":
        const { error: jobsError, count: jobs } = await supabase
          .from("job_attestations")
          .select("job_posting_id", {
            count: "exact",
            head: true,
          });
        console.log("🚀 ~ GET ~ jobs:", jobs);

        if (jobsError) {
          console.error("Jobs query error:", jobsError);
          return NextResponse.json(
            { error: "Database query failed" },
            { status: 500 }
          );
        }

        return NextResponse.json({ value: jobs, label }, { status: 200 });

      case "users":
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("id", { count: "exact" })
          .is("fid", null);

        if (usersError) {
          console.error("Users query error:", usersError);
          return NextResponse.json(
            { error: "Database query failed" },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { value: users?.length, label },
          { status: 200 }
        );

      default:
        return NextResponse.json(
          {
            error: "Invalid stat type",
            validTypes: ["companies", "jobs", "users"],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
