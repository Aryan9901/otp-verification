const connectDb = require("./db.js");
const app = require("./app.js");

connectDb()
	.then(() => {
		app.listen(8000, () => {
			console.log("app listening in port 8000", " http://localhost:8000");
		});
	})
	.catch((error) => {
		console.error(error);
	});
