function buildMermaidFromJson(data) {
    const lines = [];
    lines.push('graph LR;');

    if (!data.processes) {
        return lines.join('\n');
    }

    data.processes.forEach((proc, pIdx) => {
        (proc.units || []).forEach((unit, uIdx) => {
            const subgraphId = `U_${pIdx}_${uIdx}`;
            lines.push(`subgraph ${subgraphId}[${unit.name}]`);

            const subs = unit.subs || [];
            subs.forEach((sub, sIdx) => {
                const nodeId = `S_${pIdx}_${uIdx}_${sIdx}`;
                lines.push(`${nodeId}[${sub.name}]`);
            });

            lines.push('end');

            // 단위공정 내부 연결
            for (let sIdx = 0; sIdx < subs.length - 1; sIdx++) {
                const fromId = `S_${pIdx}_${uIdx}_${sIdx}`;
                const toId = `S_${pIdx}_${uIdx}_${sIdx + 1}`;
                lines.push(`${fromId} --> ${toId}`);
            }

            // 이전 단위공정 마지막 → 현재 단위공정 첫 번째
            if (uIdx > 0) {
                const prevSubs = proc.units[uIdx - 1].subs || [];
                const currSubs = unit.subs || [];
                if (prevSubs.length > 0 && currSubs.length > 0) {
                    const prevLastId = `S_${pIdx}_${uIdx - 1}_${prevSubs.length - 1}`;
                    const currFirstId = `S_${pIdx}_${uIdx}_0`;
                    lines.push(`${prevLastId} --> ${currFirstId}`);
                }
            }
        });
    });

    return lines.join('\n');
}
