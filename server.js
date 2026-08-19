const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// यहाँ हमने टोकन को कोड से हटाकर सुरक्षित (Environment Variable) बना दिया है
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

app.post('/api/animate', async (req, res) => {
    try {
        const { image_url, prompt } = req.body;
        
        // Replicate API कॉल
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PixFlow Server running on port ${PORT}`));
