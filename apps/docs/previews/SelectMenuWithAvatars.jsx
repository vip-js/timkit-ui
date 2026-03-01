import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@timui/react";
export default function SelectMenuWithAvatars() {
  const [selectedItemIdx, setSelectedItemIdx] = React.useState(0);
  const menuItems = [
    {
      name: "Danya",
      label: "@danya",
      avatar: "https://randomuser.me/api/portraits/women/79.jpg",
    },
    {
      name: "Osama",
      label: "@osama",
      avatar: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg",
    },
    {
      name: "Loyan",
      label: "@loyan",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg",
    },
    {
      name: "Carllose",
      label: "@carllose",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f",
    },
    {
      name: "Micheal",
      label: "@micheal",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    },
  ];
  return (
    <div className="m-6">
      <Select onValueChange={setSelectedItemIdx}>
        <div className="w-72 max-w-full mx-auto">
          <SelectTrigger className="w-full inline-flex items-center justify-between px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
            <SelectValue placeholder="Select a member">
              <div className="flex items-center gap-2">
                <img
                  src={menuItems[selectedItemIdx].avatar}
                  className="w-5 h-5 rounded-full"
                />
                <div className="flex-1 text-left flex items-center gap-x-1">
                  {menuItems[selectedItemIdx].name}
                  <span>{menuItems[selectedItemIdx].label}</span>
                </div>
              </div>
            </SelectValue>

          </SelectTrigger>
          <SelectContent
            className="w-full max-h-64 mt-3 overflow-y-auto bg-white border rounded-lg shadow-sm text-sm"
          >
            <SelectItem value='0'>
              <img src='https://randomuser.me/api/portraits/women/79.jpg' className='w-5 h-5 rounded-full' />
              <div className='flex-1 text-left flex items-center gap-x-1'>
                Danya
                <span className='text-sm'>@danya</span>
              </div>
            </SelectItem>
            <SelectItem value='1'>
              <img src='https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg' className='w-5 h-5 rounded-full' />
              <div className='flex-1 text-left flex items-center gap-x-1'>
                Osama
                <span className='text-sm'>@osama</span>
              </div>
            </SelectItem>
            <SelectItem value='2'>
              <img src='https://randomuser.me/api/portraits/men/86.jpg' className='w-5 h-5 rounded-full' />
              <div className='flex-1 text-left flex items-center gap-x-1'>
                Loyan
                <span className='text-sm'>@loyan</span>
              </div>
            </SelectItem>
            <SelectItem value='3'>
              <img src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f' className='w-5 h-5 rounded-full' />
              <div className='flex-1 text-left flex items-center gap-x-1'>
                Carllose
                <span className='text-sm'>@carllose</span>
              </div>
            </SelectItem>
            <SelectItem value='4'>
              <img src='https://randomuser.me/api/portraits/men/46.jpg' className='w-5 h-5 rounded-full' />
              <div className='flex-1 text-left flex items-center gap-x-1'>
                Micheal
                <span className='text-sm'>@micheal</span>
              </div>
            </SelectItem>
          </SelectContent>
        </div>
      </Select>
    </div>
  );
};
