mermaid.initialize({
    startOnLoad: false
});

async function renderMermaid(text) {
    const container = document.getElementById("diagram");
    container.innerHTML = "";

    try {
        const { svg } = await mermaid.render("diagramGraph", text);
        container.innerHTML = svg;
    } catch (e) {
        container.innerHTML = `<div style="color:red">Mermaid Error: ${e.message}</div>`;
    }
}
