import React from "react";
import { Avatar, AvatarImage, AvatarFallback, Button } from "@timui/react";
export default function AvatarGroupStackedWithJoinButton() {
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
    imgURL: "https://randomuser.me/api/portraits/men/18.jpg",
  },
  {
    name: "CT",
    imgURL: "https://randomuser.me/api/portraits/med/men/36.jpg",
  },
  {
    name: "CT",
    imgURL: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg",
  },
];
  return <div className="py-16 flex items-center justify-center -space-x-2 overflow-hidden">
    {avatarData.map((item, idx) => {
      return (
        <Avatar
          key={idx}
          className="bg-white border-2 border-white h-10 w-10 flex items-center justify-center overflow-hidden rounded-full"
        >
          <AvatarImage
            src={item.imgURL}
            className="h-full w-full object-cover"
          />
          <AvatarFallback delayMs={600}>{item.name}</AvatarFallback>
        </Avatar>
      );
    })}
    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-50 text-gray-600 text-xs font-medium">
      +100
    </div>
    <Button
      variant="outline"
      className="translate-x-5 w-10 h-10 rounded-full border-dashed p-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
      </svg>
    </Button>
  </div>
}
        