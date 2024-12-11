const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// register

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register",
      });
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.jason({
        success: false,
        message: "Password invalid! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "Secreat_123_###_2@@@_key",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName, 
        // we need this information like to displaying the user's name on a dashboard or showing their email.This avoids requiring the client to decode the token or make another request to fetch user details after logging in.
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req,res) =>{
  res.clearCookie('token').json({
    success : true , 
    message : 'Logged out successfully'
  })
};

//auth middleware

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if(!token) return res.status(401).json({
    success : false,
    message : 'Unauthorised user!'
  })
  try{
    const decoded = jwt.verify(token,'Secreat_123_###_2@@@_key');
    req.user = decoded;
    next()
  }catch(error){
    res.status(401).json({
      success : false,
      message : 'Unauthorised user!'
    })
  }
};




module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
