import React, { useState } from "react";

import Dropzone from "react-dropzone";
import { UploadCloud, File, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/utils/uploadthing";

export const UploadFileDropzone = () => {
  const [isUploading, setIsUploading] = useState(true);
  const [uploadingProgress, setUploadingProgress] = useState<number>(0);

  const router = useRouter();
  const { toast } = useToast();
  const { startUpload } = useUploadThing("pdfUploader");

  const { mutate: startPollingProcess } = trpc.getFile.useMutation({
    onSuccess: (data) => {
      router.push(`dashboard/${data.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  let interval: string | number | NodeJS.Timeout | undefined;

  const startProgressInterval = () => {
    interval = setInterval(() => {
      setUploadingProgress((prev) => {
        if (prev < 95) return prev + 5;

        clearInterval(interval);
        return prev;
      });
    }, 400);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setUploadingProgress(0);

    startProgressInterval();

    const res = await startUpload(acceptedFiles);

    if (!res || !res[0].key)
      return toast({
        title: "Something went wrong",
        description: "There were some error uploading file",
        variant: "destructive",
      });

    console.log(res[0]);
    clearInterval(interval);
    setUploadingProgress(100);

    startPollingProcess({ key: res[0].key });
  };

  return (
    <Dropzone multiple={false} onDrop={onDrop}>
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div className="mt-4 w-full flex flex-col" {...getRootProps()}>
          <div className="min-h-64 max-h-64 flex flex-1 rounded-lg border border-dashed border-zinc-300 hover:border-zinc-400 transition-opacity">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="p-2 rounded-full aspect-square max-w-fit bg-white shadow-lg border border-zinc-200">
                <UploadCloud className="h-7 w-7 text-zinc-600" />
              </div>

              <label htmlFor="dropzone-file-input" className="text-center ">
                <h3 className="mt-3 text-lg font-semibold text-zinc-700">
                  Drag & Drop or Select File
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  Upto 4MB of data files
                </p>
              </label>

              {acceptedFiles && acceptedFiles.length > 0 && isUploading && (
                <div className="w-full flex items-center flex-col mt-8">
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-primary/60" />
                    <p className="text-sm text-zinc-600 mt-0.5">
                      {acceptedFiles[0].name}
                    </p>
                  </div>

                  <Progress
                    value={uploadingProgress}
                    className="h-1 max-w-xs w-full mx-auto mt-3"
                    indicatorColor={
                      uploadingProgress === 100 ? "text-green-500" : ""
                    }
                  />

                  {uploadingProgress === 100 && (
                    <div className="mt-1 flex justify-center w-full gap-3">
                      <Loader2 className="text-primary w-5 h-5 animate-spin" />
                      <p className="text-sm text-zinc-500">Redirecting</p>
                    </div>
                  )}
                </div>
              )}

              <input
                id="dropzone-file-input"
                {...getInputProps()}
                type="file"
                hidden
              />
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
};
