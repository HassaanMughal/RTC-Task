require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const WebSocket = require("ws");
const http = require("http");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const bodyParser = require('body-parser');
const coordinatesRoutes = require('./routes/coordinates');
const Coordinate = require("./models/coordinate");

// // database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// // routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/coordinates', coordinatesRoutes);

const port = process.env.PORT || 8080;

// Create an HTTP server and integrate WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
  
    ws.on('message', async (message) => {
      try {
        const { x, y, z } = JSON.parse(message);
        const newCoordinate = new Coordinate({ x, y, z });
        await newCoordinate.save();
        console.log('Coordinates saved:', newCoordinate);
      } catch (error) {
        console.error('Error saving coordinates:', error);
      }
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  server.listen(port, () => {
    console.log(`Server running on port ${port}...`);
  });
  