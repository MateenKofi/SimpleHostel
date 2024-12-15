"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  priority: z.enum(["low", "medium", "high"]),
  assignedTo: z.string().min(2, {
    message: "Please enter the name of the person assigned to this task.",
  }),
})

const TaskForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      assignedTo: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      console.log(values)
      setIsSubmitting(false)
      form.reset()
    }, 1000)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <label htmlFor="title">Task Title</label>
        <input
          id="title"
          placeholder="Enter task title"
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p>{form.formState.errors.title.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Describe the maintenance task in detail"
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p>{form.formState.errors.description.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="priority">Priority</label>
        <select id="priority" {...form.register("priority")}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {form.formState.errors.priority && (
          <p>{form.formState.errors.priority.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="assignedTo">Assigned To</label>
        <input
          id="assignedTo"
          placeholder="Enter name of assigned staff"
          {...form.register("assignedTo")}
        />
        {form.formState.errors.assignedTo && (
          <p>{form.formState.errors.assignedTo.message}</p>
        )}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Add Task"}
      </button>
    </form>
  )
}
export default TaskForm