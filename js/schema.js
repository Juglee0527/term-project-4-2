function validateProcessData(data) {
    const errors = [];

    if (!data.processes || !Array.isArray(data.processes) || data.processes.length === 0) {
        errors.push('processes 가 비어 있습니다.');
    }

    // 필요하면 점점 더 추가
    return {
        ok: errors.length === 0,
        errors
    };
}
