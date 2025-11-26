const VERSION_KEY = "tp42_versions";
const CURRENT_KEY = "tp42_current_version_id";

async function initVersions() {
    let versions = JSON.parse(localStorage.getItem(VERSION_KEY));

    if (!versions) {
        const res = await fetch("assets/sample.json");
        const sample = await res.json();

        versions = [{
            id: "v1",
            name: "초기 버전",
            createdAt: new Date().toISOString(),
            data: sample
        }];

        localStorage.setItem(VERSION_KEY, JSON.stringify(versions));
        localStorage.setItem(CURRENT_KEY, "v1");
    }
}

function getVersions() {
    return JSON.parse(localStorage.getItem(VERSION_KEY));
}

function getCurrentVersion() {
    const id = localStorage.getItem(CURRENT_KEY);
    const list = getVersions();
    return list.find(v => v.id === id);
}

function saveNewVersion(jsonObj) {
    let list = getVersions();
    const newId = "v" + (list.length + 1);

    const newVersion = {
        id: newId,
        name: newId,
        createdAt: new Date().toISOString(),
        data: jsonObj
    };

    list.push(newVersion);
    localStorage.setItem(VERSION_KEY, JSON.stringify(list));
    localStorage.setItem(CURRENT_KEY, newId);
}

function setCurrentVersion(id) {
    localStorage.setItem(CURRENT_KEY, id);
}
