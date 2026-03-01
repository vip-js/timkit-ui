import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@timui/react";
export default function DefaultSelectMenu() {
  return (
    <div className="w-72 max-w-full mx-auto mt-12">
      <Select defaultValue="Project manager">
        <SelectTrigger className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
          <SelectValue placeholder="Select your job" />
        </SelectTrigger>
        <SelectContent className="w-full bg-white text-sm">
          <SelectItem value="Project manager">Project manager</SelectItem>
          <SelectItem value="Software engineer">Software engineer</SelectItem>
          <SelectItem value="IT manager">IT manager</SelectItem>
          <SelectItem value="UI / UX designer">UI / UX designer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
