const conn = require("../../data/data-sources/db-datasource/database")

const add_task = async (req, res) => {
    const {title, detail , priority, due_date, created_by} = req.body;
    const db = await conn();
    const validPriority = ["high", "medium", "low"];

    if (!title || !detail || !priority || !created_by || !due_date){
        return res.status(400).json({error: "title, detail, priority, due_date and created_by are required"});
    }

    if (!validPriority.includes(priority)){
        return res.status(400).json({error : "Priority must be 'high', 'medium', or 'low'"})
    }

    const [userRows] = await db.execute("SELECT * FROM users WHERE user_id = ?", [created_by]);
    if (userRows.length <= 0){
        return res.status(400).json({error: "Username does not exist"});
    }

    const [result] = await db.execute("INSERT INTO tasks(title, detail,  priority, due_date, created_by) VALUES(?, ?, ?, ?, ?)", [title, detail, priority, due_date, created_by]);
    res.status(201).json({message : "Add task successfully"});

}

const get_task = async (req, res) => {
    const id = req.params.id;
    const taskId = req.params.taskId;
    const db = await conn();

    if (id){
        const [result] = await db.execute("SELECT * FROM tasks WHERE created_by = ? ORDER BY FIELD(priority, 'high', 'medium', 'low'), FIELD(status_task, 'todo', 'in_progress', 'done')", 
            [id]);

        if (result.length <= 0){
            return res.status(400).json({error : "User id is not existed"})
        }

        if (taskId){
            const [taskResult] = await db.execute("SELECT * FROM tasks WHERE created_by = ? and task_id = ? ORDER BY FIELD(priority, 'high', 'medium', 'low'), FIELD(status_task, 'todo', 'in_progress', 'done')", [id, taskId]);
            if (taskResult.length <= 0){
                return res.status(400).json({error : "Task id is not existed"})
            }
            return res.json(taskResult);
        }

        return res.json(result);

    }

    const [result] = await db.execute("SELECT * FROM tasks ORDER BY FIELD(priority, 'high', 'medium', 'low'), FIELD(status_task, 'todo', 'in_progress', 'done')");
    res.json(result);
}

const update_task = async (req, res) => {
    const {title, detail, priority, due_date, status} = req.body;
    const userId = req.params.id;
    const taskId = req.params.taskId;
    const validStatus = ["todo", "in_progress", "done"];
    const validPriority = ["high", "medium", "low"];

    const updates = [];
    const values = [];
    const db = await conn();

    if (title){
        updates.push("title = ?")
        values.push(title)
    }

    if (detail){
        updates.push("detail = ?")
        values.push(detail)
    }

    if (priority){
        if (!validPriority.includes(priority)){
            return res.status(400).json({error : "Priority must be 'high', 'medium', or 'low'"})
        }
        
        updates.push("priority = ?")
        values.push(priority)
    }

    if (due_date){
        updates.push("due_date = ?")
        values.push(due_date)
    }

    if (status){
        if (!validStatus.includes(status)){
            return res.status(400).json({error: "Status must be 'todo', 'in_progress', or 'done'"})
        }

        updates.push("status_task = ?")
        values.push(status)
    }

    if (updates.length === 0){
        return res.status(400).json({message : "No fields to update"})
    }

    values.push(taskId, userId)

    const [result] = await db.execute(`UPDATE tasks SET ${updates.join(", ")} WHERE task_id = ? AND created_by = ? `, values);

    if (result.affectedRows > 0){
        return res.status(200).json({message : "Task status updated successfully"});
    } else{
        return res.status(400).json({error: "Task not found with the task ID and user ID"});
    }



}

const delete_task = async (req, res) => {
    const userId = req.params.id
    const taskId = req.params.taskId
    const db = await conn()

    if (!userId || !taskId) {
        return res.status(400).json({ error: "User ID and Task ID are required." });
    }

    const [result] = await db.execute("DELETE FROM tasks WHERE task_id = ? and created_by = ? ", [taskId, userId]);

    if (result.affectedRows > 0){
        return res.status(200).json({message : "Task id is deleted successfully"});
    } else {
        return res.status(400).json({error : "Task not found with the task ID and user ID"});
    }
}



module.exports = { add_task, get_task, update_task, delete_task };