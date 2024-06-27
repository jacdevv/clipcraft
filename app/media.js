import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

export function Media({ setStage, stage, setFile }) {
  const [media, setMedia] = useState([]);
  const [files, setFiles] = useState([]);

  const handleMediaUpload = (event) => {
    const selectedFiles = event.target.files;
    const newMedia = [];
    const newFiles = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      newFiles.push(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newMedia.push({ type: "image", src: reader.result });
          if (newMedia.length === selectedFiles.length) {
            setMedia((prevMedia) => [...prevMedia, ...newMedia]);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.onloadeddata = () => {
          video.currentTime = video.duration / 2;
        };
        video.onseeked = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL("image/png");
          newMedia.push({ type: "video", src: thumbnail });
          if (newMedia.length === selectedFiles.length) {
            setMedia((prevMedia) => [...prevMedia, ...newMedia]);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
          }
          URL.revokeObjectURL(video.src);
        };
      }
    }
  };

  const handleMediaRemove = (indexToRemove) => {
    setMedia((prevMedia) =>
      prevMedia.filter((_, index) => index !== indexToRemove)
    );
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async () => {
    setFile(files);
    setStage(stage + 1);
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold py-4">Upload your media</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 50 50"
                  className="text-primary fill-current"
                >
                  <path d="M 25 3 C 16.726563 3 10 9.726563 10 18 C 10 23.058594 11.929688 26.066406 13.75 28.15625 C 14.660156 29.203125 15.539063 30.046875 16.125 30.8125 C 16.710938 31.578125 17 32.195313 17 33 L 17 43 C 17 44.644531 18.355469 46 20 46 L 21.15625 46 C 21.601563 47.71875 23.148438 49 25 49 C 26.851563 49 28.398438 47.71875 28.84375 46 L 30 46 C 31.644531 46 33 44.644531 33 43 L 33 33 C 33 31.871094 33.332031 31.089844 33.90625 30.28125 C 34.480469 29.472656 35.34375 28.667969 36.25 27.6875 C 38.058594 25.722656 40 22.964844 40 18 C 40 9.726563 33.273438 3 25 3 Z M 25 5 C 32.191406 5 38 10.808594 38 18 C 38 22.46875 36.441406 24.511719 34.75 26.34375 C 33.90625 27.261719 33.019531 28.089844 32.28125 29.125 C 31.542969 30.160156 31 31.4375 31 33 L 31 38 L 19 38 L 19 33 C 19 31.652344 18.414063 30.539063 17.6875 29.59375 C 16.960938 28.648438 16.089844 27.804688 15.25 26.84375 C 13.570313 24.917969 12 22.574219 12 18 C 12 10.808594 17.808594 5 25 5 Z M 20.90625 17.96875 C 20.863281 17.976563 20.820313 17.988281 20.78125 18 C 20.40625 18.066406 20.105469 18.339844 20 18.703125 C 19.894531 19.070313 20.003906 19.460938 20.28125 19.71875 L 24 23.4375 L 24 36 L 26 36 L 26 23.4375 L 29.71875 19.71875 C 30.117188 19.320313 30.117188 18.679688 29.71875 18.28125 C 29.320313 17.882813 28.679688 17.882813 28.28125 18.28125 L 25 21.5625 L 21.71875 18.28125 C 21.511719 18.058594 21.210938 17.945313 20.90625 17.96875 Z M 19 40 L 31 40 L 31 43 C 31 43.554688 30.554688 44 30 44 L 22.1875 44 C 22.054688 43.972656 21.914063 43.972656 21.78125 44 L 20 44 C 19.445313 44 19 43.554688 19 43 Z M 23.28125 46 L 26.71875 46 C 26.375 46.597656 25.746094 47 25 47 C 24.253906 47 23.625 46.597656 23.28125 46 Z"></path>
                </svg>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click the image or video to remove them</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input
            id="picture"
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaUpload}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 w-full h-[400px] bg-secondary my-4 rounded-lg p-2">
          {media.length > 0 ? (
            media.map((item, index) => (
              <img
                key={index}
                src={item.src}
                alt={`Thumbnail ${index}`}
                className="w-full h-auto rounded-lg cursor-pointer"
                onClick={() => handleMediaRemove(index)}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
      <Button onClick={handleSubmit}>Next</Button>
    </div>
  );
}
