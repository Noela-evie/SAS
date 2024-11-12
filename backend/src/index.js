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

const API_BASE_URL = process.env.SEMANTIC_SCHOLAR_API;

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

app.get('/api/search', async (req, res) => {
  const { query } = req.query; // Expect a query parameter from the frontend
  if (!query) {
    return res.status(400).json({ error: 'A search query is required.' });
  }
  try {
    // Use the Semantic Scholar search endpoint with the query parameter
    const response = await axios.get(`${API_BASE_URL}/paper/search`, {
      params: {
        query,
        fields: 'title,authors,abstract,venue,year', // Fields to return in the response
        limit: 10, // Number of results to return
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error searching papers:', error.message);
    res.status(500).send('Server Error');
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
