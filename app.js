const imageInput = document.getElementById('images');
const promptInput = document.getElementById('prompts');
const startButton = document.getElementById('start');
const statusText = document.getElementById('status');

// Image count बदलने पर
imageInput.addEventListener('change', updatePreview);

// Prompt लिखने पर
promptInput.addEventListener('input', updatePreview);

function getPrompts() {
    return promptInput.value
        .split(/\r?\n/)
        .map(prompt => prompt.trim())
        .filter(prompt => prompt.length > 0);
}

function updatePreview() {
    const images = Array.from(imageInput.files);
    const prompts = getPrompts();

    statusText.innerHTML = `
        <b>Images:</b> ${images.length}/50<br>
        <b>Prompts:</b> ${prompts.length}/50
        <hr>
    `;

    if (images.length === 0 && prompts.length === 0) {
        statusText.innerHTML = 'Waiting for images and prompts...';
        return;
    }

    // 50 से ज्यादा images
    if (images.length > 50) {
        statusText.innerHTML +=
            '<span style="color:red;">❌ Maximum 50 images allowed.</span>';
        return;
    }

    // 50 से ज्यादा prompts
    if (prompts.length > 50) {
        statusText.innerHTML +=
            '<span style="color:red;">❌ Maximum 50 prompts allowed.</span>';
        return;
    }

    // Matching preview
    const total = Math.max(images.length, prompts.length);

    for (let i = 0; i < total; i++) {
        const imageExists = i < images.length;
        const promptExists = i < prompts.length;

        if (imageExists && promptExists) {
            statusText.innerHTML +=
                `✅ Image #${i + 1} → Prompt #${i + 1}<br>`;
        } 
        else if (imageExists && !promptExists) {
            statusText.innerHTML +=
                `⚠️ Image #${i + 1} → Prompt missing<br>`;
        } 
        else if (!imageExists && promptExists) {
            statusText.innerHTML +=
                `⚠️ Prompt #${i + 1} → Image missing<br>`;
        }
    }
}

// Start Animation
startButton.addEventListener('click', () => {

    const images = Array.from(imageInput.files);
    const prompts = getPrompts();

    // Images check
    if (images.length === 0) {
        statusText.innerHTML =
            '❌ Please upload at least 1 image.';
        return;
    }

    // Maximum images
    if (images.length > 50) {
        statusText.innerHTML =
            '❌ Maximum 50 images allowed.';
        return;
    }

    // Prompt check
    if (prompts.length === 0) {
        statusText.innerHTML =
            '❌ Please paste animation prompts.';
        return;
    }

    // Maximum prompts
    if (prompts.length > 50) {
        statusText.innerHTML =
            '❌ Maximum 50 prompts allowed.';
        return;
    }

    // Image/Prompt count matching
    if (images.length !== prompts.length) {
        statusText.innerHTML = `
            ❌ Images और Prompts की संख्या बराबर होनी चाहिए।<br><br>
            Images: ${images.length}<br>
            Prompts: ${prompts.length}
        `;
        return;
    }

    // Final sequence
    statusText.innerHTML = `
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
