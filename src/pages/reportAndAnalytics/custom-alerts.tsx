"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Alert = {
  id: number
  metric: string
  condition: "above" | "below"
  value: number
}

export function CustomAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [newAlert, setNewAlert] = useState<Omit<Alert, "id">>({
    metric: "occupancy",
    condition: "above",
    value: 90
  })

  const addAlert = () => {
    setAlerts([...alerts, { ...newAlert, id: Date.now() }])
    setNewAlert({ metric: "occupancy", condition: "above", value: 90 })
  }

  const removeAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Alerts</CardTitle>
        <CardDescription>Set up alerts for important metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Select
              value={newAlert.metric}
              onValueChange={(value) => setNewAlert({ ...newAlert, metric: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="occupancy">Occupancy</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="maintenance">Maintenance Tasks</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={newAlert.condition}
              onValueChange={(value) => setNewAlert({ ...newAlert, condition: value as "above" | "below" })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Label htmlFor="value" className="sr-only">
                Value
              </Label>
              <Input
                id="value"
                type="number"
                placeholder="Value"
                value={newAlert.value}
                onChange={(e) => setNewAlert({ ...newAlert, value: parseFloat(e.target.value) })}
                className="w-[100px]"
              />
            </div>
            <Button onClick={addAlert}>Add Alert</Button>
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                <span>
                  Alert when {alert.metric} is {alert.condition} {alert.value}
                </span>
                <Button variant="ghost" onClick={() => removeAlert(alert.id)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

