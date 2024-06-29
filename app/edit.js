import { Button } from "@/components/ui/button";
import {
  Dialog,
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

const Scene = ({ scene, index }) => {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState([]);

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
    <div className="bg-secondary w-full rounded-lg px-8 py-2 pb-6 my-4 mb-6">
      <h1 className="text-xl font-bold py-4 text-primary">Scene {index + 1}</h1>
      <Image src="/duck.jpg" width="400" height="200" className="rounded-lg" />
      <Textarea className="my-4" defaultValue={scene.script} />
      <div className="flex justify-end space-x-4">
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
            <div className="flex space-x-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <img
                    src={photo.src.medium}
                    alt={photo.alt}
                    className="w-full object-cover mx-auto"
                  />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <Button className="bg-red-500 my-auto">Delete</Button>
      </div>
    </div>
  );
};

export function Edit({ scenes }) {
  return (
    <div>
      <div className="py-4">
        <h1 className="text-2xl font-bold py-4">Edit your video</h1>
        {scenes.map((scene, index) => (
          <Scene key={index} scene={scene} index={index} />
        ))}
      </div>
    </div>
  );
}
