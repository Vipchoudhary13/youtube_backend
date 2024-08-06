import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //   res.status(200).json({
  //     message: "ok",
  //   });

  // setps for register user
  // 1. get user details from frontend
  // 2. validation should not empty
  // 3. check if user already exists: username, email
  // 4. check for images, check for avatar
  // 5. upload them to cloudinay, avatar
  // 6. crate user object - create entry in db
  // 7. remove password and refresh token filed from response
  // 8. check for user creation
  // 9. return res

  const {userName, email, fullName, password} = req.body;

  if(
    [fullName,email,userName,password].some((field) =>
      field?.trim() === ""
    )
  ){
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
    $or: [{userName},  {email}]
  })
  
  if(existedUser){
    throw new ApiError(409, "User with email or userName already exists")
  }
  
  // console.log('req.files', req.files)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path ?? null; 
  // let coverImageLocalPath;
  // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
  //   coverImageLocalPath = req.files.coverImage[0].path
  // }


  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
    throw new ApiError(400, "Avatar file is required")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  })

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createUser){
    throw new ApiError(500, "Somthing went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createUser, "User Register successfully")
  )

});

export { registerUser };
