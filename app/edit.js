import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea_editor";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Scene = ({ scene, index, setData }) => {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState([]);
  const [currentMedia, setCurrentMedia] = useState(scene.media_url);
  const [isVideo, setIsVideo] = useState(scene.type === "stock_video");
  const [isHidden, setIsHidden] = useState(false);

  const handleSearch = () => {
    const options = {
      method: "GET",
      url: "https://api.pexels.com/v1/search",
      params: { query: query, per_page: 3, orientation: "landscape" },
      headers: {
        Authorization:
          "rY45whYaT18diaLaKgUp9vNwxrThLTzQ3kOktmcbkKZjvbSwDPEPBKa6",
      },
    };
    axios
      .request(options)
      .then((response) => {
        setPhotos(response.data.photos);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    !isHidden && (
      <div className="w-full h-full">
        <div className="bg-secondary w-full rounded-lg px-8 py-2 pb-6 my-4 mb-6">
          <h1 className="text-2xl font-bold py-4 text-primary">
            Scene {index + 1}
          </h1>
          {isVideo ? (
            <video
              src={currentMedia}
              width={400}
              height={200}
              className="rounded-lg"
              controls
            />
          ) : (
            <Image
              src={currentMedia}
              width={400}
              height={200}
              className="rounded-lg"
            />
          )}
          <p className="text-xl mt-4 font-semibold">Script</p>
          <Textarea
            className="mb-4 mt-2"
            defaultValue={scene.script}
            onChange={(e) => {
              const newScript = e.target.value;
              setData((prevData) => {
                const newScenes = [...prevData.script.scenes];
                newScenes[index] = {
                  ...newScenes[index],
                  script: newScript,
                };
                return {
                  ...prevData,
                  script: {
                    ...prevData.script,
                    scenes: newScenes,
                  },
                };
              });
            }}
          />
          {scene.text_overlay && (
            <div className="my-2">
              <p className="text-xl mt-4 font-semibold">Text Overlay</p>
              <Input
                className="mb-4 mt-2"
                defaultValue={scene.text_overlay.content}
                onChange={(e) => {
                  const newTextOverlay = e.target.value;
                  setData((prevData) => {
                    const newScenes = [...prevData.script.scenes];
                    newScenes[index] = {
                      ...newScenes[index],
                      text_overlay: {
                        ...newScenes[index].text_overlay,
                        content: newTextOverlay,
                      },
                      edited: "true",
                    };
                    return {
                      ...prevData,
                      script: {
                        ...prevData.script,
                        scenes: newScenes,
                      },
                    };
                  });
                }}
              />
            </div>
          )}
          <div className="flex justify-end space-x-4 mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Change media</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[1000px]">
                <DialogHeader>
                  <DialogTitle>Search for a stock footage</DialogTitle>
                  <DialogDescription>
                    Change your media to a stock footage in pexel.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4 mx-auto">
                    <Label htmlFor="name" className="text-right">
                      Query
                    </Label>
                    <Input
                      id="name"
                      placeholder="Japanese mountains"
                      className="col-span-2 w-[400px]"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                      }}
                    />
                  </div>
                  <Button onClick={handleSearch}>Search</Button>
                </div>
                <DialogClose asChild>
                  <div className="flex space-x-4">
                    {photos.map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() => {
                          setData((prevData) => {
                            const newScenes = [...prevData.script.scenes];
                            newScenes[index] = {
                              ...newScenes[index],
                              media_url: photo.src.medium,
                              type: "stock_photo",
                              edited: "true",
                            };
                            return {
                              ...prevData,
                              script: {
                                ...prevData.script,
                                scenes: newScenes,
                              },
                            };
                          });
                          setCurrentMedia(photo.src.medium);
                          setIsVideo(false);
                        }}
                        className="w-full flex justify-center"
                      >
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={photo.src.medium}
                            alt={photo.alt}
                            className="w-full object-cover"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Button
              className="bg-red-500 my-auto"
              onClick={() => {
                setData((prevData) => {
                  const newScenes = [...prevData.script.scenes];
                  newScenes.splice(index, 1); // Remove the scene from the array
                  return {
                    ...prevData,
                    script: {
                      ...prevData.script,
                      scenes: newScenes,
                    },
                  };
                });
                // Ensure isHidden is set after state update
                setTimeout(() => setIsHidden(true), 0);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

export function Edit({ scriptData, setVideoUrl }) {
  const [data, setData] = useState(scriptData);
  const [useSubtitles, setUseSubtitles] = useState(true);
  const [useMusic, setUseMusic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleEdit = (data) => {
    setLoading(true);

    delete data.signed_url;
    data.script.subtitleInput = useSubtitles;
    data.script.musicInput = useMusic;
    console.log(data.script);
    axios
      .post(`${process.env.NEXT_PUBLIC_HOST_URL}/v1/edit-video`, data.script, {
        withCredentials: true,
      })
      .then(function (response) {
        console.log("Edited video signed URL:", response.data.signed_url);
        setVideoUrl(response.data.signed_url);
        setLoading(false);
      })
      .catch(function (error) {
        if (error.response) {
          console.error("Error editing video:", error.response.data);
        } else {
          console.error("Error editing video:", error.message);
        }
      });
  };

  if (!scriptData) {
    return <div>No script data available.</div>;
  }

  return (
    <div>
      <div className="py-4">
        <h1 className="text-2xl font-bold py-4">Edit your video</h1>
        {data.script.scenes.map((scene, index) => (
          <Scene
            key={`${index}-${scene.media_url}`}
            scene={scene}
            index={index}
            setData={setData}
          />
        ))}
        <h1 className="text-3xl font-semibold">Final fine-tuning</h1>
        <div className="mb-4 font-medium text-xl">
          <div className="flex space-x-4 items-center justify-between w-64">
            <p>Add subtitles</p>
            <Checkbox
              checked={useSubtitles}
              onCheckedChange={(checked) => setUseSubtitles(checked)}
            />
          </div>
          <div className="flex space-x-4 items-center justify-between w-64">
            <p>Use music</p>
            <Checkbox
              checked={useMusic}
              onCheckedChange={(checked) => setUseMusic(checked)}
            />
          </div>
        </div>
        <Link href={data.signed_url} download>
          <Button className="w-full my-2">Download</Button>
        </Link>
        <Button
          onClick={() => {
            handleEdit(data);
          }}
          className="w-full h-12"
        >
          {!loading ? (
            "Save changes"
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
    </div>
  );
}
