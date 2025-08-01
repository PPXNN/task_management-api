require("reflect-metadata");
const {IsDate} = require("class-validator");
const validPriority = ["high", "medium", "low"];

class addTaskDTO{
    constructor({title, detail , priority, due_date, created_by}){
        if (!title || !detail || !priority || !due_date || !created_by){
            throw new Error("All informations are required ")
        }

        if (typeof title !== "string"){
            throw new Error("Title must be string");
        }

        if (typeof detail !== "string"){
            throw new Error("Detail must be string");
        }

        if (typeof priority !== "string"){
            throw new Error("Priority must be string");
        }

        if (!validPriority.includes(priority)){
            throw new Error("Priority must be 'high', 'medium', or 'low'");
        }


        if (typeof due_date !== "string"){
            throw new Error("Due_date must be string");
        }

        if (typeof created_by !== "number"){
            throw new Error("Created_by must be number");
        }

        this.title = title
        this.detail = detail
        this.priority = priority
        this.due_date = new Date(due_date);
        this.created_by = created_by
    }
}

Reflect.decorate([
    IsDate({message : "Must be date pattern (YYYY/MM/DD)"})
], addTaskDTO.prototype, "due_date")

module.exports = addTaskDTO