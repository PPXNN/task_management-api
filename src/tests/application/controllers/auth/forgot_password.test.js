jest.mock("../../../../data/data-sources/db-datasource/database", () => jest.fn());
jest.mock("bcrypt");
const conn = require("../../../../data/data-sources/db-datasource/database")
const {forgotPassword} = require("../../../../application/controllers/auth.controller")
const bcrypt = require("bcrypt");

test("should return 400 if user is not in between 3 and 45 characters", async () =>{
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
        error : "Username must be in between 3 and 45 characters"
    });
})

test("should return 400 if user does not exist", async () =>{
    const req = {
        body : {
            username : "ppp", 
            email : "pp@example.com", 
            phone_number : "01234112399", 
            new_password : "123345", 
            confirm_new_password : "123345"
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

test("should return 400 if email is not valid email address", async () =>{
    const req = {
        body : {
            username : "ppp", 
            email : "ppexample.com", 
            phone_number : "01234112399", 
            new_password : "123345", 
            confirm_new_password : "123345"
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
        error : "Email must be a valid email address."
    });
})

test("should return 400 if phone number is not with +66 or 0 and contain 9–15 digits.", async () =>{
    const req = {
        body : {
            username : "ppp", 
            email : "pp@example.com", 
            phone_number : "1234112399", 
            new_password : "123345", 
            confirm_new_password : "123345"
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
        error : "Phone number must start with +66 or 0 and contain 9–15 digits."
    });
})

test("should return 400 if new password is not in between 6 and 100 characters", async () =>{
    const req = {
        body : {
            username : "ppp", 
            email : "pp@example.com", 
            phone_number : "01234112399", 
            new_password : "1233", 
            confirm_new_password : "123345"
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
        error : "New password must be in between 6 and 100 characters"
    });
})

test("should return 400 if confirm new password is not in between 6 and 100 characters", async () =>{
    const req = {
        body : {
            username : "ppp", 
            email : "pp@example.com", 
            phone_number : "01234112399", 
            new_password : "123345", 
            confirm_new_password : "1233"
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
        error : "Confirm new password must be in between 6 and 100 characters"
    });
})




test("should return 400 if phone number or email does not match", async () => {
    const req = {
        body : {
            username : "ppp", 
            email : "pp@example.com", 
            phone_number : "012341123332", 
            new_password : "123456", 
            confirm_new_password : "123456"
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
            username : "ppp", 
            email : "pp@example.com", 
            phone_number : "012341123332", 
            new_password : "123456", 
            confirm_new_password : "1234567"
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
            username : "ppp", 
            email : "pp@example.com", 
            phone_number : "012341123332", 
            new_password : "123343", 
            confirm_new_password : "123343"
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
