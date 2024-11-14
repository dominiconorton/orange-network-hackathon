import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.use(express.json());

// Existing proxy endpoint
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

// New endpoint for generating advice
app.post('/generate-advice', async (req, res) => {
    const { incidentDescription } = req.body;

    const requestBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are an assistant tasked with generating concise and clear advisory messages for automated vehicles. Each message should be structured to give immediate and actionable guidance based on specific incident data. Respond in the following format:\n\n[Brief incident description]. [Primary action]. [Optional additional guidance].\n\nExample:\n- Accident detected. Rerouting to avoid delays. Maintaining safe following distance.\n\nOnly include the advisory message in the response. Avoid extra context or explanations."
            },
            {
                role: "user",
                content: incidentDescription
            }
        ]
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Use OPENAI_API_KEY environment variable
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate advice' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});