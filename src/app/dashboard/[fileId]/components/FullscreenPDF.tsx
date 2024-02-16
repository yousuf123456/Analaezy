import React, { useState } from "react";

import Simplebar from "simplebar-react";
import { File } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Fullscreen, Loader2 } from "lucide-react";
import { Page, Document } from "react-pdf";
import { useToast } from "@/components/ui/use-toast";
import { useResizeDetector } from "react-resize-detector";

const PDFLoadingState = () => {
  return (
    <div className="w-full h-full flex justify-center items-center mt-32">
      <Loader2 className=" animate-spin w-8 h-8 text-zinc-600" />
    </div>
  );
};

export const FullscreenPDF = ({ file }: { file: File }) => {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [numPages, setNumPages] = useState(0);

  const openFullscreen = () => setOpen(true);
  const { ref, width } = useResizeDetector();

  const onLoadError = () => {
    toast({
      title: "Error loading PDF file",
      description: "There eas some error loading your pdf file",
      variant: "destructive",
    });
  };

  return (
    <>
      <Button
        variant={"ghost"}
        onClick={openFullscreen}
        className="max-sm:p-[10px]"
      >
        <Fullscreen className="w-4 h-4 text-zinc-600 " />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-7xl w-full">
          <Simplebar className="min-h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] mt-4">
            <div ref={ref}>
              <Document
                file={file}
                onLoadError={onLoadError}
                loading={PDFLoadingState}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                {Array.from({ length: 5 })
                  .fill(0)
                  .map((_, i) => (
                    <Page
                      key={i}
                      pageNumber={i + 1}
                      width={width ?? 1}
                      className={"border-b-2 border-zinc-300"}
                    />
                  ))}
              </Document>
            </div>
          </Simplebar>
        </DialogContent>
      </Dialog>
    </>
  );
};
