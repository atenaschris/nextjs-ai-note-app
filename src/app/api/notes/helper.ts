import { getEmbedding } from "@/lib/openai";
import prisma from "@/lib/db/prisma";
import { notesIndex } from "@/lib/db/pinecone";
import { Note } from "@prisma/client";

interface ExecuteWithRetryParams {
  maxRetries: number;
  currentRetry: number;
  embedding?: number[];
  title?: string;
  content?: string;
  userId?: string;
}

type UpdateNoteOperationParamsType = Pick<
  ExecuteWithRetryParams,
  "title" | "content" | "userId" | "embedding"
> & { id: string };

type DeleteNoteOperationParamsType = { id: string };

async function executeWithRetry(
  {
    maxRetries,
    currentRetry,
    embedding,
    title,
    content,
    userId,
  }: ExecuteWithRetryParams,
  operation: () => Promise<Note>,
) {
  try {
    console.log("-------> Here in the Retry block\n\n");
    return await operation();
  } catch (error: any) {
    console.log("------> Here in the catch retry block: \n\n" + error);
    if (
      error.meta?.code === "unknown" ||
      error.meta?.message.includes("TransientTransactionError") ||
      error.meta?.message.includes("PineconeConnectionError") ||
      currentRetry < maxRetries
    ) {
      currentRetry++;
      console.log(
        `\n\nRetrying transaction (attempt ${currentRetry}/${maxRetries})...\n\n`,
      );
      return executeWithRetry(
        {
          maxRetries,
          currentRetry,
          embedding,
          title,
          content,
          userId,
        },
        operation,
      );
    } else {
      throw error;
    }
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}

async function createNoteOperation(
  title: string,
  userId: string,
  embedding: number[],
  content?: string,
) {
  return await prisma.$transaction(async (tx) => {
    console.log("-------> Here in the Transaction block\n\n");
    const createdNote = await tx.note.create({
      data: {
        title,
        content,
        userId,
      },
    });
    await notesIndex.upsert([
      { id: createdNote.id, values: embedding, metadata: { userId } },
    ]);

    return createdNote;
  });
}

async function updateNoteOperation({
  title,
  userId,
  embedding,
  id,
  content,
}: UpdateNoteOperationParamsType) {
  return await prisma.$transaction(async (tx) => {
    console.log("-------> Here in the Transaction block\n\n");
    const updatedNote = await tx.note.update({
      where: { id },
      data: {
        title,
        content,
        userId,
      },
    });
    await notesIndex.upsert([{ id, values: embedding!, metadata: { userId:userId! } }]);

    return updatedNote;
  });
}

async function deleteNoteOperation({ id }: DeleteNoteOperationParamsType) {
  return await prisma.$transaction(async (tx) => {
    console.log("-------> Here in the Transaction block\n\n");
    const deletedNote = await tx.note.delete({ where: { id } });
    await notesIndex.deleteOne(id);

    return deletedNote;
  });
}

export {
  executeWithRetry,
  getEmbeddingForNote,
  createNoteOperation,
  updateNoteOperation,
  deleteNoteOperation,
};
