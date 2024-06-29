import axios from "axios";

const fetchData = async (endPoint, method, content) => {
	let data;
	if (method === "post") {
		data = await axios.post(`http://localhost:8000/api/v1/user/${endPoint}`, content, { headers: { "Content-Type": "application/json" } }); // Corrected Content-Type
	}
	if (method === "get") {
		console.log(content);
		data = await axios.get(`http://localhost:8000/api/v1/user/${endPoint}`, content, { headers: { "Content-Type": "application/json" } }); // Corrected Content-Type
		console.log(data);
	}
	return data;
};

export default fetchData;
