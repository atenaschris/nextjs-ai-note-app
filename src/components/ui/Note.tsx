"use client"

import { Note as NoteModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { useState } from "react";
import AddOrEditNoteDialog from "../AddOrEditNoteDialog";

interface NoteProps {
  note: NoteModel;
}

export default function Note({ note }: NoteProps) {
  const [showAddOrEditDialog, setShowAddOrEditDialog] = useState(false);
  const wasUpdated = note.updatedAt > note.createdAt;

  const createdUpdatedAtTimeStamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();

  return (
    <>
      <Card className="cursor-pointer dark:hover:shadow-white hover:shadow-md transition-shadow" onClick={() => setShowAddOrEditDialog(true)}>
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimeStamp}
            {wasUpdated && "(updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{note.content}</p>
        </CardContent>
      </Card>
      <AddOrEditNoteDialog
        open={showAddOrEditDialog}
        setOpen={setShowAddOrEditDialog}
        noteToEdit={note}
      />
    </>
  );
}
