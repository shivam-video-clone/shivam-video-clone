const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

/* -----------------------------
   IMAGE UPLOAD SETTINGS
----------------------------- */

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG and WEBP images are allowed."));
        }
    }
});


/* -----------------------------
   REPLICATE
----------------------------- */

const REPLICATE_API_TOKEN =
    process.env.REPLICATE_API_TOKEN;

const MODEL =
    "bytedance/seedance-1-pro";


/* -----------------------------
   HOME PAGE
----------------------------- */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


/* -----------------------------
   START ANIMATION
----------------------------- */

app.post(
    "/api/animate",
    upload.single("image"),
    async (req, res) => {

        try {

            if (!REPLICATE_API_TOKEN) {
                return res.status(500).json({
                    error: "REPLICATE_API_TOKEN is missing on server."
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    error: "Please upload an image."
                });
            }

            const prompt = req.body.prompt;

            if (!prompt || !prompt.trim()) {
                return res.status(400).json({
                    error: "Animation prompt is required."
                });
            }


            /* Convert image to data URL */

            const imageData =
                `data:${req.file.mimetype};base64,` +
                req.file.buffer.toString("base64");


            /* Create Replicate prediction */

            const response = await axios.post(
                `https://api.replicate.com/v1/models/${MODEL}/predictions`,
                {
                    input: {
                        image: imageData,
                        prompt: prompt.trim(),
                        duration: 5,
                        resolution: "1080p"
                    }
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${REPLICATE_API_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 30000
                }
            );


            return res.status(200).json({
                success: true,
                id: response.data.id,
                status: response.data.status
            });

        } catch (error) {

            console.error(
                "Animation Error:",
                error.response?.data || error.message
            );

            return res.status(500).json({
                success: false,
                error:
                    error.response?.data?.detail ||
                    error.response?.data?.error ||
                    error.message ||
                    "Animation request failed."
            });
        }
    }
);


/* -----------------------------
   CHECK ANIMATION STATUS
----------------------------- */

app.get("/api/status/:id", async (req, res) => {

    try {

        if (!REPLICATE_API_TOKEN) {
            return res.status(500).json({
                error: "REPLICATE_API_TOKEN is missing."
            });
        }

        const response = await axios.get(
            `https://api.replicate.com/v1/predictions/${req.params.id}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${REPLICATE_API_TOKEN}`
                },
                timeout: 30000
            }
        );

        const prediction = response.data;

        res.json({
            id: prediction.id,
            status: prediction.status,
            output: prediction.output || null,
            error: prediction.error || null
        });

    } catch (error) {

        console.error(
            "Status Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            error:
                error.response?.data?.detail ||
                error.message ||
                "Could not check animation status."
        });
    }
});


/* -----------------------------
   ERROR HANDLER
----------------------------- */

app.use((err, req, res, next) => {

    console.error("Server Error:", err.message);

    res.status(400).json({
        error: err.message || "Something went wrong."
    });
});


/* -----------------------------
   START SERVER
----------------------------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Image Animator Server running on port ${PORT}`
    );
});
