import sendEmail from "../config/sendEmail.js";
import userModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOtp from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from 'jsonwebtoken'

export async function registerUserController(req,res){
      try {
        const { name, email, password } = req.body 
        if(!name || !email || !password){
            return res.status(400).json({
                message : "Provide name, email, password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({email})

        if(user){
            return res.json({
                message : "Already registerd email",
                error : true,
                success : false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password,salt)

        const payload = {
            name,
            email,
            password : hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        const verifyEmail = await sendEmail({
              sendTo : email,
              subject : "Verify email from blinkeyit",
              html : verifyEmailTemplate({
                   name,
                   url : verifyEmailUrl
              })
        })

        return res.json({
            message : "User register successfully",
            error : false,
            success : true,
            data : save
        })

      } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
      }
}

export async function verifyEmailController(req,res){
    try {
        const {code} = req.body

        const user = await UserModel.findOne({_id : code})

        if(!user){
            return res.status(400).json({
                message : "Invalid code",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.updateOne({_id : code},{
            verify_email : true
        })

        return res.json({
            message : "Verify email done",
            success : true,
            error : false
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : true
        })
    }
}


//login controller
export async function loginController(req,res){
    try {
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                message : "Provide email and password",
                error : true,
                success : false
            })
        }
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({
                message : "User not register",
                error : true,
                success : false
            })
        }

       if(user.status !== "Active"){
        return res.status(400).json({
            message : "Contact to Admin",
            error : true,
            success : false
        })
       }

       const checkPassword = await bcryptjs.compare(password,user.password)

       if(!checkPassword){
          return res.status(400).json({
            message : "Check your password",
            error : true,
            success : false
          })
       }

       const accesstoken = await generatedAccessToken(user._id)
       const refreshToken = await generatedRefreshToken(user._id)

       const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
       })

       const cookiesOption = {
          httpOnly : true,
          secure : true,
          sameSite : "None"
       }
       res.cookie('accessToken',accesstoken,cookiesOption)
       res.cookie('refreshToken',refreshToken,cookiesOption)

       return res.json({
          message : "Login successfully",
          error : false,
          success : true,
          data : {
            accesstoken,
            refreshToken
          }
       })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//logout controller
export async function logoutController(req,res){
    try {
        const userId = req.userId

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
         }

        res.clearCookie("accessToken",cookiesOption)
        res.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId,{
            refresh_token : ""
        })
        return res.json({
            message : "Logout Successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            error : error.message || error,
            error : true,
            success : false
        })
    }
}

//upload user avatar
export async function uploadAvatar(req, res) {
    try {
        const userId = req.userId;

        // Validate userId
        if (!userId) {
            return res.status(400).json({
                message: "User ID not provided",
                error: true,
                success: false,
            });
        }

        // Validate file upload
        const image = req.file;
        if (!image) {
            return res.status(400).json({
                message: "No file uploaded",
                error: true,
                success: false,
            });
        }

        // Upload image to Cloudinary
        let upload;
        try {
            upload = await uploadImageCloudinary(image);
        } catch (err) {
            return res.status(500).json({
                message: "Image upload failed",
                error: true,
                success: false,
            });
        }

        // Validate Cloudinary response
        if (!upload || !upload.url) {
            return res.status(500).json({
                message: "Failed to upload image",
                error: true,
                success: false,
            });
        }

        // Update user avatar
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            { avatar: upload.url },
            { new: true } // Return the updated document
        );

        if (!updateUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        return res.json({
            message: "Profile uploaded successfully",
            success: true,
            error : false,
            data: {
                _id: userId,
                avatar: upload.url,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

//update user details
export async function updateUserDetails(req,res){
    try {
        const userId = req.userId
        const {name,email,mobile,password} = req.body

        let hashPassword = ""
        if(password){
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password,salt)
        }

        const updateUser = await UserModel.updateOne({_id : userId},{
            ...(name && {name : name}),
            ...(email && {email : email}),
            ...(mobile && {mobile : mobile}),
            ...(password && {password : hashPassword})
        })

        return res.json({
            message : "User updated successfully",
            error : false,
            success : true,
            data : updateUser
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//forgot password
export async function forgotPasswordController(req,res){
    try {
        const {email} = req.body

        const user = await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                message : "email not available",
                error : true,
                success : false
            })
        }

        const otp = generateOtp()
        const expireTime = new Date() + 60 * 60 * 1000
        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo : email,
            subject : "Forgot Password From Binkeyit",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })

        return res.json({
            message : "check your email",
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//verify forgot password otp
export async function verifyForgotPasswordOtp(req,res){
    try {
        const {email,otp} = req.body

        if(!email || !otp){
            return res.status(400).json({
                message : "Provide required field",
                error : true,
                success : false
            })
        }
        const user = await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                message : "email not available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()
        if(user.forgot_password_expiry < currentTime){
            return res.status(400).json({
                message : "Otp is expire",
                error : true,
                success :false
            })
        }

        if(otp !== user.forgot_password_otp){
            return res.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false
            })
        }

        //if otp is not expire
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
              forgot_password_otp : "",
              forgot_password_expiry : ""
        })

        return res.json({
            message : "Verify otp successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//reset the password
export async function resetpassword(req,res){
    try {
        const {email,newPassword,confirmPassword} = req.body
        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({
                message : "provide required field",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({
                message : "Email is not available",
                error :true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message : "New password and confirm password are not match.",
                error : true,
                success : false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)

        const update = await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return res.json({
            message : "Password update successfully.",
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//refresh token controller
export async function refreshToken(req,res){
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authoraization.split(" ")[1]
        if(!refreshToken){
            return res.status(400).json({
                message : "Unauthorized access",
                error : true,
                success : false
            })
        }
        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)
        if(!verifyToken){
            return res.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }
        
        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
         }

        res.cookie('accessToken',newAccessToken,cookiesOption)
        return res.json({
            message : "New access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//get login user details
export async function userDetails(req,res){
    try {
        const userId = req.userId

        console.log(userId)

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return res.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : "Something is wrong",
            error : true,
            success : false
        })
    }
}