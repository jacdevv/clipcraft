import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

export function Media({ setStage, stage, setFile, loading }) {
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

  const bogusFunction = () => {
    console.log("Loading!");
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
                <p>
                  Click the image or video to remove them.<div></div> Video
                  takes minutes to generate due to cold booting.
                </p>
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
            onChange={!loading ? handleMediaUpload : bogusFunction}
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
      <Button onClick={handleSubmit}>
        {!loading ? (
          "Create Video"
        ) : (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500  "
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </Button>
    </div>
  );
}
