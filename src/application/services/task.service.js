const TaskRepository = require("../../data/data-sources/repositories/task.repository");
const addTaskDTO = require("../dtos/task/add_task.dto");
const updateTaskDTO = require("../dtos/task/update_task.dto")
const {validate} = require("class-validator");

class TaskService{
    static async addTask(userData){
        const dto = new addTaskDTO(userData);
        const errors = await validate(dto); 
        if (errors.length > 0){
            const error = errors[0];
            const msg_error = Object.values(error.constraints)[0];
            throw new Error(msg_error);
        }
        const {title, detail , priority, due_date, created_by} = dto;

        const userResult = await TaskRepository.findUserId(created_by)
        if (!userResult){
            throw new Error("User id does not exist");
        }

        const result = await TaskRepository.addTask(title, detail, priority, due_date, created_by);

        if (!result){
            throw new Error("Failed to add task");
        }
        return "Add task successfully";
    
    }

    static async getTask(userData){
        const {id, taskId} = userData
        const task = await TaskRepository.getTask(id, taskId);

        return task;
    }

    static async updateTask(userData, userParams){
        const {title, detail, priority, due_date, status} = userData;
        const {id, taskId} = userParams

        const dto = new updateTaskDTO({
            title,
            detail,
            priority,
            due_date,
            status,
            id,
            taskId
        });

        const errors = await validate(dto); 
        if (errors.length > 0){
            const error = errors[0];
            const msg_error = Object.values(error.constraints)[0];
            throw new Error(msg_error);
        }
    

        const updates = [];
        const values = [];

        if (title){
            updates.push("title = ?");
            values.push(title);
        }
    
        if (detail){
            updates.push("detail = ?");
            values.push(detail);
        }
    
        if (priority){
            
            updates.push("priority = ?");
            values.push(priority);
        }
    
        if (due_date){
            updates.push("due_date = ?");
            values.push(due_date);
        }
    
        if (status){
            updates.push("status_task = ?");
            values.push(status);
        }

        if (updates.length === 0){
            throw new Error("No fields to update");
        }

        values.push(taskId, id);

        const result = await TaskRepository.updateTask(updates, values);
        if (!result){
            throw new Error("Task not found with the task ID and user ID")
        }

        return "Task status updated successfully"

    }

    static async deleteTask(userData){
        const {id, taskId} = userData

        if (!id || !taskId) {
            throw new Error("User ID and Task ID are required.");
        }

        const result = await TaskRepository.deleteTask(id, taskId);
        if (!result){
            throw new Error("Task not found with the task ID and user ID");
        }
        return "Task id is deleted successfully";
    }
}

module.exports = TaskService