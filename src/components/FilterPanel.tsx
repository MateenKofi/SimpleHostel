import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HostetFilterConfig } from "@/helper/hostel_filter_config";

type Props = {
  activeFilters: { [key: string]: string[] };
  handleFilterChange: (category: string, value: string) => void;
};

const FilterPanel = ({ activeFilters, handleFilterChange }: Props) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const filterContent = (
    <div className="space-y-6 ">
      <h2 className="text-lg font-semibold">Filter</h2>
      {HostetFilterConfig.map((filter) => (
        <div className="space-y-2" key={filter.category}>
          <Label className="font-semibold">{filter.label}</Label>
          {filter.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${filter.category}-${option}`}
                checked={activeFilters[filter.category]?.includes(option)}
                onCheckedChange={() =>
                  handleFilterChange(filter.category, option)
                }
              />
              <Label htmlFor={`${filter.category}-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* 🖥️ Desktop Sidebar */}
      <div className="hidden md:block p-4 border bg-white shadow-sm rounded-lg">
        {filterContent}
      </div>

      {/* 📱 Floating filter button on Mobile */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="p-4 bg-primary text-white rounded-full shadow-lg hover:scale-105 transition-all"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 📱 Mobile Filter Modal/Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-end md:hidden">
          <div className="bg-white w-full p-4 rounded-t-2xl max-h-[80%] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="text-gray-600 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
export default FilterPanel