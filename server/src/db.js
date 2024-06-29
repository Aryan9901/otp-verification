const mongoose = require("mongoose");

const connectDb = async () => {
	try {
		const connectInstance = await mongoose.connect(`mongodb://localhost:27017/userapp`);
		console.log("Mongo db connect to localhost");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

module.exports = connectDb;
