import MaintenanceList from "./maintenance-list"
import TaskForm from "./Task-Form"

const Maintenance =()=> {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Hostel Maintenance Tracker</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Maintenance Tasks</h2>
          <MaintenanceList />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
          <TaskForm />
        </div>
      </div>
    </div>
  )
}
export default Maintenance

