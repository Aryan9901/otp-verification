import { useState } from "react";
import { toast } from "react-toastify";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import fetchData from "../utils/fetchData";

const Home = () => {
	const [user, setUser] = useState({
		name: "",
		email: "",
	});

	const navigate = useNavigate();

	const onSubmit = async (e) => {
		e.preventDefault();
		if (!user.name || !user.email) {
			toast.error("All fields are required");
			return;
		}

		try {
			const response = await fetchData("register", "post", user);
			const data = response.data;

			if (data.success) {
				toast.success(data.message);
				navigate(`/verify?user=${data.user._id}`);
			}
		} catch (error) {
			console.error(error);
			toast.error(error.response.data.message);
		}
	};

	const onReset = (e) => {
		e.preventDefault();
		setUser({
			name: "",
			email: "",
		});
	};

	return (
		<section>
			<h2>Sign Up</h2>
			<form className="mail" onSubmit={onSubmit} onReset={onReset}>
				<h4>Enter Your Details</h4>
				<div>
					<label htmlFor="name">Name</label>
					<input
						type="text"
						id="name"
						value={user.name}
						onChange={(e) => setUser((curr) => ({ ...curr, [e.target.name]: e.target.value }))}
						name="name"
						placeholder="your good name..."
					/>
				</div>
				<div>
					<label htmlFor="email">Mail</label>
					<input
						type="email"
						id="email"
						name="email"
						value={user.email}
						onChange={(e) => setUser((curr) => ({ ...curr, [e.target.name]: e.target.value }))}
						placeholder="example@gmail.com"
					/>
				</div>
				<article>
					<button type="reset">Cancel</button>
					<button type="submit">Send Otp</button>
				</article>
			</form>
		</section>
	);
};

export default Home;
