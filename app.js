// Global State
let uploadedImages = [];
let promptsList = [];

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const imageCountInfo = document.getElementById('imageCountInfo');
const promptInput = document.getElementById('promptInput');
const promptCountInfo = document.getElementById('promptCountInfo');
const startBtn = document.getElementById('startBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const queuePreview = document.getElementById('queuePreview');
const reportBox = document.getElementById('reportBox');

// Event Listeners for Upload
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#6366f1';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#334155';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#334155';
    handleFiles(e.dataTransfer.files);
});

// Handle File Selection (Max 50)
function handleFiles(files) {
    for (let file of files) {
        if (uploadedImages.length >= 50) {
            alert('Maximum limit of 50 images reached.');
            break;
        }
        if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            uploadedImages.push(file);
        }
    }
    updateImageUI();
}

function updateImageUI() {
    imageCountInfo.textContent = `${uploadedImages.length}/50 images uploaded`;
}

// Handle Prompt Textarea Input
promptInput.addEventListener('input', () => {
    const text = promptInput.value.trim();
    promptsList = text === '' ? [] : text.split('\n').map(p => p.trim());
    promptCountInfo.textContent = `${promptsList.length} prompts entered`;
});

// Start Button Validation & Simulation (Step 1 Prototype test)
startBtn.addEventListener('click', () => {
    if (uploadedImages.length === 0) {
        alert('Please upload at least one image.');
        return;
    }
    if (promptsList.length === 0) {
        alert('Please enter animation prompts.');
        return;
    }
    if (uploadedImages.length !== promptsList.length) {
        alert(`Mismatch Error: You have ${uploadedImages.length} images but ${promptsList.length} prompts. Counts must match!`);
        return;
    }

    // Start Simulation Flow for Step 1
    startSimulation();
});

// Prototype Simulation of Auto Flow
function startSimulation() {
    startBtn.disabled = true;
    let total = uploadedImages.length;
    let current = 0;

    queuePreview.innerHTML = '';
    
    // Populate queue view
    uploadedImages.forEach((img, index) => {
        const div = document.createElement('div');
        div.className = 'queue-item';
        div.id = `queue-item-${index}`;
        div.innerHTML = `<span>Image #${index + 1} (${img.name})</span> <span style="color: #94a3b8;">Waiting</span>`;
        queuePreview.appendChild(div);
    });

    function processNext() {
        if (current >= total) {
            progressText.textContent = 'Processing Complete!';
            progressBar.style.width = '100%';
            startBtn.disabled = false;
            
            // Show Final Report
            reportBox.innerHTML = `
                <p><strong>Completed:</strong> ${total}</p>
                <p><strong>Failed:</strong> 0</p>
                <p><strong>Blocked:</strong> 0</p>
                <p style="color: #22c55e; margin-top: 5px;">✓ All test mock animations finished successfully!</p>
            `;
            return;
        }

        let percent = ((current) / total) * 100;
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `Processing ${current + 1}/${total} — Image #${current + 1} Animating...`;
        
        const item = document.getElementById(`queue-item-${current}`);
        if(item) {
            item.innerHTML = `<span>Image #${current + 1}</span> <span style="color: #f59e0b;">Animating...</span>`;
        }

        // Simulate 1 second per image processing for testing UI
        setTimeout(() => {
            if(item) {
                item.innerHTML = `<span>Image #${current + 1}</span> <span style="color: #22c55e;">Completed</span>`;
            }
            current++;
            processNext();
        }, 1000);
    }

    processNext();
}
