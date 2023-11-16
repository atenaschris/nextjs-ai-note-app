import prisma from "@/lib/db/prisma";
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const parseResult = createNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ err: "Invalid input" }, { status: 400 });
    }

    const { title, content } = parseResult.data;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
    });
    return Response.json({ note }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const parseResult = updateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ err: "Invalid input" }, { status: 400 });
    }

    const { title, content, id } = parseResult.data;

    const noteToUpdate = await prisma.note.findUnique({
      where: { id },
    });

    if (!noteToUpdate) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== noteToUpdate.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
      },
    });
    return Response.json({ updatedNote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ err: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const noteToDelete = await prisma.note.findUnique({
      where: { id },
    });

    if (!noteToDelete) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== noteToDelete.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.note.delete({
      where: { id },
    });
    return Response.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
