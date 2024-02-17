"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UploadFileDropzone } from "./UploadFileDropzone";

export const UploadFile = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const [open, setOpen] = useState(false);

  const openDialogue = () => setOpen(true);

  return (
    <>
      <Button size={"lg"} onClick={openDialogue}>
        Upload File
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <UploadFileDropzone isSubscribed={isSubscribed} />
        </DialogContent>
      </Dialog>
    </>
  );
};
