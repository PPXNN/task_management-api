jest.mock("../config/database", () => jest.fn());
const conn = require("../config/database")
const {delete_task} = require("../controllers/task")

beforeEach(() => {
    jest.clearAllMocks();
  });

test("should return 200 if user id is missing", async () =>{
    const req = {
        params : {
            taskId: 1
        }
    }

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    }

    await delete_task(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error: "User ID and Task ID are required."
    })
})

test("should return 200 if task id is missing", async () =>{
    const req = {
        params : {
            id: 1
        }
    }

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    }

    await delete_task(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error: "User ID and Task ID are required."
    })
})

test("should return 200 if task is deleted successfully", async () => {
    const req = {
        params : {
            id :1 ,
            taskId : 2
        }
    }

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([{affectedRows: 1}])
    })

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    }

    await delete_task(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
        message : "Task id is deleted successfully"
    })
})