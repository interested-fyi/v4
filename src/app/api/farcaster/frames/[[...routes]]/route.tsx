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
  const jobPosting = text ?? "";

  const companyRegex = /^([\s\S]+?)\s*Position:/;
  const positionRegex = /Position:\s*(.+)/;
  const locationRegex = /Location:\s*(.+)/;
  const compensationRegex = /Compensation:\s*(.+)/;
  const descriptionRegex = /Compensation:\s*.+\n+([\s\S]*)/;

  const companyMatch = jobPosting.match(companyRegex);
  const positionMatch = jobPosting.match(positionRegex);
  const locationMatch = jobPosting.match(locationRegex);
  const compensationMatch = jobPosting.match(compensationRegex);
  const descriptionMatch = jobPosting.match(descriptionRegex);

  const company = companyMatch ? companyMatch[1].trim() : null;
  const position = positionMatch ? positionMatch[1].trim() : null;
  const location = locationMatch ? locationMatch[1].trim() : null;
  const compensation = compensationMatch ? compensationMatch[1].trim() : null;
  const description = descriptionMatch ? descriptionMatch[1].trim() : null;

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "20px",
          background: "linear-gradient(to right, #2640EB 97%, #E8FC6C 3%)",
          borderRadius: "8px",
          textAlign: "left",
          width: "100%",
          height: "100%",

          margin: "0 auto",
        }}
      >
        <h2
          style={{
            color: "white",
            fontSize: "32px",
            margin: "0 0 10px",
          }}
        >
          {position} - {company}
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "white",
            borderRadius: "8px",
            padding: "15px",
            width: "100%",
            textAlign: "left",
            fontSize: "24px",
            color: "black",
          }}
        >
          <p>{description}</p>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <p>{compensation}</p>
            <p>{location}</p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "15px",
            background: "white",
            borderRadius: "8px",
            padding: "10px 20px",
            color: "black",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Interested FYI
        </div>
      </div>
    ),
    intents: [
      // eslint-disable-next-line react/jsx-key
      <Button.Link href={jobUrlBuilder(jobData.job.posting_url)}>
        Apply Now
      </Button.Link>,
      // eslint-disable-next-line react/jsx-key
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
