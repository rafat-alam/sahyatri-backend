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
      "name": "Birls Mandir",
      "color": "blue",
      "coords": [
        [23.238668, 77.407943],
        [23.237899, 77.407846],
        [23.237869, 77.409713],
        [23.238609, 77.409692]
      ]
    },
    {
      "name": "Tribal Museum",
      "color": "blue",
      "coords": [
        [23.236284, 77.385468],
        [23.233924, 77.383967],
        [23.233641, 77.385357],
        [23.235870, 77.386503]
      ]
    },
    {
      "name": "Sair Sapata",
      "color": "blue",
      "coords": [
        [23.216427, 77.375948],
        [23.216264, 77.375775],
        [23.216040, 77.376231],
        [23.216183, 77.376298]
      ]
    },
    {
      "name": "DB Mall",
      "color": "blue",
      "coords": [
        [23.231926, 77.429774],
        [23.231962, 77.430510],
        [23.233208, 77.430204],
        [23.232771, 77.429676]
      ]
    },
    {
      "name": "Peoples Mall",
      "color": "blue",
      "coords": [
        [23.303621, 77.421422],
        [23.305985, 77.422047],
        [23.305767, 77.423027],
        [23.303072, 77.422587]
      ]
    },
    {
      "name": "Zone 1",
      "color": "blue",
      "coords": [
        [23.246912, 77.431824],
        [23.229261, 77.426796],
        [23.233466, 77.437303]
      ]
    },
    {
      "name": "Zone 2",
      "color": "blue",
      "coords": [
        [23.233900, 77.436739],
        [23.231396, 77.432684],
        [23.222326, 77.437748],
        [23.222759, 77.439636]
      ]
      
      
    },
    {
      "name": "Shourya Smarak",
      "color": "blue",
      "coords": [
        [23.234265, 77.426926],
        [23.234265, 77.428064],
        [23.231949, 77.427946],
        [23.232537, 77.426140]
      ]
    },
    {
      "name": "Van Vihar",
      "color": "Yellow",
      "coords": [
        [23.241309, 77.373621],
        [23.237184, 77.356073],
        [23.230715, 77.354339],
        [23.218191, 77.368940],
        [23.228110, 77.376310]
      ]
    },
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
        [23.280556, 77.371425],
        [23.293880, 77.360353],
        [23.292934, 77.354946],
        [23.289544, 77.351513],
        [23.276851, 77.352285],
        [23.272987, 77.369709],
        [23.272120, 77.376060],
        [23.278979, 77.376575],
        [23.284971, 77.381982]
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
      "name": "MANIT",
      "color": "Green",
      "coords": [
        [23.213313, 77.418339],
        [23.219982, 77.408150],
        [23.220456, 77.403515],
        [23.216070, 77.397641],
        [23.210243, 77.398333],
        [23.206959, 77.400811],
        [23.207330, 77.412050],
        [23.207330, 77.412050]
      ]
    },
    {
      "name": "1",
      "color": "Green",
      "coords": [
        [23.249600, 77.395317],
        [23.237956, 77.400820],
        [23.221791, 77.381811],
        [23.228074, 77.376725],
        [23.238263, 77.373474]
      ]
    },
    {
      "name": "2",
      "color": "Green",
      "coords": [
        [23.220949, 77.381561],
        [23.214972, 77.379143],
        [23.218420, 77.368472],
        [23.227231, 77.376475]
      ]
    },
    {
      "name": "3",
      "color": "Green",
      "coords": [
        [23.237420, 77.401236],
        [23.215326, 77.397780],
        [23.206491, 77.398123],
        [23.209646, 77.380614],
        [23.220690, 77.382073]
      ]
    },
    {
      "name": "4",
      "color": "Green",
      "coords": [
        [23.237647, 77.401643],
        [23.243641, 77.410483],
        [23.241748, 77.420697],
        [23.235518, 77.426877],
        [23.214143, 77.417950],
        [23.220059, 77.410226],
        [23.221636, 77.403874],
        [23.217535, 77.399068]

      ]
    },
    {
      "name": "5",
      "color": "Green",
      "coords": [
        [23.252160, 77.449842],
        [23.231924, 77.450241],
        [23.230614, 77.480766],
        [23.251321, 77.480423]

      ]
    },
    {
      "name": "6",
      "color": "Green",
      "coords": [
        [23.252160, 77.449842],
        [23.231924, 77.450241],
        [23.223483, 77.439271],
        [23.234091, 77.436524],
        [23.246631, 77.432662]

      ]
    },
    {
      "name": "7",
      "color": "Green",
      "coords": [
        [23.231924, 77.450241],
        [23.223483, 77.439271],
        [23.222756, 77.480261],
        [23.230614, 77.480766]
      ]
    },
    {
      "name": "7",
      "color": "Green",
      "coords": [
        [23.223483, 77.439271],
        [23.222756, 77.480261],
        [23.204658, 77.480329],
        [23.203830, 77.438872]
      ]
    },
    {
      "name": "8",
      "color": "Green",
      "coords": [
        [23.204658, 77.480329],
        [23.203830, 77.438872],
        [23.153538, 77.436417],
        [23.153152, 77.481659]
      ]
    },
    {
      "name": "9",
      "color": "Green",
      "coords": [
        [23.229339, 77.428186],
        [23.230643, 77.434560],
        [23.218259, 77.439066],
        [23.220093, 77.420198],
        [23.228503, 77.423686]
      ]
    },
    {
      "name": "10",
      "color": "Green",
      "coords": [
        [23.218259, 77.439066],
        [23.220093, 77.420198],
        [23.213368, 77.418424],
        [23.204297, 77.408982],
        [23.204336, 77.417694],
        [23.214394, 77.419626]
      ]
    },
    {
      "name": "11",
      "color": "Green",
      "coords": [
        [23.214394, 77.419626],
        [23.217882, 77.438984],
        [23.206010, 77.439327],
        [23.208377, 77.424607]
      ]
    },
    {
      "name": "12",
      "color": "Yellow",
      "coords": [
        [23.200488, 77.421904],
        [23.204353, 77.417355],
        [23.214963, 77.419801],
        [23.205024, 77.425852]
      ]
    },
    {
      "name": "13",
      "color": "Green",
      "coords": [
        [23.237160, 77.400798],
        [23.249849, 77.394800],
        [23.246517, 77.404565],
        [23.243120, 77.401287],
        [23.245876, 77.407564],
        [23.251579, 77.411121],
        [23.250169, 77.412516],
        [23.244530, 77.410633]
      ]
    },
    {
      "name": "Lower Lake",
      "color": "Yellow",
      "coords": [
        [23.243184, 77.401496],
        [23.246837, 77.404983],
        [23.249529, 77.398567],
        [23.250810, 77.405541],
        [23.255745, 77.408610],
        [23.251836, 77.414050],
        [23.251643, 77.410633],
        [23.246837, 77.407982]
      ]
    },
    {
      "name": "14",
      "color": "Green",
      "coords": [
        [23.251771, 77.414469],
        [23.251579, 77.410633],
        [23.249529, 77.413911],
        [23.244210, 77.410284],
        [23.241774, 77.421444],
        [23.234660, 77.427721],
        [23.247222, 77.431348]
      ]
    },
    {
      "name": "15",
      "color": "Green",
      "coords": [
        [23.247222, 77.431348],
        [23.252348, 77.414608],
        [23.252989, 77.450877]
      ]
    },
    {
      "name": "16",
      "color": "Green",
      "coords": [
        [23.208060, 77.425280],
        [23.206009, 77.438462],
        [23.200432, 77.438253],
        [23.200624, 77.422002],
        [23.204983, 77.425628]
      ]
    },
    {
      "name": "17",
      "color": "Green",
      "coords": [
        [23.200047, 77.421444],
        [23.204727, 77.417119],
        [23.204856, 77.409108],
        [23.199886, 77.408679]
      ]
    },
    {
      "name": "18",
      "color": "Green",
      "coords": [
        [23.199886, 77.408679],
        [23.200517, 77.437690],
        [23.171640, 77.436917],
        [23.169589, 77.411425]
      ]
    },
    {
      "name": "19",
      "color": "Green",
      "coords": [
        [23.171640, 77.436917],
        [23.169589, 77.411425],
        [23.154201, 77.412112],
        [23.153885, 77.435801]
      ]
    },
    {
      "name": "20",
      "color": "Green",
      "coords": [
        [23.192470, 77.408679],
        [23.186632, 77.383359],
        [23.170031, 77.380971],
        [23.162677, 77.392185],
        [23.155306, 77.411855]
      ]
    },
    {
      "name": "21",
      "color": "Green",
      "coords": [
        [23.190026, 77.380176],
        [23.204601, 77.367802],
        [23.180446, 77.360454],
        [23.169888, 77.380084],
        [23.187330, 77.383751]
      ]
    },
    {
      "name": "22",
      "color": "Green",
      "coords": [
        [23.253460, 77.414728],
        [23.253198, 77.478907],
        [23.293813, 77.482330],
        [23.299707, 77.418008]
      ]
    },
    {
      "name": "22",
      "color": "Green",
      "coords": [
        [23.252536, 77.414285],
        [23.255536, 77.409018],
        [23.250503, 77.403960],
        [23.250696, 77.399009],
        [23.256020, 77.398903],
        [23.263667, 77.378886],
        [23.299387, 77.380515],
        [23.299387, 77.418610]
      ]
    },
    {
      "name": "Upper Lake",
      "color": "yellow",
      "coords": [
        [23.254038, 77.397271],
        [23.258138, 77.362767],
        [23.273278, 77.352982],
        [23.259242, 77.347146],
        [23.262710, 77.332212],
        [23.269198, 77.327045],
        [23.260336, 77.318949],
        [23.264926, 77.307752],
        [23.250524, 77.277951],
        [23.252740, 77.275367],
        [23.236279, 77.258142],
        [23.232955, 77.262620],
        [23.237387, 77.283808],
        [23.232322, 77.287425],
        [23.238970, 77.288459],
        [23.243085, 77.300517],
        [23.239286, 77.304134],
        [23.246884, 77.307580],
        [23.245459, 77.329629],
        [23.228795, 77.318821],
        [23.229268, 77.328777],
        [23.227691, 77.332553],
        [23.236840, 77.337875],
        [23.238575, 77.345428],
        [23.231477, 77.345771],
        [23.221223, 77.355213],
        [23.212231, 77.381305],
        [23.221539, 77.363109],
        [23.231004, 77.354526],
        [23.237786, 77.356071],
        [23.241257, 77.363796],
        [23.243938, 77.384052],
        [23.250405, 77.395038]
       
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
    { "id": 2, "position": [23.291543, 77.323860], "popup": "Ram Ratan" },
    { "id": 3, "position": [23.217519, 77.408548], "popup": "Ram Ratan" },
    { "id": 4, "position": [23.117119, 77.418948], "popup": "Ram Ratan" }
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