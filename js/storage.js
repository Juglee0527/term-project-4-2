const STORAGE_KEY = 'tp42-process-data';

async function loadSampleData() {
    const res = await fetch('assets/sample.json');
    if (!res.ok) {
        throw new Error('sample.json 로드 실패');
    }
    return await res.json();
}

function saveToLocal(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromLocal() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error(e);
        return null;
    }
}
