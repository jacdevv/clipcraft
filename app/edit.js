import { Button } from "@/components/ui/button";
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
import { useState } from "react";

const Scene = ({ scene, index, setData }) => {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState([]);
  const [currentMedia, setCurrentMedia] = useState(scene.media_url);
  const [isVideo, setIsVideo] = useState(scene.type === "stock_video");

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
        <p>Start Time: {Math.round(scene.start_time)}s</p>
        <p>End Time: {Math.round(scene.end_time)}s</p>
        <div className="flex justify-end space-x-4 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Change media</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[1000px]">
              <DialogHeader>
                <DialogTitle>Search a stock footage</DialogTitle>
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
                            type: "stock_image",
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
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export function Edit({ scriptData, setVideoUrl }) {
  const [data, setData] = useState(scriptData);

  const handleEdit = (data) => {
    console.log(data);
    axios
      .post("http://127.0.0.1:8000/v1/edit-video", {
        scenes: data.script.scenes,
        signed_url: data.signed_url,
      })
      .then(function (response) {
        console.log("Edited video signed URL:", response.data.signed_url);
        setVideoUrl(response.data.signed_url);
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
          <Scene key={index} scene={scene} index={index} setData={setData} />
        ))}
        <Button
          onClick={() => {
            handleEdit(data);
          }}
          className="w-full"
        >
          Finish
        </Button>
      </div>
    </div>
  );
}
