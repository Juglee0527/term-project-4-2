function buildMermaidFromJson(data) {
    const lines = [];
    lines.push("graph LR;");

    if (!data.processes) return lines.join("\n");

    const procs = data.processes;

    procs.forEach((proc, pIdx) => {
        const subgraphId = `P_${pIdx}`;
        lines.push(`subgraph ${subgraphId}[${proc.name}]`);

        const subs = proc.subs || [];
        subs.forEach((sub, sIdx) => {
            const nodeId = `S_${pIdx}_${sIdx}`;
            const label = sub.equipmentName
                ? `${sub.name} (${sub.equipmentName})`
                : sub.name;
            lines.push(`${nodeId}[${label}]`);
        });

        lines.push("end");

        // 공정 안에서 세부공정 순서 연결
        for (let s = 0; s < subs.length - 1; s++) {
            lines.push(`S_${pIdx}_${s} --> S_${pIdx}_${s + 1}`);
        }

        // 이전 공정의 마지막 세부공정 → 현재 공정의 첫 세부공정
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
