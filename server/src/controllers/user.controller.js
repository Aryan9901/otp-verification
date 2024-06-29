const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const MailSender = require("../utils/nodemailer");

const generateOtpVerificationEmail = (otp) => {
	return `
         <html>
             <head>
                 <style>
                     .container {
                         width: 100%;
                         max-width: 600px;
                         margin: 0 auto;
                         padding: 20px;
                         font-family: Arial, sans-serif;
                         background-color: #f7f7f7;
                         border: 1px solid #ddd;
                         border-radius: 5px;
                     }
                     .header {
                         text-align: center;
                         padding-bottom: 20px;
                         border-bottom: 1px solid #ddd;
                     }
                     .header h1 {
                         margin: 0;
                         color: #333;
                     }
                     .content {
                         padding: 20px;
                     }
                     .otp {
                         font-size: 24px;
                         font-weight: bold;
                         color: #333;
                         text-align: center;
                         margin: 20px 0;
                     }
                     .footer {
                         text-align: center;
                         padding-top: 20px;
                         border-top: 1px solid #ddd;
                         color: #777;
                     }
                 </style>
             </head>
             <body>
                 <div class="container">
                     <div class="header">
                         <h1>OTP Verification</h1>
                     </div>
                     <div class="content">
                         <p>Dear User,</p>
                         <p>Thank you for registering with us. Please use the following OTP to verify your email address:</p>
                         <div class="otp">${otp}</div>
                         <p>This OTP is valid for the next 5 minutes.</p>
                         <p>If you did not request this OTP, please ignore this email.</p>
                     </div>
                     <div class="footer">
                         <p>Thank you,<br/>The Team</p>
                     </div>
                 </div>
             </body>
         </html>
     `;
};

const generateOtp = () => {
	// Generate a random 4-digit OTP
	const otp = Math.floor(1000 + Math.random() * 9000).toString();
	return otp;
};

exports.registerUser = async (req, res) => {
	try {
		const { name, email } = req.body; // Corrected to access req.body
		const isUserExist = await User.findOne({ name, email });
		if (isUserExist) {
			res.status(400).json({ success: false, message: "User already exists" });
			return;
		}

		const otp = generateOtp();
		const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // Current time + 5 minutes

		const newUser = await User.create({
			name,
			email,
			otp,
			otpExpiry,
		});

		if (!newUser) {
			res.status(400).json({ success: false, message: "User not created" });
			return;
		}

		const emailContent = generateOtpVerificationEmail(newUser.otp);
		let sendmail = new MailSender(newUser.email, "OTP Verification", emailContent);
		console.log(2);
		sendmail.send();
		console.log(3);

		res.status(200).json({ success: true, message: "User registered", user: newUser });
	} catch (error) {
		console.error(error);
		res.status(400).json({ success: false, message: "Internal Server Error", stack: error });
	}
};

exports.getUser = async (req, res) => {
	try {
		const { id } = req.body; // Corrected to access req.body
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({ success: false, message: "User not exist" });
		}

		res.status(200).json({ success: true, user: user });
	} catch (error) {
		console.error(error);
		res.status(400).json({ success: false, message: "Internal Server Error", stack: error });
	}
};

exports.verifyUser = async (req, res) => {
	try {
		const { otp, id } = req.body;
		const user = await User.findById(id);

		if (!user) {
			return res.status(400).json({ success: false, message: "User does not exist" });
		}

		const currentTime = new Date();

		// Check if the OTP is expired
		if (currentTime > user.otpExpiry) {
			await regenerateOtp(id); // Call regenerateOtp without sending a response
			return res.status(400).json({ success: false, message: "OTP has expired. A new OTP has been sent to your email." });
		}

		// Check if the provided OTP matches the stored OTP
		if (user.otp === otp) {
			user.isVerified = true;
			await user.save(); // Save the updated user document
			return res.status(200).json({ success: true, message: "User verified successfully" });
		} else {
			return res.status(400).json({ success: false, message: "Invalid OTP" });
		}
	} catch (error) {
		console.error("Error during user verification:", error);
		return res.status(400).json({ success: false, message: "Internal Server Error", stack: error });
	}
};

const regenerateOtp = async (id) => {
	try {
		const user = await User.findById(id);

		if (!user) {
			throw new Error("User does not exist");
		}

		const otp = generateOtp();
		const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // Current time + 5 minutes

		user.otp = otp;
		user.otpExpiry = otpExpiry;
		await user.save();

		const emailContent = generateOtpVerificationEmail(user.otp);
		let sendmail = new MailSender(user.email, "OTP Regeneration", emailContent);
		sendmail.send();
	} catch (error) {
		console.error("Error during OTP regeneration:", error);
	}
};
