const TaskRepository = require("../repositories/task.repository")

class TaskService{
    static async addTask(userData){
        const {title, detail , priority, due_date, created_by} = userData;
        const validPriority = ["high", "medium", "low"];

        if (!title || !detail || !priority || !created_by || !due_date){
            throw new Error("title, detail, priority, due_date and created_by are required");
        }
        if (!validPriority.includes(priority)){
            throw new Error("Priority must be 'high', 'medium', or 'low'");
        }

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
        if (!task){
            throw new Error("Task id is not existed");
        }

        return task;
    }

    static async updateTask(userData, userParams){
        const {title, detail, priority, due_date, status} = userData;
        const {id, taskId} = userParams
        const validStatus = ["todo", "in_progress", "done"];
        const validPriority = ["high", "medium", "low"];
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
            if (!validPriority.includes(priority)){
                throw new Error("Priority must be 'high', 'medium', or 'low'");
            }
            
            updates.push("priority = ?");
            values.push(priority);
        }
    
        if (due_date){
            updates.push("due_date = ?");
            values.push(due_date);
        }
    
        if (status){
            if (!validStatus.includes(status)){
                throw new Error("Status must be 'todo', 'in_progress', or 'done'")
            }
    
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