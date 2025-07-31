jest.mock("../../../../data/data-sources/db-datasource/database", () => jest.fn());
const conn = require("../../../../data/data-sources/db-datasource/database")
const {register} = require("../../../../application/controllers/auth.controller")

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
        error : "User is already existed"
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
        execute : jest.fn().mockResolvedValueOnce([[]]).mockResolvedValueOnce([[{insertId: 1}]]).mockResolvedValueOnce([{affectedRows: 1}])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully"
    })

})