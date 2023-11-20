"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddOrEditNoteDialog from "@/components/AddOrEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { useTheme } from "next-themes";
import {dark} from "@clerk/themes"
import AIChatButton from "@/components/AIChatButton";
export default function NavBar() {
  const [showAddOrEditNoteDialog, setShowAddOrEditNoteDialog] = useState(false);
  const {theme} = useTheme()
  return (
    <>
      <nav className="p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between">
          <Link href="/notes" className="flex items-center gap-1">
            <Image src={logo} alt="Brain logo" width={40} height={40} />
            <span className="font-bold">Brain</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme:(theme === "dark" ? dark : undefined),
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            />
            <ThemeToggleButton/>
            <Button onClick={() => setShowAddOrEditNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add Note
            </Button>
            <AIChatButton/>
          </div>
        </div>
      </nav>
      <AddOrEditNoteDialog open={showAddOrEditNoteDialog} setOpen={setShowAddOrEditNoteDialog} />
    </>
  );
}
