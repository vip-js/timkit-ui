import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@timui/react";
export default function SelectMenuWithIcon() {
  const IconUser = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.7498 6C15.7498 8.07107 14.0709 9.75 11.9998 9.75C9.92877 9.75 8.24984 8.07107 8.24984 6C8.24984 3.92893 9.92877 2.25 11.9998 2.25C14.0709 2.25 15.7498 3.92893 15.7498 6Z"
      stroke="#6B7280"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4.50098 20.1182C4.57128 16.0369 7.90171 12.75 11.9998 12.75C16.0981 12.75 19.4286 16.0371 19.4987 20.1185C17.2159 21.166 14.6762 21.75 12.0002 21.75C9.32384 21.75 6.78394 21.1659 4.50098 20.1182Z"
      stroke="#6B7280"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

  const [selectedItemIdx, setSelectedItemIdx] = React.useState(0);
  const menuItems = [
    {
      name: "Danya",
      label: "@danya",
    },
    {
      name: "Osama",
      label: "@osama",
    },
    {
      name: "Loyan",
      label: "@loyan",
    },
    {
      name: "Carllose",
      label: "@carllose",
    },
    {
      name: "Micheal",
      label: "@micheal",
    },
  ];
  return (
    <div className="m-6">
      <Select onValueChange={setSelectedItemIdx}>
        <div className="w-72 max-w-full mx-auto">
          <SelectTrigger className="w-full inline-flex items-center justify-between px-3 py-2 text-sm bg-white border rounded-lg shadow-sm outline-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
            <SelectValue placeholder="Select a member">
              <div className="flex items-center gap-2 text-gray-500">
                <IconUser />
                <div className="flex-1 text-left flex items-center gap-x-1 text-gray-600">
                  {menuItems[selectedItemIdx].name}
                  <span>{menuItems[selectedItemIdx].label}</span>
                </div>
              </div>
            </SelectValue>
            
          </SelectTrigger>
          <SelectContent
              className="w-full max-h-64 mt-3 overflow-y-auto bg-white border rounded-lg shadow-sm text-sm"
            >
              <SelectItem value='Danya'>
                    <IconUser />
                    <div className='flex-1 text-left flex items-center gap-x-1'>
                      Danya
                      <span className='text-sm'>@danya</span>
                    </div>
                  </SelectItem>
                  <SelectItem value='Osama'>
                    <IconUser />
                    <div className='flex-1 text-left flex items-center gap-x-1'>
                      Osama
                      <span className='text-sm'>@osama</span>
                    </div>
                  </SelectItem>
                  <SelectItem value='Loyan'>
                    <IconUser />
                    <div className='flex-1 text-left flex items-center gap-x-1'>
                      Loyan
                      <span className='text-sm'>@loyan</span>
                    </div>
                  </SelectItem>
                  <SelectItem value='Carllose'>
                    <IconUser />
                    <div className='flex-1 text-left flex items-center gap-x-1'>
                      Carllose
                      <span className='text-sm'>@carllose</span>
                    </div>
                  </SelectItem>
                  <SelectItem value='Micheal'>
                    <IconUser />
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
        