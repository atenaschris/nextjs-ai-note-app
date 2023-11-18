import OpenAI from "openai";

const apiKey = process.env.OPEN_API_KEY;

if (!apiKey) {
  throw new Error("OPEN_API_KEY is not set");
}
const openAi = new OpenAI({ apiKey });

export default openAi;
