const TaskService = require("../services/task.service")

const addTask = async (req, res) =>{
    try {
        const result = await TaskService.addTask(req.body);
        res.status(201).json({message : result});
    } catch (error) {
        res.status(400).json({error : error.message});
    }
};

const getTask = async (req, res) =>{
    try {
        const result = await TaskService.getTask(req.params)
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({error : error.message});
    }
}

const updateTask = async (req, res) => {
    try {
        const result = await TaskService.updateTask(req.body, req.params)
        res.status(200).json({message : result});
    } catch (error) {
        res.status(400).json({error : error.message});
    }
}

const deleteTask = async (req, res) => {
    try {
        const result = await TaskService.deleteTask(req.params)
        res.status(200).json({message : result});
    } catch (error) {
        res.status(400).json({error : error.message});        
    }
}

module.exports = {addTask, getTask, updateTask,deleteTask}