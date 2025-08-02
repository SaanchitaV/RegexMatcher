const vscode = acquireVsCodeApi();

const patternInput = document.getElementById('pattern');
const flagsInput = document.getElementById('flags');
const sampleInput = document.getElementById('sample');
const previewDiv = document.getElementById('preview');

function updatePreview() {
    const pattern = patternInput.value;
    const flags = flagsInput.value;
    const text = sampleInput.value;

    try {
        const regex = new RegExp(pattern, flags);
        const matches = [...text.matchAll(regex)];
        previewDiv.innerHTML = `Matches found: ${matches.length}<br>` +
            matches.map(m => `<mark>${m[0]}</mark>`).join(', ');
    } catch (err) {
        previewDiv.textContent = `Error: ${err.message}`;
    }
}

patternInput.addEventListener('input', updatePreview);
flagsInput.addEventListener('input', updatePreview);
sampleInput.addEventListener('input', updatePreview);

document.getElementById('select').addEventListener('click', () => {
    vscode.postMessage({
        command: 'selectMatches',
        pattern: patternInput.value,
        flags: flagsInput.value
    });
});

document.getElementById('delete').addEventListener('click', () => {
    vscode.postMessage({
        command: 'deleteMatches',
        pattern: patternInput.value,
        flags: flagsInput.value
    });
});