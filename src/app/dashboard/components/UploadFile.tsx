"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { UploadFileDropzone } from "./UploadFileDropzone";

export const UploadFile = () => {
  const [open, setOpen] = useState(false);

  const openDialogue = () => setOpen(true);

  return (
    <>
      <Button size={"lg"} onClick={openDialogue}>
        Upload File
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <UploadFileDropzone />
        </DialogContent>
      </Dialog>
    </>
  );
};
