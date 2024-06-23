import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Description({ setStage, stage }) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl font-bold py-4">What's your video's title?</h1>
        <Input placeholder="Tokyo Marketing Content" />
        <h1 className="text-2xl font-bold py-4">Describe your video</h1>
        <Textarea
          className="mb-4"
          placeholder="A montage of tokyo's landscape..."
        />
      </div>
      <Button
        onClick={() => {
          setStage(stage + 1);
        }}
      >
        Next
      </Button>
    </div>
  );
}
