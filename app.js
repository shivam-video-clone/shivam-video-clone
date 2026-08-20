const imageInput = document.getElementById("images");
const promptInput = document.getElementById("prompts");
const startButton = document.getElementById("start");
const statusBox = document.getElementById("status");
const imageCount = document.getElementById("imageCount");
const promptCount = document.getElementById("promptCount");
const preview = document.getElementById("preview");

function getPrompts() {
    return promptInput.value
        .split(/\r?\n/)
        .map(p => p.trim())
        .filter(Boolean);
}

imageInput.addEventListener("change", () => {

    const files = Array.from(imageInput.files);

    imageCount.textContent =
        `${files.length} / 50 Images`;

    preview.innerHTML = "";

    files.slice(0, 50).forEach(file => {

        const img = document.createElement("img");

        img.src = URL.createObjectURL(file);

        preview.appendChild(img);
    });
});


promptInput.addEventListener("input", () => {

    const prompts = getPrompts();

    promptCount.textContent =
        `${prompts.length} / 50 Prompts`;
});


startButton.addEventListener("click", async () => {

    const files = Array.from(imageInput.files);
    const prompts = getPrompts();

    if (files.length !== 1) {
        statusBox.innerHTML =
            "❌ अभी test के लिए सिर्फ 1 image upload करें।";
        return;
    }

    if (prompts.length !== 1) {
        statusBox.innerHTML =
            "❌ अभी test के लिए सिर्फ 1 prompt डालें।";
        return;
    }

    startButton.disabled = true;
    startButton.textContent = "⏳ Starting...";

    statusBox.innerHTML =
        "📤 Image server पर भेजी जा रही है...";

    try {

        const formData = new FormData();

        formData.append("image", files[0]);
        formData.append("prompt", prompts[0]);

        const response = await fetch(
            "/api/animate",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Animation request failed."
            );
        }

        statusBox.innerHTML =
            `🎬 Animation started.<br>
             Prediction ID: ${data.id}<br>
             Status: ${data.status}`;

        checkStatus(data.id);

    } catch (error) {

        statusBox.innerHTML =
            `❌ Error: ${error.message}`;

        startButton.disabled = false;
        startButton.textContent =
            "▶ Start Animation";
    }
});


async function checkStatus(id) {

    try {

        const response = await fetch(
            `/api/status/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Status check failed."
            );
        }


        if (data.status === "succeeded") {

            statusBox.innerHTML =
                `✅ Animation completed!<br><br>
                 <a href="${data.output}"
                 target="_blank"
                 download>
                 🎥 Open / Download Video
                 </a>`;

            startButton.disabled = false;
            startButton.textContent =
                "▶ Start Animation";

            return;
        }


        if (data.status === "failed" ||
            data.status === "canceled") {

            statusBox.innerHTML =
                `❌ Animation ${data.status}.<br>
                 ${data.error || ""}`;

            startButton.disabled = false;
            startButton.textContent =
                "▶ Start Animation";

            return;
        }


        statusBox.innerHTML =
            `⏳ Animation processing...<br>
             Status: ${data.status}`;

        setTimeout(() => {
            checkStatus(id);
        }, 5000);

    } catch (error) {

        statusBox.innerHTML =
            `❌ Status Error: ${error.message}`;

        startButton.disabled = false;
        startButton.textContent =
            "▶ Start Animation";
    }
            }    statusText.innerHTML = `
        <b>✅ Ready for AutoFlow</b><br><br>
    `;

    for (let i = 0; i < images.length; i++) {
        statusText.innerHTML += `
            Image #${i + 1} → Prompt #${i + 1}<br>
        `;
    }

    statusText.innerHTML += `
        <br>
        <b>🎬 ${images.length} images ready.</b><br>
        Animation system will be connected in the next step.
    `;
});
