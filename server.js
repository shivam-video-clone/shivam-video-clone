const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// अपना API Token यहाँ पेस्ट करें
const REPLICATE_API_TOKEN = 'export REPLICATE_API_TOKEN=<paste-your-token-here>'; 

app.post('/api/animate', async (req, res) => {
    try {
        const { image_url, prompt } = req.body;
        
        // Replicate API कॉल - इमेज टू वीडियो
        const response = await axios.post('https://api.replicate.com/v1/models/bytedance/seedance-2-5-internal/predictions', {
            input: {
                image: image_url,
                prompt: prompt
            }
        }, {
            headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Animation Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to animate' });
    }
});

app.listen(3000, () => console.log('PixFlow Server running on port 3000'));
