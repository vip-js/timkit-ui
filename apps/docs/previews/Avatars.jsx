import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@timui/react";
export default function Avatars() {
  return <div className="py-16 flex items-center justify-center gap-x-12">
    <Avatar className="bg-white h-6 w-6 overflow-hidden rounded-full">
      <AvatarImage
        src="https://randomuser.me/api/portraits/women/79.jpg"
        className="object-cover"
      />
      <AvatarFallback delayMs={600}>CT</AvatarFallback>
    </Avatar>
    <Avatar className="bg-white h-8 w-8 overflow-hidden rounded-full">
      <AvatarImage
        src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg"
        className="object-cover"
      />
      <AvatarFallback delayMs={600}>CT</AvatarFallback>
    </Avatar>
    <Avatar className="bg-white h-10 w-10 overflow-hidden rounded-full">
      <AvatarImage
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f"
        className="object-cover"
      />
      <AvatarFallback delayMs={600}>CT</AvatarFallback>
    </Avatar>
    <Avatar className="bg-white h-12 w-12 overflow-hidden rounded-full">
      <AvatarImage
        src="https://randomuser.me/api/portraits/men/86.jpg"
        className="object-cover"
      />
      <AvatarFallback delayMs={600}>CT</AvatarFallback>
    </Avatar>
    <Avatar className="bg-white h-16 w-16 overflow-hidden rounded-full">
      <AvatarImage
        src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e"
        className="object-cover"
      />
      <AvatarFallback delayMs={600}>CT</AvatarFallback>
    </Avatar>
  </div>
}
        