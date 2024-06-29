import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Verify from "./pages/Verify";
import { ToastContainer } from "react-toastify";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/verify" element={<Verify />} />
				<Route path="/content" element={<h1>OTP Verified</h1>} />
			</Routes>
			<ToastContainer
				position="bottom-center"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			{/* Same as */}
			<ToastContainer />
		</BrowserRouter>
	);
}

export default App;
