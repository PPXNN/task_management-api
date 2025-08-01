jest.mock("../../../../data/data-sources/db-datasource/database", () => jest.fn());
const conn = require("../../../../data/data-sources/db-datasource/database")
const {updateTask} = require("../../../../application/controllers/task.controller")

beforeEach(() => {
    jest.clearAllMocks();
  });

test("should return 400 if status is not in ['todo', 'in_progress', 'done']", async () =>{
    const req = {
        body : {
            status : "do"
        },
        params : {
            id : 1,
            taskId : 1
        }
    };

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await updateTask(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error: "Status must be one of: todo, in_progress, done"
    })
})

test("should return 400 if priority is not in ['low', 'medium', 'high']", async () =>{
    const req = {
        body : {
            priority : "do"
        },
        params : {
            id : 1,
            taskId : 1
        }
    };

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error : "Priority must be one of: high, medium, low"
    });

})

test("should return 400 if no fields update", async () =>{
    const req = {
        body : {},
        params : {
            id : 1,
            taskId : 1
        }
    };

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error : "No fields to update"
    });
})

test("should return 400 if task not found with the task ID and user ID", async () =>{
    const req = {
        body : {
            status : "todo"
        },
        params : {
            id : 1,
            taskId : 1
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([{affectedRows: 0}])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await updateTask(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error: "Task not found with the task ID and user ID"
    })
})

test("should return 200 if task is updated successfully", async () =>{
    const req = {
        body : {
            status : "todo",
            title : "test"
        },
        params : {
            id : 1,
            taskId : 1
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([{affectedRows: 1}])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await updateTask(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
        message : "Task status updated successfully"
    })
})