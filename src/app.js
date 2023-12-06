import express from "express";
import cors from "cors";
import indexRoutes from "./routes/indexRoutes.js"

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
app.use(indexRoutes);

app.listen(port, () => { console.log(`RUNING PORT ${port}`) });