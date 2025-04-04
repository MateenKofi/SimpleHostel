import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History, Users } from "lucide-react"
import {CalendarYearT} from "@/helper/types/types"

const HistoricalYearsList = ({ historicalYears }: { historicalYears: CalendarYearT[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <History className="mr-2 h-5 w-5" />
        Historical Calendar Years
      </CardTitle>
      <CardDescription>Previous calendar years and their financial summaries</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-4">
        {historicalYears.length > 0 ? (
          historicalYears.map((year) => (
            <div key={year.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h3 className="font-semibold">{year.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Started on {new Date(year.startDate).toLocaleDateString()}
                </p>
                {year.endDate && (
                  <p className="text-sm text-muted-foreground">
                    Ended on {new Date(year.endDate).toLocaleDateString()}
                  </p>
                )}
                <span className="flex gap-2 items-start text-sm text-muted-foreground font-bold bg-black text-white w-fit p-1 rounded">
                <span className="flex gap-2 items-center">
                  <Users/>
                 <h3> Residents</h3>
                  </span> 
                <span>{year?.HistoricalResident?.length}</span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-4">No historical calendar years found.</p>
        )}
      </div>
    </CardContent>
  </Card>
)

export default HistoricalYearsList