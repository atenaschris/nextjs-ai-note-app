import {Pinecone} from "@pinecone-database/pinecone"

const apiKey = process.env.PINECONE_API_KEY;

if(!apiKey){
    throw new Error("PINECONE_API_KEY is not set")
}

console.log('------> PINECONE_API_KEY' + apiKey)

const pinecone = new Pinecone({
    environment:"gcp-starter",
    apiKey
})

export const notesIndex = pinecone.Index("nextjs-chatbot-ai")