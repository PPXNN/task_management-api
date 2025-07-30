jest.mock("../config/database", () => jest.fn());
jest.mock("bcrypt");
const conn = require("../config/database")
const {login} = require("../controllers/auth")
const bcrypt = require("bcrypt");

beforeEach(() => {
    jest.clearAllMocks();
});

test("should return 400 if username is not found", async ()=> {
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
        message: "User does not exist"
    });
})

test("should return 400 if password is not match", async () =>{
    const req = {
        body : {
            username : "pp",
            password : "1234"
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
        message : "Your password is incorrect"
    });

})

test("should return 201 if password is match", async () =>{
    const req = {
        body : {
            username : "pp",
            password : "1234"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{id :1 , username : "pp", password : "hashedpassword"}]])
    });

    bcrypt.compare.mockResolvedValue(true);

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
        message : "Login successfully"
    });

})