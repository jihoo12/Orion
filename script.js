import 'mathjax/es5/tex-svg.js';

// ── State ─────────────────────────────────────────────
const statusDot  = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const latexInput = document.getElementById('latexInput');
const appEl      = document.getElementById('app');
const emptyState = document.getElementById('emptyState');
const clearBtn   = document.getElementById('clearBtn');
const copyBtn    = document.getElementById('copyBtn');
const chips      = document.querySelectorAll('.chip');

// ── MathJax init ──────────────────────────────────────
async function initMathJax() {
    if (window.MathJax?.startup) {
        await window.MathJax.startup.promise;
    }
}

// ── Render ────────────────────────────────────────────
function renderMath(source) {
    if (!source.trim()) {
        appEl.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }

    try {
        const svgNode = window.MathJax.tex2svg(source, { display: true });

        // Detect MathJax internal errors (merror)
        const errorEl = svgNode.querySelector('merror, [data-mml-node="merror"]');
        if (errorEl) throw new Error('LaTeX syntax error.');

        emptyState.style.display = 'none';
        appEl.innerHTML = '';
        appEl.appendChild(svgNode);
        appEl.classList.remove('rendered');
        void appEl.offsetWidth; // reflow to restart animation
        appEl.classList.add('rendered');

    } catch (err) {
        showError(err.message || 'An error occurred during rendering.');
    }
}

function showError(msg) {
    emptyState.style.display = 'none';
    appEl.innerHTML = `<div class="error-msg">⚠ ${msg}</div>`;
}

// ── Debounce (for live rendering) ─────────────────────
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

const liveRender = debounce(() => renderMath(latexInput.value), 400);

// ── Example chips ─────────────────────────────────────
chips.forEach(chip => {
    chip.addEventListener('click', () => {
        latexInput.value = chip.dataset.latex;
        renderMath(latexInput.value);
        latexInput.focus();
    });
});

// ── Clear button ──────────────────────────────────────
clearBtn.addEventListener('click', () => {
    latexInput.value = '';
    appEl.innerHTML = '';
    emptyState.style.display = 'flex';
    latexInput.focus();
});

// ── Copy SVG button ───────────────────────────────────
copyBtn.addEventListener('click', async () => {
    const svg = appEl.querySelector('svg');
    if (!svg) return;

    try {
        await navigator.clipboard.writeText(svg.outerHTML);
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copied ✓';
        copyBtn.style.color = '#4caf7d';
        setTimeout(() => {
            copyBtn.textContent = original;
            copyBtn.style.color = '';
        }, 1800);
    } catch {
        copyBtn.textContent = 'Copy failed';
        setTimeout(() => { copyBtn.textContent = 'Copy SVG'; }, 1800);
    }
});

// ── Main ──────────────────────────────────────────────
async function main() {
    await initMathJax();

    statusDot.classList.add('active');
    statusText.textContent = 'Ready';

    // Live rendering on input
    latexInput.addEventListener('input', liveRender);

    // Ctrl / Cmd + Enter → render immediately
    latexInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            renderMath(latexInput.value);
        }
    });
}

main();