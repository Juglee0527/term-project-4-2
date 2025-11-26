// 1) 초기화
//  - 버전 로딩 or sample 생성
//  - 현재 버전 렌더
//  - 버전 리스트 렌더
//  - 버튼 이벤트 연결 (edit/print)

init();

function init() {
    loadOrInitVersions().then(() => {
        renderCurrentVersion();
        renderVersionList();
        bindEvents();
    });
}

function bindEvents() {
    document.getElementById('btn-edit').onclick = openEditor;
    document.getElementById('btn-print').onclick = () => window.print();
    document.getElementById('btn-save-version').onclick = saveNewVersionFromEditor;
    document.getElementById('btn-cancel-modal').onclick = closeEditor;
    document.getElementById('version-list').onclick = onVersionClick;
}
