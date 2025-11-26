mermaid.initialize({
    startOnLoad: false
});

async function renderMermaid(mermaidText) {
    const container = document.getElementById('diagram');
    container.innerHTML = '';

    try {
        const { svg } = await mermaid.render('diagramGraph', mermaidText);
        container.innerHTML = svg;
    } catch (e) {
        console.error(e);
        alert('Mermaid 렌더링 오류: ' + e.message);
    }
}
