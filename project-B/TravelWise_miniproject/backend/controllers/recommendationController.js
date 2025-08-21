import csv from 'csv-parser';
import fs from 'fs';
import NodeGeocoder from 'node-geocoder';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize geocoder
const options = {
  provider: 'openstreetmap'
};

const geocoder = NodeGeocoder(options);

const getRecommendations = async (req, res) => {
  try {
    const { destination, hobby } = req.body;
    
    // Get coordinates for the user's destination
    const geocodeResult = await geocoder.geocode(destination);
    if (!geocodeResult || geocodeResult.length === 0) {
      return res.status(400).json({ error: 'Could not find coordinates for the destination' });
    }

    const destinationCoords = {
      latitude: geocodeResult[0].latitude,
      longitude: geocodeResult[0].longitude
    };

    const recommendations = [];
    const dataDir = path.join(__dirname, '../data');
    
    // Get all CSV files in the data directory
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.csv'));
    
    // Process each CSV file
    const processFile = (filePath) => {
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv({
            separator: ';', // Use semicolon as separator
            mapHeaders: ({ header }) => header.trim() // Trim whitespace from headers
          }))
          .on('data', (row) => {
            // Check if the place matches the hobby (checking both Type_of_Venue and Specialty)
            const typeOfVenue = row.Type_of_Venue ? row.Type_of_Venue.toLowerCase() : '';
            const specialty = row.Specialty ? row.Specialty.toLowerCase() : '';
            const adventureActivities = row.Adventure_Activities ? row.Adventure_Activities.toLowerCase() : '';
            
            if (typeOfVenue.includes(hobby.toLowerCase()) || 
                specialty.includes(hobby.toLowerCase()) || 
                adventureActivities.includes(hobby.toLowerCase())) {
              
              // Calculate distance between user's destination and this place
              const placeCoords = {
                latitude: parseFloat(row.Latitude),
                longitude: parseFloat(row.Longitude)
              };
              
              const distance = calculateDistance(
                destinationCoords.latitude,
                destinationCoords.longitude,
                placeCoords.latitude,
                placeCoords.longitude
              );

              recommendations.push({
                name: row.Place,
                location: row.Location,
                distance: distance.toFixed(2),
                activities: [
                  ...(row.Type_of_Venue ? [row.Type_of_Venue] : []),
                  ...(row.Specialty ? [row.Specialty] : []),
                  ...(row.Adventure_Activities ? row.Adventure_Activities.split(',').map(a => a.trim()) : [])
                ],
                bestTimeToVisit: row.Best_Time_to_Visit || 'Not specified'
              });
            }
          })
          .on('end', resolve)
          .on('error', reject);
      });
    };

    // Process all CSV files
    await Promise.all(files.map(file => processFile(path.join(dataDir, file))));

    // Sort recommendations by distance
    recommendations.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    
    // Return top 5 recommendations
    res.json({
      recommendations: recommendations.slice(0, 5)
    });

  } catch (error) {
    console.error('Error in getRecommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export { getRecommendations }; 