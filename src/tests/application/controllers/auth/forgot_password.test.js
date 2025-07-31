jest.mock("../../../../data/data-sources/db-datasource/database", () => jest.fn());
jest.mock("bcrypt");
const conn = require("../../../../data/data-sources/db-datasource/database")
const {forgotPassword} = require("../../../../application/controllers/auth.controller")
const bcrypt = require("bcrypt");

test("should return 400 if user does not exist", async () =>{
    const req = {
        body : {
            username : "pp", 
            email : "pp@example.com", 
            phone_number : "12341123332", 
            new_password : "123", 
            confirm_new_password : "123"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[]])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await forgotPassword(req ,res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error : "User does not exist"
    });
})

test("should return 400 if phone number or email does not match", async () => {
    const req = {
        body : {
            username : "pp", 
            email : "pp@example.com", 
            phone_number : "12341123332", 
            new_password : "123", 
            confirm_new_password : "123"
        }
    };

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{user_id: 1, username : "p", password : "hashpassword"}]]).mockResolvedValueOnce([[]])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await forgotPassword(req ,res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error : "Phone number or email does not match"
    });

})

test("should return 400 if new password and confirm new password does not match", async () => {
    const req = {
        body : {
            username : "pp", 
            email : "pp@example.com", 
            phone_number : "12341123332", 
            new_password : "123", 
            confirm_new_password : "12"
        }
    };  

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{user_id: 1, username : "p", password : "hashpassword"}]]).mockResolvedValueOnce([[
            {
            user_id : 1 ,user_id :1 , email: "pp@example.com", phone_number : "12341123332"
            }]])
    });

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await forgotPassword(req ,res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error : "new password or confirm new_password does not match"
    });
})

test("should return 200 if password has changed successfully", async () => {
    const req = {
        body : {
            username : "pp", 
            email : "pp@example.com", 
            phone_number : "12341123332", 
            new_password : "123", 
            confirm_new_password : "123"
        }
    }; 

    conn.mockResolvedValue({
        execute : jest.fn().mockResolvedValueOnce([[{user_id: 1, username : "pp", password : "hashpassword"}]]).mockResolvedValueOnce(
            [[{
            user_id : 1 ,user_id :1 , phone_number: "12341123332", email : "pp@example.com"
            }]]).mockResolvedValueOnce([{affectedRows: 1}])
    });

    await bcrypt.hash.mockResolvedValue("newhashpassword");

    const res = {
        status : jest.fn().mockReturnThis(),
        json : jest.fn()
    };

    await forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        message : "Password has changed successfully"
    });

    
})
