function buildMermaidFromJson(data) {
    const lines = [];
    lines.push("graph LR;");

    if (!data.processes) return lines.join("\n");

    data.processes.forEach((proc, pIdx) => {
        (proc.units || []).forEach((unit, uIdx) => {
            const subgraphId = `U_${pIdx}_${uIdx}`;
            lines.push(`subgraph ${subgraphId}[${unit.name}]`);

            const subs = unit.subs || [];
            subs.forEach((sub, sIdx) => {
                const nodeId = `S_${pIdx}_${uIdx}_${sIdx}`;
                lines.push(`${nodeId}[${sub.name}]`);
            });

            lines.push("end");

            for (let s = 0; s < subs.length - 1; s++) {
                lines.push(`S_${pIdx}_${uIdx}_${s} --> S_${pIdx}_${uIdx}_${s + 1}`);
            }

            if (uIdx > 0) {
                const prevSubs = proc.units[uIdx - 1].subs;
                if (prevSubs?.length > 0 && subs.length > 0) {
                    const prevLast = `S_${pIdx}_${uIdx - 1}_${prevSubs.length - 1}`;
                    const currFirst = `S_${pIdx}_${uIdx}_0`;
                    lines.push(`${prevLast} --> ${currFirst}`);
                }
            }
        });
    });

    return lines.join("\n");
}
