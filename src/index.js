import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import User from "./models/User.js";
import cors from "cors";
import Complaint from "./models/Complaint.js";

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

app.post("/api/complaints", jwtCheck, async (req, res) => {
  try {
    const { zoneName, details } = req.body;
    const auth0Id = req.auth.payload.sub;

    if(!zoneName || !details) {
      return res.status(400).json({ message: 'Zone and details are required.' });
    }

    const newComplaint = new Complaint({
      zoneName,
      details,
      filedBy: auth0Id,
    });

    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    console.error("Error saving complaint: ", error);
    res.status(500).json({ message: 'Failed to file complaint.' });
  }
});

let data = {
  "zones": [
    {
      "name": "Zone 1",
      "color": "yellow",
      "coords": [
        [26.2140, 81.2530],
        [26.2200, 81.2630],
        [26.2140, 81.2730],
        [26.1940, 81.2730],
        [26.1940, 81.2530]
      ]
    },
    {
      "name": "Chowk Bazaar",
      "color": "yellow",
      "coords": [
        [23.261577, 77.401257],
        [23.259170, 77.399096],
        [23.256651, 77.401897],
        [23.259390, 77.405218]
      ]
    },
    {
      "name": "Kerwa Dam",
      "color": "yellow",
      "coords": [
        [23.164043, 77.388763],
        [23.181178, 77.359806],
        [23.168888, 77.343836],
        [23.143109, 77.357855]
      ]
    },
    {
      "name": "Kaliyasot Dam",
      "color": "yellow",
      "coords": [
        [23.209126, 77.376924],
        [23.204244, 77.409194],
        [23.192038, 77.407335],
        [23.187583, 77.381904],
        [23.206685, 77.367230]
      ]
    },
    {
      "name": "Lalghati",
      "color": "yellow",
      "coords": [
        [23.292712, 77.350332],
        [23.293943, 77.364631],
        [23.283447, 77.372547],
        [23.289017, 77.380718],
        [23.284678, 77.382889],
        [23.271894, 77.376569],
        [23.264916, 77.359397],
        [23.280339, 77.350970],
        [23.293474, 77.353651]
      ]
    },
    {
      "name": "New Market",
      "color": "yellow",
      "coords": [
        [23.235749, 77.398885],
        [23.233934, 77.399776],
        [23.233934, 77.399776],
        [23.237425, 77.401289]
      ]
    },
    {
      "name": "Upper Lake",
      "color": "yellow",
      "coords": [
        [23.237634, 77.257367],
        [23.271543, 77.325860],
        [23.253880, 77.400704],
        [23.207977, 77.378731],
        [23.227381, 77.317620],
        [23.243470, 77.319852]
      ]
    },
    {
      "name": "Old Union Carbide Factory",
      "color": "red",
      "coords": [
        [23.283173, 77.408502],
        [23.282361, 77.409981],
        [23.282299, 77.408584]
      ]
    },
    {
      "name": "Aypdhya Bypass Road",
      "color": "red",
      "coords": [23.275590, 77.463559],
      "radius": 1000
    },
    {
      "name": "Zone 2",
      "color": "red",
      "coords": [26.2140, 81.2530],
      "radius": 1000
    }
  ],
  "places": [
    {
      "name": "Indra Garden",
      "type": "Park",
      "coords": [26.204694, 81.251379],
      "icon": "https://thumbs.dreamstime.com/z/pin-location-icon-vector-iconic-design-symbol-transparency-grid-94181514.jpg?ct=jpeg"
    },
    {
      "name": "Saheed Smarak",
      "type": "Tourist Spot",
      "coords": [26.202021, 81.247152],
      "icon": "https://thumbs.dreamstime.com/z/pin-location-icon-vector-iconic-design-symbol-transparency-grid-94181514.jpg?ct=jpeg"
    },
    {
      "name": "Janeshwar Mishra Park",
      "type": "Park",
      "coords": [26.8700, 80.9800],
      "icon": "https://thumbs.dreamstime.com/z/pin-location-icon-vector-iconic-design-symbol-transparency-grid-94181514.jpg?ct=jpeg"
    },
    {
      "name": "Hotel Taj",
      "type": "Hotel",
      "coords": [26.8500, 80.9490],
      "icon": "https://thumbs.dreamstime.com/z/pin-location-icon-vector-iconic-design-symbol-transparency-grid-94181514.jpg?ct=jpeg"
    },
    {
      "name": "La Place",
      "type": "Restaurant",
      "coords": [26.8550, 80.9480],
      "icon": "https://thumbs.dreamstime.com/z/pin-location-icon-vector-iconic-design-symbol-transparency-grid-94181514.jpg?ct=jpeg"
    }
  ],
  "points": [
    { "id": 1, "position": [23.293173, 77.403502], "popup": "Arjun Gupta" },
    { "id": 1, "position": [23.291543, 77.323860], "popup": "Ram Ratan" },
    { "id": 1, "position": [23.217519, 77.408548], "popup": "Ram Ratan" },
    { "id": 1, "position": [23.117119, 77.418948], "popup": "Ram Ratan" }
  ]
}

app.get("/fetch_loc", (req, res) => {
  res.send(data);
});

app.post("/update_loc", (req, res) => {
  data = req.body;
  res.send("ok");
});

app.post("/update_co", (req, res) => {
  const { name, lat, lng } = req.body;
  const id = 1; // keep your id fixed or generate dynamically

  // Find index of existing point by popup name
  const index = data.points.findIndex((p) => p.popup === name);

  if (index !== -1) {
    // Update existing point
    data.points[index].position = [lat, lng];
  } else {
    // Push new point
    data.points.push({
      id,
      position: [lat, lng],
      popup: name,
    });
  }

  res.status(200).json({ message: "Location updated", points: data.points });
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});