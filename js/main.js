document.addEventListener("DOMContentLoaded", async () => {
    await initVersions();
    renderCurrentVersion();
    renderVersionList();
    bindEvents();
});

function bindEvents() {
    document.getElementById("btn-edit").onclick = openEditor;
    document.getElementById("btn-print").onclick = () => window.print();
    document.getElementById("btn-save-version").onclick = saveVersionFromEditor;
    document.getElementById("btn-cancel-modal").onclick = closeEditor;

    document.getElementById("version-list").onclick = function (e) {
        if (!e.target.dataset.id) return;
        const id = e.target.dataset.id;
        setCurrentVersion(id);
        renderCurrentVersion();
        renderVersionList();
    };
}

function renderCurrentVersion() {
    const version = getCurrentVersion();
    document.getElementById("current-version-label").innerText =
        `현재 버전: ${version.id} (${version.createdAt})`;

    const mermaidText = buildMermaidFromJson(version.data);
    renderMermaid(mermaidText);
}

function renderVersionList() {
    const ul = document.getElementById("version-list");
    ul.innerHTML = "";

    const list = getVersions().slice().reverse(); // 최신순

    list.forEach(v => {
        const li = document.createElement("li");
        li.innerText = `${v.id} (${v.createdAt.split("T")[0]})`;
        li.dataset.id = v.id;
        ul.appendChild(li);
    });
}

/* 팝업 */
function openEditor() {
    const version = getCurrentVersion();
    const text = JSON.stringify(version.data, null, 2);
    document.getElementById("json-editor").value = text;
    document.getElementById("modal-backdrop").classList.remove("hidden");
}

function closeEditor() {
    document.getElementById("modal-backdrop").classList.add("hidden");
}

/* 새 버전 저장 */
function saveVersionFromEditor() {
    try {
        const raw = document.getElementById("json-editor").value;
        const obj = JSON.parse(raw);
        saveNewVersion(obj);
        closeEditor();
        renderCurrentVersion();
        renderVersionList();
    } catch (e) {
        alert("JSON 형식 오류");
    }
}
