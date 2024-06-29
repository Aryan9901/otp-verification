const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "name is required"],
			minlength: [3, "name should be at least 3 characters long"],
			maxlength: [50, "name should not be more than 50 characters long"],
		},
		email: {
			type: String,
			required: [true, "email is required"],
			unique: true,
		},
		otp: {
			type: Number,
			required: true,
			minlength: [6, "OTP should be at least 6 digits long"],
			maxlength: [6, "OTP should not be more than 6 digits long"],
		},
		otpExpiry: {
			type: Date,
			required: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
