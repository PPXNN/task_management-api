jest.mock("../../../../data/data-sources/db-datasource/database", () => jest.fn());
jest.mock("bcrypt");
const conn = require("../../../../data/data-sources/db-datasource/database")
const {login} = require("../../../../application/controllers/auth.controller")
const bcrypt = require("bcrypt");

beforeEach(() => {
    jest.clearAllMocks();
});

test("should return 400 if username is not found", async ()=> {
    const req = {
        body : {
            username : "ppp",
            password : "12341234"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[]])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error: "User does not exist"
    });
})

test("should return 400 if username is not in between 3 and 45 characters", async ()=> {
    const req = {
        body : {
            username : "pp",
            password : "1234"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[]])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error: "Username must be in between 3 and 45 characters"
    });
})

test("should return 400 if password is not in between 6 and 100 characters", async () =>{
    const req = {
        body : {
            username : "ppp",
            password : "123"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{id :1 , username : "pp", password : "hashedpassword"}]])
    });

    bcrypt.compare.mockResolvedValue(false);

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "Password must be in between 6 and 100 characters"
    });

})

test("should return 400 if password is not match", async () =>{
    const req = {
        body : {
            username : "ppp",
            password : "12341234"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{id :1 , username : "pp", password : "hashedpassword"}]])
    });

    bcrypt.compare.mockResolvedValue(false);

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "Your password is incorrect"
    });

})

test("should return 200 if password is match", async () =>{
    const req = {
        body : {
            username : "ppp",
            password : "12341234"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{id :1 , username : "ppp", password : "hashedpassword"}]])
    });

    bcrypt.compare.mockResolvedValue(true);

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
        message : "Login successfully"
    });

})