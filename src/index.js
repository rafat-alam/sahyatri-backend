import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import User from "./models/User.js";
import cors from "cors";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Connection error: ", err));

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

app.use("/api", jwtCheck);

app.get("/", (req, res) => {
  res.send("Hello, your Sahyatri backend is running!");
});

app.post("/api/sync-user", jwtCheck, async (req, res) => {
  try {
    const auth0User = req.auth.payload;
    const namespace = 'https://sahyatri-ten.vercel.app';

    const updateData = {
      name: auth0User[`${namespace}/name`] || auth0User.name,
      picture: auth0User[`${namespace}/picture`] || auth0User.picture,
      email: auth0User[`${namespace}/email`] || auth0User.email,
      lastLogin: new Date(),
      roles: auth0User[`${namespace}/roles`] || [],
    };

    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const user = await User.findOneAndUpdate(
      { auth0Id: auth0User.sub },
      { $set: updateData },
      {
        upsert: true,
        new: true,
      }
    );

    res.status(200).json(user);
    console.log("User synced: ", user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error syncing user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
