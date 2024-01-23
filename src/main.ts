import express from "express";

import {userRouter} from "./routers/user.router";
import mongoose from "mongoose";
import {configs} from "./configs/config";
import {authRouter} from "./routers/auth.router";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/auth", authRouter);
app.use('/users', userRouter)
console.log(configs.DB_URL)




const PORT = configs.PORT;
app.listen(PORT, async () => {
    await mongoose.connect(configs.DB_URL);
    console.log(`Server is running on http://localhost:${PORT}/users`);
});

