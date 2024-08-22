/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api/farcaster/frames",
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY || "" }),
  title: "Interested FYI - Job Posting",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/basic", (c) => {
  const { buttonValue, status } = c;
  const selectedButton = buttonValue;
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
              {status === "response"
                ? `Nice choice.${
                    selectedButton ? ` ${selectedButton.toUpperCase()}!!` : ""
                  }`
                : "This is a great opportunity to work with a team of talented engineers to build the next generation of software. At Aethos, we are looking for a Senior Software Engineer to join our team. If you are passionate about software development and want to work in a fast-paced environment, we would love to hear from you."}
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
      <Button value='refer'>Refer</Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/jobs/:id", async (c) => {
  const { buttonValue, status } = c;
  const jobId = c.req.param("id");
  console.log("🚀 ~ app.frame ~ jobId:", jobId);

  // Fetch job data from your Next.js API
  const response = await fetch(
    `http://localhost:3000/api/jobs/get-job-by-id/${jobId}`
  );
  const { job } = await response.json();
  console.log("🚀 ~ app.frame ~ response:", response);

  const selectedButton = buttonValue;

  if (!job) {
    return c.res({
      image: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            background: "black",
            color: "white",
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          Job not found.
        </div>
      ),
      intents: [<Button.Reset>Reset</Button.Reset>],
    });
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
            <span>{job.role_title}</span> - <span>{job.company_name}</span>
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
              {status === "response"
                ? `Nice choice.${
                    selectedButton ? ` ${selectedButton.toUpperCase()}!!` : ""
                  }`
                : job.description}
            </p>
          </div>
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
      <Button value='apply'>Apply</Button>,
      <Button value='refer'>Refer</Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/jobs/:id", (c) => {
  const { id } = c.req.param();
  return c.res({
    image: (
      <div
        style={{
          alignItems: "flex-start",
          background: "black",
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
          Job Posting {id}
        </p>
      </div>
    ),
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
