/** @jsxImportSource frog/jsx */

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
  const text = c.var.cast?.text;
  const { chatName, msgId } = c.req.query();

  const jobData = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/jobs/get-job-by-id/${id}`
  ).then((res) => res.json());

  const pageUrl = `${process.env.NEXT_PUBLIC_HOST}/referral/telegram?fid=${c.var.interactor?.fid}&jobId=${id}&chatName=${chatName}&msgId=${msgId}`;

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
      <Button.Redirect location={pageUrl}>Follow on Telegram</Button.Redirect>,
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
