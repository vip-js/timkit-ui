import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@timui/react";
export default function AvatarGroupStacked() {
const avatarData = [
  {
    name: "CT",
    imgURL: "https://randomuser.me/api/portraits/women/79.jpg",
  },
  {
    name: "CT",
    imgURL: "https://randomuser.me/api/portraits/med/men/75.jpg",
  },
  {
    name: "CT",
    imgURL:
      "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80",
  },
  {
    name: "CT",
    imgURL: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg",
  },
];
  return <div className="pt-16 flex items-center justify-center -space-x-2 ">
    {avatarData.map((item, idx) => {
      return (
        <Avatar
          key={idx}
          className="bg-white border-2 border-white h-10 w-10 flex items-center justify-center overflow-hidden rounded-full"
        >
          <AvatarImage src={item.imgURL} className="object-cover" />
          <AvatarFallback delayMs={600}>{item.name}</AvatarFallback>
        </Avatar>
      );
    })}
  </div>
}
        