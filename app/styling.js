import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import clsx from "clsx";

const { Label } = require("@/components/ui/label");
const { RadioGroup, RadioGroupItem } = require("@/components/ui/radio-group");

export function Styling({ setStage, stage }) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl font-bold py-4">Select a template</h1>
        <RadioGroup defaultValue="comfortable">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="r1" />
            <Label htmlFor="r1" className="text-lg">
              Promotional
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="business" id="r4" />
            <Label htmlFor="r4" className="text-lg">
              Business
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="educational" id="r5" />
            <Label htmlFor="r5" className="text-lg">
              Educational
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="travel" id="r2" />
            <Label htmlFor="r2" className="text-lg">
              Travel
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Vlog" id="r6" />
            <Label htmlFor="r6" className="text-lg">
              Vlog
            </Label>
          </div>
        </RadioGroup>
        <h1 className="text-2xl font-bold py-4">Pick a duration (Minutes)</h1>
        <div className="flex space-x-4 justify-center items-center">
          <Slider
            defaultValue={[10]}
            max={20}
            step={1}
            className={clsx("flex-shrink")}
          />
        </div>
        <div className="flex justify-between py-4">
          <div>0</div>
          <div>5</div>
          <div>10</div>
          <div>15</div>
          <div>20</div>
        </div>
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
