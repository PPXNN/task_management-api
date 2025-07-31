const conn = require("../db-datasource/database");

const TaskRepository = {
    async findUserId(userid){
        const db = await conn();
        const [result] = await db.execute("SELECT * FROM users WHERE user_id = ?", [userid]);

        return result.length > 0 ? result[0] : null;
    },

    async addTask(title, detail, priority, due_date, created_by){
        const db = await conn();
        const [result] = await db.execute("INSERT INTO tasks(title, detail,  priority, due_date, created_by) VALUES(?, ?, ?, ?, ?)", 
            [title, detail, priority, due_date, created_by]);
        
        return result.affectedRows > 0;
    },

    async getTask(id, taskId){
        const db = await conn()
        if (id && taskId){
            const [taskResult] = await db.execute(
                "SELECT * FROM tasks WHERE created_by = ? AND task_id = ? ORDER BY FIELD(priority, 'high', 'medium', 'low'), FIELD(status_task, 'todo', 'in_progress', 'done')", 
                [id, taskId]
            );
            return taskResult.length > 0 ? taskResult[0] : null;
        }
    
        if (id){
            const [result] = await db.execute(
                "SELECT * FROM tasks WHERE created_by = ? ORDER BY FIELD(priority, 'high', 'medium', 'low'), FIELD(status_task, 'todo', 'in_progress', 'done')", 
                [id]
            );
            return result.length > 0 ? result : null
        }
    
        const [result] = await db.execute(
            "SELECT * FROM tasks ORDER BY FIELD(priority, 'high', 'medium', 'low'), FIELD(status_task, 'todo', 'in_progress', 'done')"
        );
        return result.length > 0 ? result : null
    },

    async updateTask(updates, values){
        const db = await conn()
        const [result] = await db.execute(`UPDATE tasks SET ${updates.join(", ")} WHERE task_id = ? AND created_by = ? `
        , values);

        return result.affectedRows > 0;
    },

    async deleteTask(userId, taskId){
        const db = await conn()
        const [result] = await db.execute("DELETE FROM tasks WHERE task_id = ? and created_by = ? ", 
            [taskId, userId]);
        
        return result.affectedRows > 0;
    }
}

module.exports = TaskRepository