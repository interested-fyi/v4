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
  browserLocation: `${process.env.NEXT_PUBLIC_BASE_URL}/referral/farcaster`,
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY || "" }),
  title: "Interested FYI - Job Posting",
});

const neynarMiddleware = neynarMiddle({
  apiKey: process.env.NEYNAR_API_KEY || "",
  features: ["interactor", "cast"],
});
// Uncomment to use Edge Runtime
// export const runtime = 'edge'
app.frame("/jobs/:id", neynarMiddleware, async (c) => {
  console.log("🚀 ~ app.frame ~ c:", c);
  const { id } = c.req.param();
  console.log("🚀 ~ app.frame ~ id:", id);

  const { chatName, msgId } = c.req.query();
  const jobData = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/get-job-by-id/${id}`
  ).then((res) => res.json());

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "28px",
          background: "blue",
        }}
      >
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <h1
            style={{
              fontSize: "48px",
              margin: "0 0 20px 0",
              textAlign: "center",
              color: "white",
            }}
          >
            We&apos;ve been looking for{" "}
            <span
              style={{
                color: "yellow",
                marginLeft: "12px",
                fontWeight: "bold",
              }}
            >
              {" "}
              you!
            </span>
          </h1>
        </div>
        <div
          style={{
            border: "1px solid blue",
            padding: "28px",
            display: "flex",
            background: "white",
            flexDirection: "column",
            borderBottom: "0",
            margin: "auto",
            width: "100%",
          }}
        >
          <h1
            style={{
              margin: "0",
              textTransform: "capitalize",
              fontSize: "48px",
            }}
          >
            {jobData.job.role_title}
          </h1>
          <h1
            style={{
              margin: "0",
              textTransform: "capitalize",
              fontSize: "32px",
            }}
          >
            {jobData.job.companies.company_name}
          </h1>
        </div>

        <div
          style={{
            border: "1px solid blue",
            padding: "28px",
            paddingTop: "16px",
            display: "flex",
            background: "white",
            justifyContent: "space-between",
            flexDirection: "row",
            height: "100px",
          }}
        >
          <div
            style={{
              display: "flex",
              background: "white",
              flexDirection: "column",
            }}
          >
            <p style={{ margin: "0", color: "blue", fontSize: "20px" }}>
              LOCATION
            </p>
            <p>{jobData.job.location}</p>
          </div>
          {jobData.job.job_postings_details && (
            <div
              style={{
                display: "flex",
                background: "white",
                flexDirection: "column",
              }}
            >
              <p style={{ margin: "0", color: "blue", fontSize: "20px" }}>
                COMPENSATION
              </p>
              <p>{jobData.job.job_postings_details?.compensation}</p>
            </div>
          )}
        </div>
        {jobData.job.job_postings_details && (
          <div
            style={{
              display: "flex",
              background: "white",
              border: "1px solid blue",
              borderTop: "0",
              padding: "28px",
              paddingTop: "16px",
              fontSize: "20px",
            }}
          >
            <p>{jobData.job.job_postings_details?.summary}</p>
          </div>
        )}
      </div>
    ),
    intents: [
      // eslint-disable-next-line react/jsx-key
      <Button.Link href={jobUrlBuilder(jobData.job.posting_url)}>
        Apply Now
      </Button.Link>,
      // eslint-disable-next-line react/jsx-key
      <Button.Redirect
        location={`${process.env.NEXT_PUBLIC_BASE_URL}/referral/farcaster?fid=${c.var.interactor?.fid}&userName=${c.var.interactor?.username}&castHash=${c.var.cast?.hash}&jobId=${id}`}
      >
        Refer a friend
      </Button.Redirect>,
    ],
  });
});

// app.frame("/referral", neynarMiddleware, async (c) => {
//   const query = c.buttonValue;
//   const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/referral/farcaster?${query}`;

//   return c.res({
//     image: (
//       <a
//         href={pageUrl}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           width: "100%",
//           height: "100%",
//           padding: "28px",
//           background: "blue",
//         }}
//       >
//         <div
//           style={{
//             border: "1px solid blue",
//             padding: "28px",
//             paddingTop: "16px",
//             display: "flex",
//             background: "white",
//             justifyContent: "center",
//             alignContent: "center",
//             alignItems: "center",
//             flexDirection: "row",
//             height: "100%",
//             borderRadius: "8px",
//           }}
//         >
//           <h1>Click to open your referral link</h1>
//         </div>
//       </a>
//     ),
//   });
// });

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
