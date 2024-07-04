"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";

import { Styling } from "./styling";
import { Description } from "./description";
import { Media } from "./media";
import { Edit } from "./edit";
import axios from "axios";
import { Suspense } from "react";

export default function Home() {
  const [stage, setStage] = useState(1);
  const [imageSrc, setImageSrc] = useState("/writing.jpg");

  const [videoUrl, setVideoUrl] = useState("");
  const [scenes, setScenes] = useState();

  const [files, setFiles] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState("promotional");
  const [duration, setDuration] = useState(5);
  const [orientation, setOrientation] = useState("landscape");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stage === 1) {
      setImageSrc("/writing.jpg");
    } else if (stage === 2) {
      setImageSrc("/hand.jpg");
    } else if (stage === 3) {
      setImageSrc("/like.jpg");
    }
  }, [stage]);

  useEffect(() => {
    if (stage == 4) {
      console.info(title, description, template, duration, orientation);
      const uploadData = async () => {
        try {
          setLoading(true);
          const formData = new FormData();
          formData.append("title", title);
          formData.append("description", description);
          formData.append("template", template);
          formData.append("duration", duration);
          formData.append("orientation", orientation);
          formData.append("use_stock_media", "true");
          files.forEach((file) => {
            formData.append(`media`, file);
          });

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_HOST_URL}/v1/generate-video`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log(response.data);
          setVideoUrl(response.data.signed_url);
          setScenes(response.data);
          setLoading(false);
          setStage(5);
        } catch (error) {
          console.error("Error uploading data:", error);
          setStage(6);
        }
      };

      uploadData();
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
                  "bg-primary text-white": stage == 5,
                  "bg-slate-100": stage != 5,
                }
              )}
            >
              4
            </div>
            <div className="font-semibold pr-4">Edit</div>
          </div>
        </div>
        {stage == 1 && (
          <Description
            setStage={setStage}
            stage={stage}
            setTitle={setTitle}
            title={title}
            setDescription={setDescription}
            description={description}
          />
        )}
        {stage == 2 && (
          <Styling
            setStage={setStage}
            stage={stage}
            selectedValue={template}
            setSelectedValue={setTemplate}
            duration={duration}
            setDuration={setDuration}
            orientation={orientation}
            setOrientation={setOrientation}
          />
        )}
        {stage == 3 ? (
          <Media
            setStage={setStage}
            stage={stage}
            setFile={setFiles}
            loading={false}
          />
        ) : (
          <></>
        )}
        {stage == 4 ? (
          <Media
            setStage={setStage}
            stage={stage}
            setFile={setFiles}
            loading={true}
          />
        ) : (
          <></>
        )}
        {stage == 5 && <Edit scriptData={scenes} setVideoUrl={setVideoUrl} />}
        {stage == 6 && (
          <div className="pt-8 text-2xl font-semibold text-red-500">
            An error occurred while generating your video, please refresh the
            website and try again.
          </div>
        )}
      </div>
      <div className="my-auto">
        {stage < 5 && (
          <div className="flex items-center justify-center">
            <Image src={imageSrc} alt="Writing" width="800" height="800" />
          </div>
        )}
      </div>
      <div>
        {stage === 5 && (
          <Suspense fallback={<p>Loading video...</p>}>
            <iframe
              src={videoUrl}
              alt="Video generated"
              allowfullscreen="1"
              width="600"
              height="338"
              className="rounded-lg fixed top-[227px] left-[700px]"
            />
          </Suspense>
        )}
      </div>
    </main>
  );
}
