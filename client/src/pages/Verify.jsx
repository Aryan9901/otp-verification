import { useState, useEffect } from "react";
import { CiMail } from "react-icons/ci";
import "../styles/Verify.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import fetchData from "../utils/fetchData"; // Assuming you have fetchData in your utils

const Verify = () => {
	const [otp, setOtp] = useState({
		first: "",
		second: "",
		third: "",
		fourth: "",
	});
	const [userId, setUserId] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const navigate = useNavigate();

	// Extract user ID from URL and fetch user data
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const userId = urlParams.get("user");
		if (userId) {
			setUserId(userId);
			fetchUserEmail(userId);
		} else {
			toast.error("User ID is missing from the URL");
		}
	}, []);

	// Function to fetch user email
	const fetchUserEmail = async (userId) => {
		try {
			const response = await fetchData(`get/user`, "post", { id: userId });
			const data = response.data;
			if (data.success) {
				setUserEmail(data.user.email); // Adjust according to your API response
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Failed to fetch user email");
			console.error(error);
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const combinedOtp = parseInt(otp.first + otp.second + otp.third + otp.fourth, 10);
		if (isNaN(combinedOtp) || combinedOtp.toString().length !== 4 || !userId) {
			toast.error("All fields are required and OTP should be a 4-digit number");
			return;
		}

		try {
			const response = await fetchData("verify", "post", { otp: combinedOtp, id: userId });
			const data = response.data;

			if (data.success) {
				toast.success(data.message);
				navigate("/content"); // Change to your success page
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.response.data.message);
			console.error(error);
		}
	};

	const onReset = (e) => {
		e.preventDefault();
		setOtp({
			first: "",
			second: "",
			third: "",
			fourth: "",
		});
	};

	const handleChange = (e) => {
		const { id, value } = e.target;
		if (!isNaN(value) && value.length <= 1) {
			setOtp((prevOtp) => ({
				...prevOtp,
				[id]: value,
			}));
		}
	};

	return (
		<section>
			<h2>Verify OTP</h2>
			<form className="verify" onSubmit={onSubmit} onReset={onReset}>
				<span>
					<CiMail />
				</span>
				<h3>Please check your email.</h3>
				<h4>
					We&apos;ve sent a code to <span>{userEmail || "your email"}</span>
				</h4>
				<div>
					<div className="inputs">
						<input id="first" type="text" maxLength="1" value={otp.first} onChange={handleChange} />
						<input id="second" type="text" maxLength="1" value={otp.second} onChange={handleChange} />
						<input id="third" type="text" maxLength="1" value={otp.third} onChange={handleChange} />
						<input id="fourth" type="text" maxLength="1" value={otp.fourth} onChange={handleChange} />
					</div>
				</div>
				<article>
					<button type="reset">Cancel</button>
					<button type="submit">Verify OTP</button>
				</article>
			</form>
		</section>
	);
};

export default Verify;
