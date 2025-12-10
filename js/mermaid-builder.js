// 공정 / 세부공정 / 설비 데이터를 Mermaid 다이어그램 문자열로 변환
function buildMermaidFromJson(data) {
    const lines = [];

    // 1) 테마 / 스타일 설정
    lines.push(
        `%%{init: {
  'theme': 'neutral',
  'themeVariables': {
    'primaryColor': '#eef2ff',
    'primaryBorderColor': '#6366f1',
    'primaryTextColor': '#111827',
    'lineColor': '#4b5563',
    'fontSize': '13px',
    'fontFamily': 'Segoe UI, system-ui, sans-serif'
  },
  'flowchart': {
    'curve': 'basis',
    'htmlLabels': true
  }
}}%%`
    );

    // 2) 기본 graph 방향 + 공통 스타일 (가로 방향)
    lines.push("graph LR");
    lines.push("linkStyle default stroke:#4b5563,stroke-width:1.5px;");

    // 노드 스타일 정의
    lines.push("classDef step fill:#ffffff,stroke:#6366f1,stroke-width:1px,rx:4px,ry:4px;");
    lines.push("classDef stepEqp fill:#f3e8ff,stroke:#7c3aed,stroke-width:1px,rx:4px,ry:4px;");

    const procs = data.processes || [];
    if (procs.length === 0) {
        return lines.join("\n");
    }

    procs.forEach((proc, pIdx) => {
        const procId = `P_${pIdx}`;
        const subs = proc.subs || [];

        // 3) 공정 subgraph
        lines.push(`subgraph ${procId} ["${proc.name}"]`);
        lines.push("direction LR");          // ✅ 공정 내부는 가로 방향

        subs.forEach((sub, sIdx) => {
            const nodeId = `S_${pIdx}_${sIdx}`;

            // 라벨: 공정명 + (설비) 를 줄바꿈해서 표현
            const labelParts = [sub.name];
            if (sub.equipmentName) {
                labelParts.push(`(${sub.equipmentName})`);
            }
            const label = labelParts.join("<br/>");

            lines.push(`${nodeId}["${label}"]`);
            // 설비 유무에 따라 다른 스타일
            const cls = sub.equipmentName ? "stepEqp" : "step";
            lines.push(`class ${nodeId} ${cls};`);
        });

        lines.push("end");

        // 공정 박스 스타일 (연노랑 배경)
        lines.push(`style ${procId} fill:#fef9c3,stroke:#facc15,stroke-width:1px;`);

        // 4) 공정 내부 세부공정 연결
        for (let s = 0; s < subs.length - 1; s++) {
            lines.push(`S_${pIdx}_${s} --> S_${pIdx}_${s + 1}`);
        }

        // 5) 이전 공정의 마지막 세부공정 → 현재 공정의 첫 세부공정 연결
        if (pIdx > 0) {
            const prevSubs = procs[pIdx - 1].subs || [];
            if (prevSubs.length > 0 && subs.length > 0) {
                const prevLast = `S_${pIdx - 1}_${prevSubs.length - 1}`;
                const currFirst = `S_${pIdx}_0`;
                lines.push(`${prevLast} --> ${currFirst}`);
            }
        }
    });

    return lines.join("\n");
}
