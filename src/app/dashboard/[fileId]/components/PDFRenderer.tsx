"use client";
import React, { useEffect, useState } from "react";

import { File } from "@prisma/client";
import { Page, Document, pdfjs } from "react-pdf";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useResizeDetector } from "react-resize-detector";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import {
  ChevronDown,
  ChevronUp,
  Fullscreen,
  Loader2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Simplebar from "simplebar-react";
import { cn } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import { FullscreenPDF } from "./FullscreenPDF";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFLoadingState = () => {
  return (
    <div className="w-full h-full flex justify-center items-center mt-28">
      <Loader2 className=" animate-spin w-8 h-8 text-zinc-600" />
    </div>
  );
};

interface PDFRendererProps {
  file: File;
}

export const PDFRenderer: React.FC<PDFRendererProps> = ({ file }) => {
  const { ref, width } = useResizeDetector();

  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const { toast } = useToast();

  const goToNextPage = () =>
    setPageNumber((prev) => {
      if (prev + 1 > numPages) return prev;
      return prev + 1;
    });

  const goToPrevPage = () =>
    setPageNumber((prev) => {
      if (prev - 1 < 1) return prev;
      return prev - 1;
    });

  const customPageValidatorSchema = z.object({
    page: z.string().refine((num) => {
      return Number(num) > 0 && Number(num) <= numPages;
    }),
  });

  type TCustomPageValidatorSchema = z.infer<typeof customPageValidatorSchema>;

  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm<TCustomPageValidatorSchema>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(customPageValidatorSchema),
  });

  const page = watch("page");

  useEffect(() => {
    if (errors.page) return;

    setPageNumber(Number(page));
  }, [page]);

  useEffect(() => {
    if (errors.page) return;

    if (pageNumber === Number(page)) return;

    setValue("page", pageNumber.toString());
  }, [pageNumber]);

  const onZoomIn = () => {
    const availScales = [1, 1.5, 2, 2.5];

    const oldScaleIndex = availScales.indexOf(scale);
    if (oldScaleIndex === availScales.length - 1) return;
    else setScale(availScales[oldScaleIndex + 1]);
  };

  const onZoomOut = () => {
    const availScales = [1, 1.5, 2, 2.5];

    const oldScaleIndex = availScales.indexOf(scale);
    if (oldScaleIndex === 0) return;
    else setScale(availScales[oldScaleIndex - 1]);
  };

  const onRotate = () => {
    setRotation((prev) => prev + 90);
  };

  const onLoadError = () => {
    toast({
      title: "Error loading PDF file",
      description: "There eas some error loading your pdf file",
      variant: "destructive",
    });
  };

  const buttonsActiveCs = "max-sm:p-[10px]";

  return (
    <div className="flex-1 flex-col gap-0 bg-white" id="pdfContainer">
      <div className="h-12 sm:h-14 flex items-center justify-between w-full bg-zinc-100 rounded-md px-0 sm:px-4">
        <div className="flex items-center gap-0  rounded-sm">
          <Button
            size={"sm"}
            className={buttonsActiveCs}
            variant={"ghost"}
            aria-label="previous page"
            disabled={numPages === pageNumber}
          >
            <ChevronDown
              className="w-4 h-4 text-zinc-600"
              onClick={goToNextPage}
            />
          </Button>

          <div className="flex items-center gap-0">
            <Input
              {...register("page")}
              className={cn(
                "md:w-12 w-9 h-8 flex",
                errors.page && "focus-visible:ring-red-500"
              )}
            />
            <p className="text-xs md:text-sm text-zinc-500">
              {" "}
              <span className="ml-1 sm:mx-2">\</span> {numPages}
            </p>
          </div>

          <Button
            size={"sm"}
            className={buttonsActiveCs}
            variant={"ghost"}
            aria-label="next page"
            disabled={pageNumber === 1}
          >
            <ChevronUp
              className="w-4 h-4 text-zinc-600"
              onClick={goToPrevPage}
            />
          </Button>
        </div>

        <div className="flex items-center gap-0 md:gap-5">
          <div className="flex items-center gap-0  rounded-sm">
            <Button variant={"ghost"} className={buttonsActiveCs}>
              <ZoomIn className="w-4 h-4 text-zinc-600" onClick={onZoomIn} />
            </Button>
            <span className="text-sm text-zinc-600 ml-2 md:block hidden">
              {scale * 100} %
            </span>
            <Button variant={"ghost"} className={buttonsActiveCs}>
              <ZoomOut className="w-4 h-4 text-zinc-600" onClick={onZoomOut} />
            </Button>
          </div>

          <Button variant={"ghost"} className={buttonsActiveCs}>
            <RotateCw className="w-4 h-4 text-zinc-600" onClick={onRotate} />
          </Button>

          <FullscreenPDF file={file} />
        </div>
      </div>

      <div className="w-full h-full">
        <Simplebar className="lg:min-h-[calc(100vh-10rem)] min-h-[calc(100vh-9rem)] lg:max-h-[calc(100vh-10rem)] max-h-[calc(100vh-9rem)]">
          {/* <DocViewer
            documents={[
              {
                uri: file.url,
              },
            ]}
            theme={{ tertiary: "#ffffff" }}
            config={{
              header: {
                disableFileName: true,
                disableHeader: true,
                retainURLParams: true,
              },

              loadingRenderer: {
                overrideComponent: PDFLoadingState,
              },
            }}
            activeDocument={{ uri: file.url }}
            pluginRenderers={DocViewerRenderers}
          /> */}
          <div ref={ref}>
            <Document
              file={file}
              onLoadError={onLoadError}
              loading={PDFLoadingState}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              <Page
                pageNumber={pageNumber}
                width={width ?? 1}
                rotate={rotation}
                scale={scale}
              />
            </Document>
          </div>
        </Simplebar>
      </div>
    </div>
  );
};
