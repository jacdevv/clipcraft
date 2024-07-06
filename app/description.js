import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Description({
  setStage,
  stage,
  setTitle,
  title,
  setDescription,
  description,
}) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <Alert>
          <AlertTitle className="font-semibold text-lg">
            ⚠️ Heads up!
          </AlertTitle>
          <AlertDescription>
            Please use chrome, otherwise the video might be buggy.
          </AlertDescription>
        </Alert>
        <h1 className="text-2xl font-bold py-4">
          What&apos;s your video&apos;s title?
        </h1>
        <Input
          placeholder="Tokyo Marketing Content"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <h1 className="text-2xl font-bold py-4">Describe your video</h1>
        <Textarea
          className="mb-4"
          placeholder="A montage of tokyo's landscape..."
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
      </div>
      <Button
        onClick={() => {
          if (title != "" && description != "") {
            setStage(stage + 1);
          }
        }}
      >
        Next
      </Button>
    </div>
  );
}
