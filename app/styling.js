import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import clsx from "clsx";
import { useState } from "react";

const { Label } = require("@/components/ui/label");
const { RadioGroup, RadioGroupItem } = require("@/components/ui/radio-group");

export function Styling({
  setStage,
  stage,
  selectedValue,
  setSelectedValue,
  duration,
  setDuration,
  orientation,
  setOrientation,
  useStockFootage,
  setUseStockFootage,
}) {
  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const handleDuration = (value) => {
    setDuration(value);
  };

  const handleOrientation = (value) => {
    setOrientation(value.toLowerCase());
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl font-bold py-4">Select a template</h1>
        <RadioGroup value={selectedValue} onValueChange={handleChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="promotional" id="r1" />
            <Label htmlFor="r1" className="text-lg">
              Promotional
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="travel" id="r4" />
            <Label htmlFor="r4" className="text-lg">
              Travel
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="journalistic" id="r5" />
            <Label htmlFor="r5" className="text-lg">
              Journalistic
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="educational" id="r2" />
            <Label htmlFor="r2" className="text-lg">
              Educational
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Vlog" id="r6" />
            <Label htmlFor="r6" className="text-lg">
              Vlog
            </Label>
          </div>
        </RadioGroup>
        <h1 className="text-2xl font-bold py-4">Select an orientation</h1>
        <RadioGroup
          value={orientation}
          onValueChange={handleOrientation}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="landscape" id="r1" />
            <Label htmlFor="r1" className="text-lg">
              Landscape
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="potrait" id="r4" />
            <Label htmlFor="r4" className="text-lg">
              Potrait
            </Label>
          </div>
        </RadioGroup>
        <h1 className="text-2xl font-bold py-4">
          Pick a duration estimate (Seconds)
        </h1>
        <div className="flex space-x-4 justify-center items-center">
          <Slider
            defaultValue={[5]}
            max={20}
            step={1}
            onChange={handleDuration}
            className={clsx("flex-shrink")}
          />
        </div>
        <div className="flex justify-between py-4">
          <div>10</div>
          <div>20</div>
          <div>30</div>
          <div>40</div>
          <div>50</div>
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-2">
        <div className="text-xl font-bold">Use stock footage </div>
        <Checkbox
          onChange={(checked) => setUseStockFootage(checked)}
          checked={useStockFootage}
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
