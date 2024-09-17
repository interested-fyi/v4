import OpenAI from 'openai';

export default async function generateSummary(description: string) {
    const maxRetries = 5;
    const retryDelay = 30000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
        
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                response_format: { type: 'text'},
                messages: [
                    {role: 'system', content: `I am an HR recruiter's assistant whose job it is to create short 3-4 sentence summaries of job descriptions to send to potential candidates. Include location and compensation details whenever possible.`},
                    {role: "user", content: "Job Description:\nABOUT COW PROTOCOL \n\nCoW DAO is on a mission to protect Ethereum users from the dangers of DeFi. It does this by supporting the development of CoW Protocol, CoW Swap, MEV Blocker, and CoW AMM, and by funding values-aligned projects through the CoW Grants Program. \n\nCoW Protocol is the second-largest DEX aggregator by monthly volume and the first-largest intents-based exchange. MEV Blocker is currently involved in ~4% of all Ethereum transactions, making it the category leader. CoW AMM is the only live AMM that protects LPs from LVR (loss-versus rebalancing). \n\nAs a member of CoW DAO’s core team, you will have the opportunity to shape these essential products, and contribute to the Ethereum ecosystem more broadly.\n\n\nABOUT THE ROLE\n\nLocation: We are a fully remote team, and although we hire globally, there is a preference for this role to be based in Europe or remote +/- 5 hours CEST time\n\nPosition: Full-time contractor\n\n \n\n\nABOUT THE ROLE\n\nAt CoW Protocol, we have many opportunities to work with data each and every day\n\nWe are looking for a Senior Data Engineer to support us in extracting relevant data from the Ethereum blockchain. In this role, your primary responsibilities will be creating and maintaining data pipelines, building out our data infrastructure, and supporting other teams in their data needs\n\nThe ideal candidate is passionate about working with the data and creating impact from the ground up in a fast-paced environment\n\n\nWHAT YOU’LL DO\n\n - Partner with different stakeholders within the company to understand and address their data needs\n\n - Create, maintain, and optimize data pipelines and queries and facilitate easy consumption of data results. This includes designing and implementing scalable data storage and processing solutions, setting up monitoring and alerting systems to detect issues early, and ensuring data quality and integrity\n\n - Build the infrastructure required for performant extraction, transformation, and loading of data from a wide variety of data sources\n\n - End-to-end ownership of all engineering aspects of the solution. Deploy inclusive data quality checks, tests, and code review processes to ensure the high quality and correctness of data\n\n - Ensure that the company's data handling processes are secure and compliant with relevant regulations. This includes implementing appropriate access controls, encryption, and other security measures to protect sensitive data\n\n - Connect with the Ethereum community, follow trends, and stay up to date about new analytical tools that help extract relevant data from the blockchain\n\n\nWHO YOU ARE\n\n - Strong technical background with a degree in Computer Science, Mathematics and/or Engineering\n\n - Experience in designing, implementing, deploying, and maintaining efficient data architectures\n\n - Proficiency in Python and/or other modern programming language development experience\n\n - Proficiency in querying databases and data modeling, in particular SQL and relational databases experience\n\n - Experience in working with blockchain data from 3rd party providers (including blockchain APIs): Dune Analytics, Etherescan, Coingeko, etc\n\n - Knowledge of cloud computing platforms like Amazon Web Services (AWS), Google Cloud Platform (GCP)\n\n - You are obsessed with numbers and a strong believer in data-driven decision-making, able to analyze and interpret complex data sets and draw meaningful insights from them\n\n - Self-motivated and proactive team player, approach problems creatively and find effective solutions, able to multi-task and also work independently\n\n - Passionate for engineering best practices such as code reviews, testing, continuous integration, and delivery\n\n - Passionate about crypto and blockchain technology, a strong believer in its potential to transform industry \n\n\n \n\n\nWHAT WE CAN OFFER YOU\n\n - Flexible work environment: Join our hub in Lisbon or work remotely\n\n - Token plan: Have a stake in our mission and shape the future of CoW DAO\n\n - Periodic gatherings: Enjoy opportunities to connect with the rest of the team through regular trips\n\n - Conference allocation: Stay up-to-date with ecosystem advancements using our conference budget\n\n - Learning budget: Use our learning budget to support your higher ambitions\n\n - Hardware budget: Take advantage of a hardware budget to acquire the necessary equipment\n\n - Make an impact: You are joining a startup where you can make a huge difference. Your work matters!\n\n - Flat hierarchies mean fewer processes and bureaucracy - see more of your ideas come to life!\n\n - Flexible work and vacation times: Prioritize work-life balance through our robust, flexible work policy and vacation allowance\n\n - Growth: If you're someone who loves taking the initiative and getting things done, CoW offers lots of opportunities for your individual growth\n\n\n \n\n\nREFERRAL PROGRAM\n\nEarn 6.000 USDC or USD with the refer-to-earn program. More details here https://cow.fi/careers/refer-to-earn.\n\n \n\n\nCULTURE\n\nLife within the CoW Protocol is an incredible adventure! We take pride in our collaborative approach, embracing autonomy and fostering a culture of big thinking and continuous growth. We value impact, ownership, simplicity, and team spirit. Plus, we're all about feedback, coming together, and enjoying the journey along the way!\n\n\nAT COW PROTOCOL, WE STRIVE TO CREATE A SPACE WHERE EVERYONE FEELS INCLUDED AND EMPOWERED. WE BELIEVE THAT OUR PRODUCTS AND SERVICES BENEFIT FROM OUR DIVERSE BACKGROUNDS AND EXPERIENCES. ALL QUALIFIED APPLICANTS ARE CONSIDERED FOR POSITIONS REGARDLESS OF RACE, ETHNIC ORIGIN, AGE, RELIGION OR BELIEF, MARITAL STATUS, GENDER IDENTIFICATION, SEXUAL ORIENTATION, OR PHYSICAL ABILITY"}, 
                    {role: "assistant", content: "CoW Protocol, part of CoW DAO, is seeking a Senior Data Engineer to join their fully remote team, preferably within +/- 5 hours of CEST. This full-time contractor role involves creating and maintaining data pipelines, building data infrastructure, and collaborating with stakeholders to extract insights from Ethereum blockchain data. Candidates should have a strong technical background, proficiency in Python and SQL, and experience with blockchain data sources. CoW Protocol offers a flexible work environment, a token plan for shared ownership, and opportunities for personal and professional growth."},
                    {role: "user", content: `Job Description:\n${description}`}
                ]
            });
        
            const generatedText = response.choices[0].message.content;
            return { role: response.choices[0].message.role, content: generatedText }; 
        } catch (e) {
            if (e instanceof Error) {
                if (e.message.includes('429 Rate limit reached')) {
                    if (attempt < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        continue;
                    } else {
                        console.error('Max Retries hit');
                        return;
                    }
                } else {
                    return;
                }
            } else {
                return;
            }
        }
    }
}