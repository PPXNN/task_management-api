jest.mock("../../../../data/data-sources/db-datasource/database", () => jest.fn());
const conn = require("../../../../data/data-sources/db-datasource/database")
const {getTask} = require("../../../../application/controllers/task.controller")

beforeEach(() => {
    jest.clearAllMocks();
  });

test("should return all tasks", async () => {
    const req = {
        params: {}
    };

    const fakeData = [{ id: 1, task: "Sample task" }];

    conn.mockResolvedValue({
        execute: jest.fn().mockResolvedValueOnce([fakeData])
    });

    const res = {
        json: jest.fn()
    };

    await getTask(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeData);
});

test ("should return 400 if user id is not found", async () => {
    const req = {
        params : {
            id : 1
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[]])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await getTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "User id is not existed"
    });
})

test ("should return 400 if task id is not found", async () => {
    const req = {
        params : {
            id : 1,
            taskId : 2
        }
    };

    const fakeData = [{ id: 1, task: "Sample task" }];

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([fakeData]).mockResolvedValueOnce([[]])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await getTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "Task id is not existed"
    });
}) 

test ("should return data with specific user id", async () => {
    const req = {
        params : {
            id : 1
        }
    };

    const fakeData = [{ id: 1, task: "Sample task", user_id : 1 }];

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([fakeData])
    });

    const res = {
        json : jest.fn()
    };
    
    await getTask(req, res)

    expect(res.json).toHaveBeenCalledWith(fakeData)


})

test ("should return data with specific user id and task id", async () => {
    const req = {
        params : {
            id : 1,
            taskId: 1
        }
    };

    const fakeData = [{ id: 1, task: "Sample task", user_id : 1 }];

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([fakeData]).mockResolvedValueOnce([fakeData])
    });

    const res = {
        json : jest.fn()
    };

    await getTask(req, res)

    expect(res.json).toHaveBeenCalledWith(fakeData)

})
