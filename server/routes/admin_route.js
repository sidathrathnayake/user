const express = require('express');
const router = express.Router();
const crypto =require('crypto');
const adminModel = require('../models/Admin');
const Error = require('../utils/error_response');
const sendEmail = require('../utils/send_email');
const  { getPrivateData }  = require('../middleware/private_error');
const { protect }  =  require('../middleware/admin_protect');

//Protecion
router.get('/admin', protect,getPrivateData);

//Register
router.post('/admin/adminregister', async (req, res, next) => {
    
    const admin = new adminModel(req.body);

    admin.save((err) => {
        if(err){
            return next(new Error('Something went wrong!. Please check and try again.', 400));
        }
        return res.status(201).json({
            success: [true, 'Added successfully']
        });
    });

});

//Login
router.post('/admin/adminlogin',async (req,res,next) =>{
    
    const {adminEmail, adminPassword} = req.body;

    if(!adminEmail || !adminPassword){
        return next(new Error("Please provide an Email and Password...!",400));
    }

    try {
        const admin = await adminModel.findOne({adminEmail}).select("+adminPassword");

        if(!admin){
            return next(new Error("Invalid credentials...!",401));
        }

        const isMatch = await admin.matchPasswords(adminPassword);

        if(!isMatch){
            return next(new Error("Invalid Password...!",401));
        }

        sendToken(admin, 200, res);

    } catch (error) {
        next(error);       
    }

});

//Forgot Password
router.post('/admin/adminforgotpassword', async (req,res,next) =>{
    const {adminEmail} = req.body;
    
    try {
        const admin = await adminModel.findOne({adminEmail});

        if(!admin){
            return next(new Error("Email could not be sent to this email.",404));
        }
        const resetToken = admin.getResetPasswordToken();

        await admin.save();

        const resetURL = `http://localhost:3000/adminresetpassword/${resetToken}`;

        const message = `
            <h1>You have requested to reset your password.</h1>
            <p>Please go to the below link to reset your password.</p>
            <a href=${resetURL} clicktracking=off>${resetURL}</a>
        `

        try {
            await sendEmail({
                to: admin.adminEmail,
                subject:"Reset password request",
                text: message
            });

            res.status(200).json({
                success:true,
                data: "Email sent"
            });

        } catch (error) {
            admin.resetPasswordToken = undefined;
            admin.resetPasswordExpire = undefined;

            await admin.save();

            return next(new Error("Email could not be send.!",500));
        }

    } catch (error) {
        next(error);
    }
});

//Reset Password
router.put('/admin/adminresetpassword/:resetToken', async (req,res,next) =>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    try {
        const admin = await adminModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()}
        })

        if(!admin){
            return next(new Error("Invalid reset token",400));
        }

        admin.adminPassword = req.body.adminPassword;

        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpire = undefined;

        await admin.save();

        res.status(201).json({
            success:true,
            data: "Password reset successfully"
        });

    } catch (error) {
        next(error);
    }

})

//Token send to the model class
const sendToken  = (admin, statusCode, res) =>{
    const token = admin.getSignedToken();
    res.status(statusCode).json({
        success:true,
        token
    });
}

module.exports = router;
