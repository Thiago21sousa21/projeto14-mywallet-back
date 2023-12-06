import express from "express";
import 'express-async-errors'
import cors from "cors";
import indexRoutes from "./routes/indexRoutes.js"
import handleError from "./middlewares/errorMiddleware/errorMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(indexRoutes);
app.use(handleError)

const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`RUNING PORT ${port}`) });