import { TaskModel } from "../models/task.model"
import { CreateTaskInput, TaskIdParams } from "../validators/task.validator"

export const createTask = async (input:CreateTaskInput, userId:string)=>{
        return TaskModel.create({
            userId,
            title:input.title,
            ...(input.description && {description: input.description}),
            ...(input.priority && {priority: input.priority}),
            ...(input.status && {status: input.status}),
            ...(input.dueDate && {dueDate: new Date(input.dueDate)}),
        })
}
export const readTask = async (input:TaskIdParams)=>{
    return TaskModel.findById(input.taskId)
}