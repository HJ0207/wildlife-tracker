/********************************************************************************
* WEB322 - Assignment 01
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Hasti Jasoliya      Student ID: 132384249     Date: February 3, 2026
*
********************************************************************************/

const express = require("express");
const path = require("path");
const { loadSightings } = require("./utils/dataLoader");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// ALL 8 API ENDPOINTS
app.get("/api/sightings", async (req, res) => {
  try {
    const sightings = await loadSightings();
    res.json(sightings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/sightings/verified", async (req, res) => {
  try {
    const sightings = await loadSightings();
    const verified = sightings.filter(s => s.verified === true);
    res.json(verified);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/sightings/species-list", async (req, res) => {
  try {
    const sightings = await loadSightings();
    const speciesNames = sightings.map(s => s.species);
    const unique = [...new Set(speciesNames)];
    res.json(unique);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/sightings/habitat/forest", async (req, res) => {
  try {
    const sightings = await loadSightings();
    const forestSightings = sightings.filter(
      s => s.habitat && s.habitat.toLowerCase() === "forest"
    );
    res.json({
      habitat: "forest",
      sightings: forestSightings,
      count: forestSightings.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/sightings/search/eagle", async (req, res) => {
  try {
    const sightings = await loadSightings();
    const found = sightings.find(s =>
      s.species && s.species.toLowerCase().includes("eagle")
    );
    if (!found) return res.status(404).json({ message: "No eagle sighting found" });
    res.json(found);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/sightings/find-index/moose", async (req, res) => {
  try {
    const sightings = await loadSightings();
    const index = sightings.findIndex(
      s => s.species && s.species.toLowerCase() === "moose"
    );
    if (index === -1) return res.status(404).json({ message: "Moose not found" });
    res.json({ index, sighting: sightings[index] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/sightings/recent", async (req, res) => {
  try {
    const sightings = await loadSightings();
    const sorted = [...sightings].sort(
      (a, b) => new Date(b.date || b.timestamp || b.location) - new Date(a.date || a.timestamp || a.location)
    );
    const recent = sorted.slice(0, 3).map(s => ({
      species: s.species,
      habitat: s.habitat,
      verified: s.verified
    }));
    res.json(recent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
