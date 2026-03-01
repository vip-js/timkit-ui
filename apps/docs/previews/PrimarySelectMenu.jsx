import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@timui/react";
export default function PrimarySelectMenu() {
  const menuItems = [
    "Software engineer",
    "Project manager",
    "IT manager",
    "UI / UX designer",
    "Full-stack engineer",
    "Front-end enginner",
    "Marketing manager",
    "embded system enginner",
  ];
  return (
    <Select>
      <div className="w-72 max-w-full mx-auto">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your job" />
        </SelectTrigger>
        <SelectContent className="w-full bg-white text-sm">
          <SelectItem value='Software engineer'>
            Software engineer
          </SelectItem>
          <SelectItem value='Project manager'>
            Project manager
          </SelectItem>
          <SelectItem value='IT manager'>
            IT manager
          </SelectItem>
          <SelectItem value='UI / UX designer'>
            UI / UX designer
          </SelectItem>
          <SelectItem value='Full-stack engineer'>
            Full-stack engineer
          </SelectItem>
          <SelectItem value='Front-end enginner'>
            Front-end enginner
          </SelectItem>
          <SelectItem value='Marketing manager'>
            Marketing manager
          </SelectItem>
          <SelectItem value='embded system enginner'>
            embded system enginner
          </SelectItem>
        </SelectContent>
      </div>
    </Select>
  );
};
