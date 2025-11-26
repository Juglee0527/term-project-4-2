document.addEventListener('DOMContentLoaded', async () => {
    const btnGenerate = document.getElementById('btn-generate');

    let currentData = loadFromLocal();

    if (!currentData) {
        try {
            currentData = await loadSampleData();
            saveToLocal(currentData);
        } catch (e) {
            console.error(e);
            alert('샘플 데이터 로드 실패: ' + e.message);
        }
    }

    btnGenerate.addEventListener('click', () => {
        if (!currentData) {
            alert('데이터가 없습니다.');
            return;
        }

        const { ok, errors } = validateProcessData(currentData);
        if (!ok) {
            alert('데이터 검증 실패:\n' + errors.join('\n'));
            return;
        }

        const mermaidText = buildMermaidFromJson(currentData);
        console.log('[Mermaid]', '\n' + mermaidText);
        renderMermaid(mermaidText);
    });

    // 처음 로딩 시 한 번 그려보기
    if (currentData) {
        const mermaidText = buildMermaidFromJson(currentData);
        renderMermaid(mermaidText);
    }
});
