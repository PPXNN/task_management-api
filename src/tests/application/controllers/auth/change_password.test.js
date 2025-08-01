jest.mock("../../../../data/data-sources/db-datasource/database", () => jest.fn());
jest.mock("bcrypt");
const conn = require("../../../../data/data-sources/db-datasource/database")
const {changePassword} = require("../../../../application/controllers/auth.controller")
const bcrypt = require("bcrypt");

test("should return 400 if user does not in between 3 and 45 characters", async () => {
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

    await changePassword(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "Username must be in between 3 and 45 characters"
    });
})

test("should return 400 if user does not exist", async () => {
    const req = {
        body : {
            username : "ppp", 
            old_password : "123554", 
            new_password: "111111", 
            confirm_new_password : "111111"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[]])
    });

    const res  = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await changePassword(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "User does not exist"
    });
})

test("should return 400 if old password does not in between 6 and 100 characters", async () => {
    const req = {
        body : {
            username : "ppp", 
            old_password : "123", 
            new_password: "111111", 
            confirm_new_password : "111111"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[]])
    });

    const res  = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await changePassword(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "Old password must be in between 6 and 100 characters"
    });
})

test("should return 400 if new password does not in between 6 and 100 characters", async () => {
    const req = {
        body : {
            username : "ppp", 
            old_password : "1234567", 
            new_password: "111", 
            confirm_new_password : "111111"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[]])
    });

    const res  = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await changePassword(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "New password must be in between 6 and 100 characters"
    });
})

test("should return 400 if confirm new password does not in between 6 and 100 characters", async () => {
    const req = {
        body : {
            username : "ppp", 
            old_password : "1234567", 
            new_password: "111111", 
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

    await changePassword(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        error : "Confirm new password must be in between 6 and 100 characters"
    });
})


test("should return 400 if old password is incorrect", async () =>{
    const req = {
        body : {
            username : "ppp", 
            old_password : "123456", 
            new_password: "1111111", 
            confirm_new_password : "1111111"
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

    await changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error: "Your old password is incorrect"
    });

    
})

test("should return 400 if new password is not match with confirm new password", async () =>{
    const req = {
        body : {
            username : "ppp", 
            old_password : "1235634", 
            new_password: "111111", 
            confirm_new_password : "11111111"
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

    await changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error : "new password or confirm new_password does not match"
    });
})

test("should return 200 if password has changed successfully", async () =>{
    const req = {
        body : {
            username : "ppp", 
            old_password : "123456", 
            new_password: "111111111", 
            confirm_new_password : "111111111"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{user_id: 1, username : "p", password : "hashpassword"}]]).mockResolvedValueOnce([
            {affectedRows: 1}
        ])
    });

    await bcrypt.compare.mockResolvedValue(true);
    await bcrypt.hash.mockResolvedValue("newhashpassword");

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        message : "Password has changed successfully"
    });
})