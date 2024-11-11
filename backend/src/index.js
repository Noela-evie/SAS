import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import "./passport.js";
import { dbConnect } from "./mongo/index.js";
import { authRoutes, allRoutes } from "./routes/index.js";
import cron from "node-cron";
import ReseedAction from "./mongo/ReseedAction.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());

const whitelist = [process.env.APP_URL_CLIENT];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, 
};

dbConnect();

app.use(cors(corsOptions));
app.use(bodyParser.json({ type: "application/json", strict: false }));

app.use("/", authRoutes);
app.use("/", allRoutes); 

if (process.env.SCHEDULE_HOUR) {
  cron.schedule(`0 */${process.env.SCHEDULE_HOUR} * * *'`, () => {
    ReseedAction();
  });
} 


app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
