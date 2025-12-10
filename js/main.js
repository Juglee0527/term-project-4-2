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
    document.getElementById("btn-add-process").onclick = () => addProcessBlock();

    document.getElementById("version-list").onclick = function (e) {
        const li = e.target.closest("li");
        if (!li || !li.dataset.id) return;
        const id = li.dataset.id;
        setCurrentVersion(id);
        renderCurrentVersion();
        renderVersionList();
    };
}

/* ====== 공통 렌더 ====== */

function renderCurrentVersion() {
    const version = getCurrentVersion();
    if (!version) return;

    // 버전 텍스트
    document.getElementById("current-version-label").innerText =
        `${version.id} · ${version.createdAt}`;

    // 통계 계산 + 정보바 반영
    const stats = calcStats(version.data || {});
    updateInfoBar(stats);

    // 다이어그램 렌더
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

/* ====== 편집 팝업 ====== */

function openEditor() {
    const version = getCurrentVersion();
    const data = version.data || {};

    const procContainer = document.getElementById("editor-processes");
    procContainer.innerHTML = "";

    const procs = data.processes || [];
    if (procs.length === 0) {
        addProcessBlock();
    } else {
        procs.forEach(p => addProcessBlock(p));
    }

    document.getElementById("modal-backdrop").classList.remove("hidden");
}

function closeEditor() {
    document.getElementById("modal-backdrop").classList.add("hidden");
}

/* 공정 블럭 추가 */

function addProcessBlock(procData) {
    const container = document.getElementById("editor-processes");

    const div = document.createElement("div");
    div.className = "unit-block"; // CSS 재활용

    div.innerHTML = `
    <div class="unit-header">
      <span>공정</span>
      <input type="text" class="proc-name" placeholder="공정명" />
      <button type="button" class="btn-add-sub">세부공정 추가</button>
      <button type="button" class="btn-del-proc">삭제</button>
    </div>
    <div class="sub-list"></div>
  `;

    container.appendChild(div);

    const procNameInput = div.querySelector(".proc-name");
    const subList = div.querySelector(".sub-list");
    const btnAddSub = div.querySelector(".btn-add-sub");
    const btnDelProc = div.querySelector(".btn-del-proc");

    btnAddSub.onclick = () => addSubRow(subList);
    btnDelProc.onclick = () => div.remove();

    if (procData) {
        procNameInput.value = procData.name || "";
        (procData.subs || []).forEach(s => addSubRow(subList, s));
    } else {
        addSubRow(subList);
    }
}

/* 세부공정 + 설비 행 추가 */

function addSubRow(subListElem, subData) {
    const row = document.createElement("div");
    row.className = "sub-row";
    row.innerHTML = `
    <input type="text" class="sub-name" placeholder="세부공정명" />
    <input type="text" class="sub-eqp" placeholder="설비명 (선택)" />
    <button type="button" class="btn-del-sub">X</button>
  `;
    subListElem.appendChild(row);

    const nameInput = row.querySelector(".sub-name");
    const eqpInput  = row.querySelector(".sub-eqp");
    const btnDelSub = row.querySelector(".btn-del-sub");

    btnDelSub.onclick = () => row.remove();

    if (subData) {
        nameInput.value = subData.name || "";
        eqpInput.value = subData.equipmentName || "";
    }
}

/* ====== 새 버전 저장 ====== */

function saveVersionFromEditor() {
    try {
        const nextData = collectDataFromEditor();
        saveNewVersion(nextData);
        closeEditor();
        renderCurrentVersion();
        renderVersionList();
    } catch (e) {
        alert("입력값 오류: " + e.message);
    }
}

/* 폼 → JSON 변환 */

function collectDataFromEditor() {
    const procContainer = document.getElementById("editor-processes");
    const procBlocks = Array.from(procContainer.getElementsByClassName("unit-block"));

    if (procBlocks.length === 0) {
        throw new Error("공정을 최소 1개 이상 입력해야 합니다.");
    }

    const processes = procBlocks.map((block, pIdx) => {
        const procName = block.querySelector(".proc-name").value.trim();
        if (!procName) {
            throw new Error("공정명은 비워둘 수 없습니다.");
        }

        const subRows = Array.from(block.getElementsByClassName("sub-row"));
        if (subRows.length === 0) {
            throw new Error("세부공정을 최소 1개 이상 입력해야 합니다.");
        }

        const subs = subRows.map((row, sIdx) => {
            const subName = row.querySelector(".sub-name").value.trim();
            const eqpName = row.querySelector(".sub-eqp").value.trim();
            if (!subName) {
                throw new Error("세부공정명은 비워둘 수 없습니다.");
            }
            return {
                id: `S-${pIdx + 1}-${sIdx + 1}`,
                name: subName,
                equipmentName: eqpName || null
            };
        });

        return {
            id: `P-${pIdx + 1}`,
            name: procName,
            subs
        };
    });

    return { processes };
}

/* ====== 통계 계산 / 정보바 반영 ====== */

function calcStats(data) {
    const procs = data.processes || [];
    let processCount = procs.length;
    let subCount = 0;
    let equipCount = 0;

    procs.forEach(p => {
        (p.subs || []).forEach(sub => {
            subCount++;
            if (sub.equipmentName) {
                equipCount++;
            }
        });
    });

    return { processCount, subCount, equipCount };
}

function updateInfoBar(stats) {
    const { processCount, subCount, equipCount } = stats;
    const procEl = document.getElementById("info-process-count");
    const subEl = document.getElementById("info-sub-count");
    const eqpEl = document.getElementById("info-eqp-count");

    if (procEl) procEl.innerText = processCount;
    if (subEl) subEl.innerText = subCount;
    if (eqpEl) eqpEl.innerText = equipCount;
}