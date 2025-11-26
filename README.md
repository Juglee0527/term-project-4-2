# term-project-4-2

## 개요  
본 프로젝트는 **PBL OJT 과제**로 수행되는 작업으로,  
공정 데이터를 기반으로 **Mermaid.js를 활용한 공정 흐름도 시각화 프로그램**을 개발한다.  
입력된 JSON 데이터를 바탕으로 공정–세부공정–설비 간의 관계를 다이어그램 형태로 자동 생성하여  
시각적으로 공정 흐름을 확인할 수 있도록 하는 것을 목표로 한다.
- https://juglee0527.github.io/term-project-4-2/

---

## 사용 기술  
- **Frontend** : HTML5, CSS3, JavaScript(ES6)  
- **Visualization** : Mermaid.js  
- **Data Storage** : LocalStorage(JSON 데이터 저장/불러오기)  
- **Export(Optional)** : html2canvas, jsPDF  
- **Zoom(Optional)** : Panzoom.js  

> 💡 본 프로젝트는 백엔드 서버를 사용하지 않으며,  
> 모든 데이터 처리는 프론트엔드(로컬 환경)에서 수행된다.

---

## 주요 기능  
- JSON 기반 공정 데이터 입력 및 저장  
- Mermaid.js 다이어그램 자동 생성  
- 생성된 다이어그램 확대/이동 기능  
- 로컬스토리지 데이터 불러오기 및 초기화  
- 다이어그램 PDF 또는 이미지 내보내기
