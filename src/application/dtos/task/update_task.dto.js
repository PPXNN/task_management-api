require("reflect-metadata");
const {IsNumber, IsDate, IsString, IsOptional, IsIn, IsDefined} = require("class-validator");

const validStatus = ["todo", "in_progress", "done"];
const validPriority = ["high", "medium", "low"];

class updateTaskDTO{
    constructor({title, detail, priority, due_date, status, id, taskId}){

        this.title = title
        this.detail = detail
        this.priority = priority
        this.due_date = due_date ? new Date(due_date) : undefined;
        this.status = status
        this.id = Number(id);
        this.taskId = Number(taskId);

    }
}

Reflect.decorate([
    IsOptional(),
    IsString({ message: "Title must be string" }),
    ], updateTaskDTO.prototype, "title");

Reflect.decorate([
    IsOptional(),
    IsString({ message: "Detail must be string" }),
    ], updateTaskDTO.prototype, "detail");

Reflect.decorate([
    IsOptional(),
    IsString({ message: "Status must be string" }),
    IsIn(validStatus, { message: `Status must be one of: ${validStatus.join(", ")}` }),
    ], updateTaskDTO.prototype,"status");

Reflect.decorate([
    IsOptional(),
    IsString({ message: "Priority must be string" }),
    IsIn(validPriority, { message: `Priority must be one of: ${validPriority.join(", ")}` }),
    ], updateTaskDTO.prototype,"priority");


Reflect.decorate([
    IsOptional(),
    IsDate({ message: "Due_date must be a valid date" }),
    ], updateTaskDTO.prototype, "due_date");

Reflect.decorate([
    IsNumber({}, { message: "Id must be number" }),
    IsDefined({ message: "Id is required" }),
    ], updateTaskDTO.prototype, "id");
    
Reflect.decorate([
    IsNumber({}, { message: "Task id must be number" }),
    IsDefined({ message: "Task id is required" }),
    ], updateTaskDTO.prototype, "taskId");


module.exports = updateTaskDTO