// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // Use PORT environment variable

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(express.json());

app.post('/proxy', async (req, res) => {
    const apiUrl = 'https://api.orange.com/camara/orange-lab/device-reachability-status/v0/retrieve';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ORANGE_API_TOKEN}`, // Use ORANGE_API_TOKEN environment variable
                'accept': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});