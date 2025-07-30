jest.mock("../config/database", () => jest.fn());
const conn = require("../config/database")
const {update_task} = require("../controllers/task")

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

    await update_task(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error: "Status must be 'todo', 'in_progress', or 'done'"
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

    await update_task(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error : "Priority must be 'high', 'medium', or 'low'"
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

    await update_task(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        message : "No fields to update"
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

    await update_task(req, res)

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

    const fakeData = [{task_id : 1, title: "test", detail: "test detail", priority: "low", due_date : "2025-06-11", status: "todo"}]

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([{affectedRows: 1}])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await update_task(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
        message : "Task status updated successfully"
    })
})