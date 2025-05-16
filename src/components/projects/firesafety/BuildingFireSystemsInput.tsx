
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { SprinklerType } from "../types";

interface BuildingFireSystemsInputProps {
  sprinklerSystem: boolean;
  sprinklerType: SprinklerType;
  fireAlarmRequired: boolean;
  fireAlarmType: string;
  standpipeRequired: boolean;
  emergencyPower: boolean;
  onFireAlarmRequiredChange: (value: boolean) => void;
  onFireAlarmTypeChange: (value: string) => void;
  onStandpipeRequiredChange: (value: boolean) => void;
  onEmergencyPowerChange: (value: boolean) => void;
}

export const BuildingFireSystemsInput = ({
  sprinklerSystem,
  sprinklerType,
  fireAlarmRequired,
  fireAlarmType,
  standpipeRequired,
  emergencyPower,
  onFireAlarmRequiredChange,
  onFireAlarmTypeChange,
  onStandpipeRequiredChange,
  onEmergencyPowerChange
}: BuildingFireSystemsInputProps) => {
  return (
    <div className="space-y-6">
      {/* Sprinkler System Info (Read-only from previous step) */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Sprinkler System</Label>
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border">
          <div className={`h-3 w-3 rounded-full ${sprinklerSystem ? "bg-green-500" : "bg-slate-300"}`}></div>
          <span>{sprinklerSystem ? `Yes (${sprinklerType})` : "No"}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Configured in Building Classification step
        </p>
      </div>

      {/* Fire Alarm System */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch 
              id="fire-alarm-required" 
              checked={fireAlarmRequired}
              onCheckedChange={onFireAlarmRequiredChange}
            />
            <Label htmlFor="fire-alarm-required">Fire Alarm System Required</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-80">
                  <p>Required by IBC 907 based on occupancy and building characteristics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {fireAlarmRequired && (
          <div className="pl-6 border-l-2 border-blue-100">
            <Label htmlFor="fire-alarm-type" className="mb-2 block">Fire Alarm Type</Label>
            <Select value={fireAlarmType} onValueChange={onFireAlarmTypeChange}>
              <SelectTrigger id="fire-alarm-type">
                <SelectValue placeholder="Select fire alarm type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manual">Manual Fire Alarm</SelectItem>
                <SelectItem value="Automatic">Automatic Detection</SelectItem>
                <SelectItem value="Emergency Voice">Emergency Voice/Alarm Communication</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Standpipe System */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="standpipe-required" 
            checked={standpipeRequired}
            onCheckedChange={onStandpipeRequiredChange}
          />
          <Label htmlFor="standpipe-required">Standpipe System Required</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-80">
                <p>Required by IBC 905 for buildings with floors greater than 30&apos; above lowest fire department access</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Emergency Power */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="emergency-power" 
            checked={emergencyPower}
            onCheckedChange={onEmergencyPowerChange}
          />
          <Label htmlFor="emergency-power">Emergency Power System</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-80">
                <p>Required for emergency systems, exit signs, means of egress illumination</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
