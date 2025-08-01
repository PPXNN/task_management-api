jest.mock("../../../../data/data-sources/db-datasource/database", () => jest.fn());
const conn = require("../../../../data/data-sources/db-datasource/database")
const {addTask} = require("../../../../application/controllers/task.controller")

beforeEach(() => {
    jest.clearAllMocks();
  });

test("should return 400 if title is missing", async () =>{
    const req = {
        body : {
            detail : "Some detail",
            priority : "low",
            due_date :"2025-11-09",
            created_by : 1
        }
    };

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await addTask(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error: "All informations are required "
    });
})

test("should return 400 if date is not (YYYY-MM-DD)", async () =>{
    const req = {
        body : {
            title : "test",
            detail : "Some detail",
            priority : "low",
            due_date :"20/05/1987",
            created_by : 1
        }
    };

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await addTask(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error: "Must be date pattern (YYYY/MM/DD)"
    });
})

test("should return 400 if priority is not in ['low', 'medium', 'high']", async () =>{
    const req = {
        body : {
            title : "test",
            detail : "Some detail",
            priority : "need",
            due_date :"2025-11-09",
            created_by : 1
        }
    };

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await addTask(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error : "Priority must be 'high', 'medium', or 'low'"
    });
})

test("should return 400 if user id is not existed", async () =>{
    conn.mockResolvedValue({
        execute: jest.fn().mockResolvedValueOnce([[]])
    });

    const req = {
        body : {
            title : "test",
            detail : "Some detail",
            priority : "low",
            due_date :"2025-11-09",
            created_by : 9
        }
    };

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await addTask(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error: "User id does not exist"
    });
})

test("should return 201 if the task is added successfully", async () =>{
    conn.mockResolvedValue({
        execute: jest.fn().mockResolvedValueOnce([[{user_id : 1}]]).mockResolvedValueOnce([{ insertId: 1, affectedRows: 1}])
    })

    const req = {
        body : {
            title : "test",
            detail : "Some detail",
            priority : "low",
            due_date :"2025-11-09",
            created_by : 1
        }
    }

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    }
    
    await addTask(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
        message : "Add task successfully"
    })
})