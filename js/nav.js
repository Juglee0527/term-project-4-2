function loadNav() {
    const navHtml = `
    <nav class="navbar">
      <a href="../index.html">홈</a>
      <a href="diagram.html">다이어그램 생성</a>
      <a href="editor.html">JSON 편집</a>
      <a href="about.html">프로젝트 안내</a>
    </nav>
  `;

    document.body.insertAdjacentHTML("afterbegin", navHtml);
}
