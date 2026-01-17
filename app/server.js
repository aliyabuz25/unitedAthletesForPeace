const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 6750;

// Enable CORS for all origins (or you can restrict it to your frontend domain)
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'distinguishedAmbassadors.json');

// Route to handle form submission
app.post('/uathletesBackend', (req, res) => {
    console.log('Received data:', req.body);

    const newData = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            // If file doesn't exist, start with empty array
            if (err.code === 'ENOENT') {
                saveData([newData], res);
                return;
            }
            return res.status(500).json({ error: 'Failed to read data file' });
        }

        let json = [];
        try {
            json = JSON.parse(data);
            if (!Array.isArray(json)) {
                json = [];
            }
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            json = [];
        }

        json.push(newData);

        saveData(json, res);
    });
});

// Route to get all ambassadors
app.get('/uathletesBackend', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.json([]); // Return empty array if file doesn't exist
            }
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to read data file' });
        }

        try {
            const json = JSON.parse(data);
            res.json(json);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).json({ error: 'Failed to parse data' });
        }
    });
});

function saveData(data, res) {
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Failed to save data' });
        }
        console.log('Data saved successfully');
        res.status(200).json({ message: 'Success', received: data });
    });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
