import { FullWidthWrapper } from "@/components/FullWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <FullWidthWrapper className="mb-12 mt-16 sm:mt-32 flex flex-col gap-8 justify-center items-center text-center">
        <div className="flex gap-3 items-center max-w-fit cursor-pointer border-[1px] border-gray-200 bg-white rounded-full p-1 pr-4 transition-all  hover:border-gray-300 hover:bg-white/50">
          <div className="rounded-full sm:py-1 px-4 bg-primary">
            <p className="text-sm font-semibold text-white">New</p>
          </div>

          <p className="text-sm font- text-gray-900">
            Analyeazy Celebrates Public Debut!
          </p>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold  max-w-4xl">
          Chat with your <span className="text-primary">Data</span> in seconds!
        </h1>

        <p className="text-gray-700 text-sm max-w-3xl">
          Analyeazy allows you to have conversations with any form of data.
          Simply upload your data file or give url of a website and start
          analyzing the data right away.
        </p>

        <div>
          <Link
            href={"/dashboard"}
            className={buttonVariants({
              size: "lg",
              className:
                "rounded-full bg-secondary-foreground hover:bg-secondary-foreground/90",
            })}
          >
            Start Analyzing
          </Link>
        </div>
      </FullWidthWrapper>

      <div className="relative isolate -z-50 mt-12">
        <div
          aria-hidden
          className="w-full max-w-xs md:max-w-md lg:max-w-2xl pointer-events-none h-[320px] md:h-[448px] lg:h-[672px] bg-[#ff80b5] rounded-full blur-2xl opacity-10 -translate-y-[30%] -z-50 absolute left-6 top-0"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className=" bg-gray-400/10 p-1 md:p-2 rounded-lg border-[1px] border-slate-950/5">
            <Image
              width={1364}
              height={866}
              src={"/dashboard-preview.jpg"}
              alt="Dashboard Preview Picture"
              className="object-cover object-center rounded-lg border-[1px] border-gray-900/10 shadow-xl"
            />
          </div>
        </div>

        <div
          aria-hidden
          className="w-full max-w-xs md:max-w-md lg:max-w-2xl h-[320px] md:h-[448px] lg:h-[672px] bg-purple-500 rounded-full blur-2xl opacity-10 translate-y-[30%] -z-10 absolute right-6 bottom-0"
        />
      </div>

      <div className="relative pb-12 mt-32 sm:mt-56 isolate max-w-5xl mx-auto px-4 sm:px-8 -z-50">
        <div className="flex flex-col gap-16 md:items-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
              Start analyzing in minutes
            </h2>
            <p className="text-zinc-600 sm:text-lg text-center">
              Analyzing your data files has never been easier than with{" "}
              <span className="text-purple-600">Analyeazy</span>.
            </p>
          </div>

          <ul className="flex max-md:flex-col gap-12 mt-5 sm:mt-8">
            <li>
              <div className="max-md:border-l-[1px] max-md:pl-4 md:border-t-[1px] md:border-slate-300 md:pt-4">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <h3 className="w-6 h-6 aspect-square max-w-fit rounded-full bg-secondary-foreground ring-2 ring-offset-2 ring-secondary-foreground text-primary-foreground font-bold flex justify-center items-center">
                      1
                    </h3>

                    <h4 className="text-xl font-semibold sm:text-2xl">
                      Create an account
                    </h4>
                  </div>

                  <p className="text-zinc-600">
                    {" "}
                    Either starting out with a free plan or choose our{" "}
                    <Link
                      href="/pricing"
                      className="text-purple-700 underline underline-offset-2"
                    >
                      other plans
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </li>

            <li>
              <div className="max-md:border-l-[1px] max-md:pl-4 md:border-t-[1px] md:border-slate-300 md:pt-4">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <h3 className="w-6 h-6 aspect-square max-w-fit rounded-full bg-secondary-foreground ring-2 ring-offset-2 ring-secondary-foreground text-primary-foreground font-bold flex justify-center items-center">
                      2
                    </h3>

                    <h4 className="text-lg sm:text-xl font-semibold">
                      Upload your data file
                    </h4>
                  </div>

                  <p className="text-zinc-600">
                    We&apos;ll process your file and make it ready for you to
                    chat with.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="max-md:border-l-[1px] max-md:pl-4 md:border-t-[1px] md:border-slate-300 md:pt-4">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <h3 className="w-6 h-6 aspect-square max-w-fit rounded-full bg-secondary-foreground ring-2 ring-offset-2 ring-secondary-foreground text-primary-foreground font-bold flex justify-center items-center">
                      3
                    </h3>

                    <h4 className="text-xl sm:text-2xl font-semibold">
                      Start asking questions
                    </h4>
                  </div>

                  <p className="text-zinc-600">
                    It&apos;s that simple. Try out Quill today - it really takes
                    less than a minute.
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className="max-w-5xl mx-auto mt-10 sm:mt-16">
          <div className=" bg-gray-400/10 p-1 md:p-2 rounded-lg border-[1px] border-slate-950/5">
            <Image
              width={1364}
              height={866}
              src={"/dashboard-preview.jpg"}
              alt="Dashboard Preview Picture"
              className="object-cover object-center rounded-lg border-[1px] border-gray-900/10 shadow-xl"
            />
          </div>
        </div>
      </div>
    </>
  );
}
