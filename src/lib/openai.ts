import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPEN_API_KEY is not set");
}
const openAi = new OpenAI({ apiKey });

export default openAi;

export async function getEmbedding(text:string){
    const response = await openAi.embeddings.create({
        model:'text-embedding-ada-002',
        input:text
    })

    const embedding = response.data[0].embedding;

    if(!embedding) throw new Error("Error generationg embedding")

    console.log({embedding})

    return embedding
}
