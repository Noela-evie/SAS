import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from 'axios';
import dotenv from "dotenv";
import "./passport.js";
import { dbConnect } from "./mongo/index.js";
import { authRoutes, allRoutes } from "./routes/index.js";
import cron from "node-cron";
import ReseedAction from "./mongo/ReseedAction.js";

dotenv.config();

const PORT = process.env.PORT;
const app = express();


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
app.use(express.json());
app.use(bodyParser.json({ type: "application/json", strict: false }));

app.get('/api/books', async (req, res) => {
  const { title, page = 1 } = req.query;
  const limit = 5;
  const offset = (page - 1) * limit;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    // Send request to Open Library API
    const response = await axios.get(`https://openlibrary.org/search.json`, {
      params: {
        title,
        page,
      },
    });

    // Limit results
    const limitedResults = response.data.docs.slice(offset, offset + limit);

    res.json({ ...response.data, docs: limitedResults });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Error fetching data from Open Library API' });
  }
});
app.use("/", authRoutes);
app.use("/", allRoutes); 

if (process.env.SCHEDULE_HOUR) {
  cron.schedule(`0 */${process.env.SCHEDULE_HOUR} * * *'`, () => {
    ReseedAction();
  });
} 


app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
