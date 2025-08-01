jest.mock("../../../../data/data-sources/db-datasource/database", () => jest.fn());
const conn = require("../../../../data/data-sources/db-datasource/database")
const {register} = require("../../../../application/controllers/auth.controller")

beforeEach(() => {
    jest.clearAllMocks();
});

test("should return 400 if username is not in between 3 and 45 characters", async () => {
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
        error : "Username must be in between 3 and 45 characters"
    });
})

test("should return 400 if password is not in between 6 and 100 characters", async () => {
    const req = {
        body : {
            username : "ppp",
            password : "1234",
            firstname : "oo",
            lastname : "nn",
            phone_number : "0817272727",
            email : "pp@gmail.com"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{ id: 1, username : "ppp", phone_number : "0817272727", email : "pp@gmail.com"}], []])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "Password must be in between 6 and 100 characters"
    });
})

test("should return 400 if firstname is not in between 2 and 45 characters ", async () => {
    const req = {
        body : {
            username : "ppp",
            password : "1234123",
            firstname : "o",
            lastname : "n",
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

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "Firstname must be in between 2 and 45 characters"
    })

})

test("should return 400 if lastname is not in between 2 and 45 characters ", async () => {
    const req = {
        body : {
            username : "ppp",
            password : "1234123",
            firstname : "ooo",
            lastname : "n",
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

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "Lastname must be in between 2 and 45 characters"
    })

})

test("should return 400 if phone number must start with +66 or 0 and contain 9–15 digits.", async () => {
    const req = {
        body : {
            username : "ppp",
            password : "1234123",
            firstname : "ooo",
            lastname : "nnn",
            phone_number : "817272727",
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

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "Phone number must start with +66 or 0 and contain 9–15 digits."
    })

})

test("should return 400 if email is not valid email address", async () => {
    const req = {
        body : {
            username : "ppp",
            password : "1234123",
            firstname : "ooo",
            lastname : "nnn",
            phone_number : "0817272727",
            email : "ppgmail.com"
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

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "Email must be a valid email address"
    })

})

test("should return 201 if register is successfully", async () => {
    const req = {
        body : {
            username : "ppp",
            password : "1234123",
            firstname : "ooqwe",
            lastname : "nneqweq",
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