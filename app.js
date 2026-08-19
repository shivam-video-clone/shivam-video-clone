const imageInput = document.getElementById('images');
const promptInput = document.getElementById('prompts');
const startButton = document.getElementById('start');
const statusText = document.getElementById('status');

startButton.addEventListener('click', () => {
    const images = imageInput.files;

    const prompts = promptInput.value
        .split('\n')
        .map(p => p.trim())
        .filter(p => p !== '');

    if (images.length === 0) {
        statusText.textContent = 'Please upload images.';
        return;
    }

    if (images.length > 50) {
        statusText.textContent = 'Maximum 50 images allowed.';
        return;
    }

    if (images.length !== prompts.length) {
        statusText.textContent =
            `Images: ${images.length} | Prompts: ${prompts.length}. Both must be equal.`;
        return;
    }

    statusText.textContent =
        `${images.length} images ready for animation.`;
});
