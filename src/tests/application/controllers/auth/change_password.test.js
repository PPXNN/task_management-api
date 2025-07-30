jest.mock("../../../../data/data-sources/db-datasource/database", () => jest.fn());
jest.mock("bcrypt");
const conn = require("../../../../data/data-sources/db-datasource/database")
const {change_password} = require("../../../../application/controllers/auth")
const bcrypt = require("bcrypt");

test("should return 400 if username is not found", async () => {
    const req = {
        body : {
            username : "p", 
            old_password : "123", 
            new_password: "111", 
            confirm_new_password : "111"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[]])
    });

    const res  = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await change_password(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "Username is not found"
    });
})

test("should return 400 if old password is incorrect", async () =>{
    const req = {
        body : {
            username : "p", 
            old_password : "123", 
            new_password: "111", 
            confirm_new_password : "111"
        }
    };
    
    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{user_id: 1, username : "p", password : "hashpassword"}]])
    });

    await bcrypt.compare.mockResolvedValue(false);

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await change_password(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error: "Your old password is incorrect"
    });

    
})

test("should return 400 if new password is not match with confirm new password", async () =>{
    const req = {
        body : {
            username : "p", 
            old_password : "123", 
            new_password: "111", 
            confirm_new_password : "11"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{user_id: 1, username : "p", password : "hashpassword"}]])
    });

    await bcrypt.compare.mockResolvedValue(true);

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await change_password(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error : "new password or confirm new_password does not match"
    });
})

test("should return 201 if password has changed successfully", async () =>{
    const req = {
        body : {
            username : "p", 
            old_password : "123", 
            new_password: "111", 
            confirm_new_password : "111"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{user_id: 1, username : "p", password : "hashpassword"}]])
    });

    await bcrypt.compare.mockResolvedValue(true);
    await bcrypt.hash.mockResolvedValue("newhashpassword");

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await change_password(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
        message : "Password has changed successfully"
    });
})