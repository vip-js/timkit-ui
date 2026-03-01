import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@timui/react";
export default function AvatarsWithInfo() {
  return <div className="py-16 flex items-center justify-center gap-10">
    {/* Avatar 1 */}
    <Avatar className="flex items-center space-x-3">
      <AvatarImage
        src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e"
        className="w-12 h-12 rounded-full object-cover"
      />
      <AvatarFallback
        delayMs={600}
        className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center"
      >
        CT
      </AvatarFallback>
      <div>
        <span className="text-gray-700 text-sm font-medium">Jane Smith</span>
        <span className="block text-gray-700 text-xs">
          janesmith@example.com
        </span>
      </div>
    </Avatar>
    {/* Avatar 2 */}
    <Avatar className="flex items-center space-x-3">
      <AvatarImage
        src="https://randomuser.me/api/portraits/women/79.jpg"
        className="w-16 h-16 rounded-full object-cover"
      />
      <AvatarFallback
        delayMs={600}
        className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center"
      >
        CT
      </AvatarFallback>
      <div>
        <span className="text-gray-700 text-sm font-medium">Nikita Andrew</span>
        <span className="block text-gray-700 text-xs">
          nikitaandrew@example.com
        </span>
      </div>
    </Avatar>
  </div>
}
        