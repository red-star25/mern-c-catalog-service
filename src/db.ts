import config from "config";
import mongoose from "mongoose";

export const initDB = async () => {
    await mongoose.connect(config.get("database.url"));
};
