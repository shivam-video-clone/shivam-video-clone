const express = require('express');
const axios = require('axios');
require('dotenv').config();

const path = require('path');

const app = express();

app.use(express.json());

// Frontend files
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Animation API
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

app.post('/api/animate', async (req, res) => {
    try {
        const { image_url, prompt } = req.body;

        if (!image_url || !prompt) {
            return res.status(400).json({
                error: 'image_url and prompt are required'
            });
        }

        const response = await axios.post(
            'https://api.replicate.com/v1/models/bytedance/seedance-2-5-internal/predictions',
            {
                input: {
                    image: image_url,
                    prompt: prompt
                }
            },
            {
                headers: {
                    'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error(error.response?.data || error.message);

        res.status(500).json({
            error: 'Failed to animate'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Image Animator Server running on port ${PORT}`);
});
