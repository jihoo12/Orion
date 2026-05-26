import 'mathjax/es5/tex-svg.js';

// MathJax 초기화 확인 함수
async function initMathJax() {
    if (window.MathJax && window.MathJax.startup) {
        await window.MathJax.startup.promise;
    }
}

// 수식을 렌더링하는 함수
function renderMath() {
    // 1. .textContent 대신 .value 사용
    const source = document.getElementById("latexInput").value; 
    
    // 2. MathJax 수식 변환 (출력은 SVG 노드)
    const svgNode = window.MathJax.tex2svg(source, { display: true });
    
    const appElement = document.querySelector('#app');
    if (appElement) {
        appElement.innerHTML = '';
        appElement.appendChild(svgNode);
    }
}

// 초기화 후 이벤트 리스너 등록 수행
async function main() {
    await initMathJax();

    const latexInput = document.getElementById('latexInput');
    
    latexInput.addEventListener('keydown', function(event) {
        // Ctrl + Enter 또는 Mac의 Cmd + Enter를 눌렀을 때
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault(); // 기본 줄바꿈 방지
            renderMath(); // 수식 변환 실행
        }
    });
}

main();