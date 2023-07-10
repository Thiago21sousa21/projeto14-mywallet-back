import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import Joi from "joi";
import usersRoutes from "./routes/usersRoutes.js";
import accountRoutes from "./routes/accountsRoutes.js";

//config
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const port = process.env.PORT;
const mongoClient = new MongoClient(process.env.DATABASE_URL);
try {
    await mongoClient.connect();
    console.log('MONGODB CONECTED');
} catch (error) {
    console.log(error);
}
export const db = mongoClient.db();

///SCHEMAS
export const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
});
export const siginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
});
export const transactionSchema = Joi.object({
    value: Joi.number().positive().required(),
    description: Joi.string().required()
});

app.use(usersRoutes);
app.use(accountRoutes);

app.listen(port, () => { console.log(`RUNING PORT ${port}`) });