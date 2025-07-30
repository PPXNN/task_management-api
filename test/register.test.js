jest.mock("../config/database", () => jest.fn());
const conn = require("../config/database")
const {register} = require("../controllers/auth")

beforeEach(() => {
    jest.clearAllMocks();
});

test("should return 400 if user is already existed", async () => {
    const req = {
        body : {
            username : "p",
            password : "1234",
            firstname : "oo",
            lastname : "nn",
            phone_number : "0817272727",
            email : "pp@gmail.com"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{ id: 1, username : "p", phone_number : "0817272727", email : "pp@gmail.com"}], []])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        message: "User is already existed"
    });
})

test("should return 201 if register is successfully", async () => {
    const req = {
        body : {
            username : "p",
            password : "1234",
            firstname : "oo",
            lastname : "nn",
            phone_number : "0817272727",
            email : "pp@gmail.com"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[]]).mockResolvedValueOnce([[{insertId: 1}]]).mockResolvedValueOnce([[]])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
        message: "User Register"
    })

})