import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarClock, Users } from "lucide-react"
import moment from "moment"
import { CalendarYearT } from "@/helper/types/types"

const CurrentYearCard = ({ currentYear }: { currentYear: CalendarYearT | undefined }) => {
  if (!currentYear) return <p className="text-center">No current calendar year found.</p>

  return (
    <Card className="mb-8 p-4 flex justify-between items-start">
      <div>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarClock className="mr-2 h-5 w-5" />
            Current Calendar Year: <p className="ml-2 ">{currentYear?.name}</p>
          </CardTitle>
          <CardDescription>
            {currentYear?.isActive
              ? "Active calendar year details and financial summary"
              : "This calendar year has ended"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Started on:{" "}
                {currentYear?.startDate
                  ? moment(currentYear?.startDate).format("dddd, MMMM Do YYYY, h:mm:ss a")
                  : "No start date"}
              </p>
              <p className="text-sm text-muted-foreground">
                Ended on: {currentYear?.endDate ? moment(currentYear?.endDate).format("MM/DD/YYYY") : "No end date"}
              </p>
              <span className="flex gap-2 items-start  font-bold bg-black text-white w-fit p-2 rounded">
                <span className="flex gap-2 items-center">
                  <Users/>
                 <h3> Residents</h3>
                  </span> 
                <span>{currentYear?.Residents?.length}</span>
                </span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export default CurrentYearCard