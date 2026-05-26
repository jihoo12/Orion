import 'mathjax/es5/tex-svg.js';
async function initmathjax() {
    if (window.MathJax && window.MathJax.startup) {
        await window.MathJax.startup.promise;
    }
}
function renderMath() {
    const tex = document.getElementById("app").textContent;
    const svgNode = window.MathJax.tex2svg(tex, { display: true });
    const appElement = document.querySelector('#app');
    if (appElement) {
        appElement.innerHTML = '';
        appElement.appendChild(svgNode);
    }
}
await initmathjax();
renderMath();