import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { COLORS } from "@/helper/chartColors";
import { ResponsiveContainer, Pie, Cell, Tooltip,PieChart } from "recharts";
import {Analytics} from '@/helper/types/types'

type analyticsData = Analytics
const HostelStatus = ({ analyticsData }: { analyticsData: analyticsData }) => {
  const hostelStatusData = [
    { name: "Published", value: analyticsData?.publishedHostels },
    {
      name: "Unpublished",
      value: analyticsData?.verifiedHostels - analyticsData?.publishedHostels,
    },
    { name: "Unverified", value: analyticsData?.unverifiedHostels },
  ];
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Hostel Status</CardTitle>
        <CardDescription className="text-gray-500">
          Overview of hostel verification and publication status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={hostelStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {hostelStatusData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[0] }}
              ></div>
              <span className="text-xs font-medium">Published</span>
            </div>
            <div className="text-lg font-bold">
              {analyticsData && analyticsData.publishedHostels}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[1] }}
              ></div>
              <span className="text-xs font-medium">Verified</span>
            </div>
            <div className="text-lg font-bold">
              {analyticsData && analyticsData.verifiedHostels}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[2] }}
              ></div>
              <span className="text-xs font-medium">Unverified</span>
            </div>
            <div className="text-lg font-bold">
              {analyticsData && analyticsData.unverifiedHostels}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HostelStatus;
