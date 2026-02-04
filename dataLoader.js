const fs = require("fs").promises;
const path = require("path");

async function loadSightings() {
  const filePath = path.join(__dirname, "..", "data", "sightings.json");

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.sightings || [];
  } catch (err) {
    console.error("Error loading sightings data:", err);
    throw new Error("Failed to load wildlife sightings data");
  }
}

module.exports = { loadSightings };
