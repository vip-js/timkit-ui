import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@timui/react";
export default function SelectMenuWithSearchBox() {
  // You can use any api to generate list of countries
  const menuItems = [
    "United States of America",
    "Albania",
    "Algeria",
    "Andorra",
    "Argentina",
    "Armenia",
    "Austria",
    "Australia",
    "Azerbaijan",
    "Bahamas",
    "Brazil",
    "Canada",
    "Colombia",
    "China",
    "Egypt",
    "France",
    "Germany",
    "India",
    "Iraq",
  ];

  const [value, setValue] = React.useState("");
  const [countries, setCountries] = React.useState(menuItems);
  const handleSearch = (e) => {
    const value = e.target.value;
    const results = menuItems.filter((item) =>
      item.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );
    setTimeout(() => setCountries(results), 100);
  };
  return (
    <div className="m-6">
      <Select
        onValueChange={setValue}
        onOpenChange={() => setCountries(menuItems)}
      >
        <div className="w-72 max-w-full mx-auto">
          <SelectTrigger className="w-full inline-flex items-center justify-between px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
            <SelectValue placeholder="Select your country">
              {value}
            </SelectValue>
            
          </SelectTrigger>
          <SelectContent
              className="w-full overflow-hidden mt-3 bg-white border rounded-lg shadow-sm text-sm"
            >
              <div className="shadow flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mx-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  className="p-2 text-gray-500 w-full rounded-md outline-none"
                  onInput={handleSearch}
                />
              </div>
              {countries.length < 1 ? (
                  <div className="px-3 py-2 text-gray-600">Nothing found.</div>
                ) : (
                  ""
                )}
    <SelectItem value='United States of America'>
      United States of America
    </SelectItem>
    <SelectItem value='Albania'>
      Albania
    </SelectItem>
    <SelectItem value='Algeria'>
      Algeria
    </SelectItem>
    <SelectItem value='Andorra'>
      Andorra
    </SelectItem>
    <SelectItem value='Argentina'>
      Argentina
    </SelectItem>
    <SelectItem value='Armenia'>
      Armenia
    </SelectItem>
    <SelectItem value='Austria'>
      Austria
    </SelectItem>
    <SelectItem value='Australia'>
      Australia
    </SelectItem>
    <SelectItem value='Azerbaijan'>
      Azerbaijan
    </SelectItem>
    <SelectItem value='Bahamas'>
      Bahamas
    </SelectItem>
    <SelectItem value='Brazil'>
      Brazil
    </SelectItem>
    <SelectItem value='Canada'>
      Canada
    </SelectItem>
    <SelectItem value='Colombia'>
      Colombia
    </SelectItem>
    <SelectItem value='China'>
      China
    </SelectItem>
    <SelectItem value='Egypt'>
      Egypt
    </SelectItem>
    <SelectItem value='France'>
      France
    </SelectItem>
    <SelectItem value='Germany'>
      Germany
    </SelectItem>
    <SelectItem value='India'>
      India
    </SelectItem>
    <SelectItem value='Iraq'>
      Iraq
    </SelectItem>
              </SelectContent>
          </div>
      </Select>
    </div>
  );
};
        