import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History } from "lucide-react"
import {CalendarYearT} from "@/types/types"

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