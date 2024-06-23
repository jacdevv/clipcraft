"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";

import { Styling } from "./styling";
import { Description } from "./description";
import { Media } from "./media";

export default function Home() {
  const [stage, setStage] = useState(1);
  const [imageSrc, setImageSrc] = useState("/writing.jpg");

  useEffect(() => {
    if (stage === 1) {
      setImageSrc("/writing.jpg");
    } else if (stage === 2) {
      setImageSrc("/hand.jpg");
    } else if (stage === 3) {
      setImageSrc("/like.jpg");
    }
  }, [stage]);
  return (
    <main className="w-screen h-screen grid grid-cols-2">
      <div className="flex flex-col space-y-4 p-10">
        <div className="flex space-x-1">
          <div>✨</div>
          <h1 className="text-gray-500 font-semibold text-lg">
            Generate Content
          </h1>
        </div>
        <div className="flex items-center">
          <div className="space-x-2 flex items-center">
            <div
              className={clsx(
                "rounded-full w-8 h-8 grid place-items-center font-bold",
                {
                  "bg-primary text-white": stage == 1,
                  "bg-slate-100": stage != 1,
                }
              )}
            >
              1
            </div>
            <div className="font-semibold pr-4">Description</div>
          </div>
          <div className="h-[1px] w-8 bg-gray-200 mr-4"></div>
          <div className="space-x-2 flex items-center">
            <div
              className={clsx(
                "rounded-full w-8 h-8 grid place-items-center font-bold",
                {
                  "bg-primary text-white": stage == 2,
                  "bg-slate-100": stage != 2,
                }
              )}
            >
              2
            </div>
            <div className="font-semibold pr-4">Template</div>
          </div>
          <div className="h-[1px] w-8 bg-gray-200 mr-4"></div>
          <div className="space-x-2 flex items-center">
            <div
              className={clsx(
                "rounded-full w-8 h-8 grid place-items-center font-bold",
                {
                  "bg-primary text-white": stage == 3,
                  "bg-slate-100": stage != 3,
                }
              )}
            >
              3
            </div>
            <div className="font-semibold pr-4">Media</div>
          </div>
          <div className="h-[1px] w-8 bg-gray-200 mr-4"></div>
          <div className="space-x-2 flex items-center">
            <div
              className={clsx(
                "rounded-full w-8 h-8 grid place-items-center font-bold",
                {
                  "bg-primary text-white": stage == 4,
                  "bg-slate-100": stage != 4,
                }
              )}
            >
              4
            </div>
            <div className="font-semibold pr-4">Export</div>
          </div>
        </div>
        {stage == 1 && <Description setStage={setStage} stage={stage} />}
        {stage == 2 && <Styling setStage={setStage} stage={stage} />}
        {stage == 3 && <Media setStage={setStage} stage={stage} />}
      </div>
      <div className="grid place-items-center">
        <Image src={imageSrc} alt="Writing" width="800" height="800" />
      </div>
    </main>
  );
}
