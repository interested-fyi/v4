/** @jsxImportSource frog/jsx */

import supabase from "@/lib/supabase";
import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import jobUrlBuilder from "@/functions/general/job-url-builder";
import { neynar as neynarMiddle } from "frog/middlewares";
const app = new Frog({
  assetsPath: "/",
  basePath: "/api/farcaster/frames",
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY || "" }),
  title: "Interested FYI - Job Posting",
});

const neynarMiddleware = neynarMiddle({
  apiKey: process.env.NEYNAR_API_KEY || "",
  features: ["interactor"],
});
// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/jobs/:id", neynarMiddleware, async (c) => {
  const { id } = c.req.param();
  const { telegramURL } = c.req.query();
  const text = c.var.cast?.text;
  console.log("🚀 ~ app.frame ~ text:", text);
  console.log("🚀 ~ app.frame ~ telegramURL:", telegramURL);

  const jobData = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/jobs/get-job-by-id/${id}`
  ).then((res) => res.json());

  return c.res({
    image: (
      <div
        style={{
          alignItems: "flex-start",
          background: "linear-gradient(to right, #2640EB 97%, #E8FC6C 3%)",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          margin: "0 auto",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
            gap: 20,
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: 40,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              margin: 0,
              padding: 0,
              flexFlow: "wrap",
            }}
          >
            <span>{jobData.job.role_title}</span> -{" "}
            <span> {jobData.job.companies.company_name}</span>
          </p>
          <div
            style={{
              borderRadius: 10,
              background: "white",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "90%",
              height: 300,
              gap: 20,
              padding: "0 64px",
            }}
          >
            <p
              style={{
                color: "black",
                fontSize: 26,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
                textAlign: "left",
              }}
            >
              {text}
            </p>
            <p
              style={{
                color: "black",
                fontSize: 26,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
                textAlign: "left",
              }}
            >
              Location: {jobData.job.location}
            </p>
          </div>
          {/* add a badge with 'interestedFYI' in it */}
          <div
            style={{
              borderRadius: 10,
              background: "white",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "40%",
              margin: "24px 0",
              height: 72,
              padding: "0 20px",
            }}
          >
            <p
              style={{
                color: "black",
                fontSize: 26,
                fontStyle: "bold",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
                textAlign: "left",
                padding: "16px",
              }}
            >
              Interested FYI
            </p>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button.Link href={jobUrlBuilder(jobData.job.posting_url)}>
        Apply Now
      </Button.Link>,
      <Button.Link href={telegramURL}>Follow on Telegram</Button.Link>,
    ],
  });
});

app.frame("/referral", async (c) => {
  const { status, frameData } = c;
  const jobId = frameData?.url.split("/").pop();

  try {
    // save link click to supabase
    console.log(
      `Link clicked: user ${frameData?.fid}, job ${jobId} - ${frameData?.url}`
    );

    const url = jobUrlBuilder(frameData?.url ?? "");

    // log click in referral_link_clicks table for user, source and jobId
    // const { error } = await supabase.from("referral_link_click").insert({
    //   job_id: jobId,
    //   fid: frameData?.fid,
    //   url: url,
    //   source: "farcaster",
    // });

    // if (error) {
    //   throw new Error("Error logging link click");
    // }
  } catch (error) {
    console.error("Error logging referral:", error);
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: "flex-start",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
            gap: 20,
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: 54,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              margin: 0,
              padding: 0,
            }}
          >
            <span>Senior Software Engineer</span> - <span> Aethos</span>
          </p>
          <div
            style={{
              borderRadius: 10,
              background: "white",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "90%",
              height: 300,
              gap: 20,
              padding: "0 64px",
            }}
          >
            <p
              style={{
                color: "black",
                fontSize: 26,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
                textAlign: "left",
              }}
            >
              You've referred a friend to the Senior Software Engineer position
            </p>
          </div>
          {/* add a badge with 'interestedFYI' in it */}
          <div
            style={{
              borderRadius: 10,
              background: "white",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "40%",
              margin: "24px 0",
              height: 50,
              padding: "0 20px",
            }}
          >
            <p
              style={{
                color: "black",
                fontSize: 26,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
                textAlign: "left",
              }}
            >
              Interested FYI
            </p>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button action='/jobs/1' value='apply'>
        Apply
      </Button>,
      <Button value={jobId}>Refer</Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
