import config from "config";
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/category-router";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send(config.get("server.port"));
});

app.use(globalErrorHandler);
app.use("/categories", categoryRouter);

export default app;
