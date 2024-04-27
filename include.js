/*=====================================================================
  部分ファイルを読み込むための include 関数

  [使い方]
  <nav id="navigation"></nav>
  <script>include("navigation")</script>
  navタグが、_navigation.html に置き換わる。

  [参考]
  HTMLで簡単インクルード！ https://jp-seemore.com/web/2408/
=====================================================================*/
const include = (partial) => {
  let filename = `_${partial}.html`
  let id       = partial

  fetch(filename)
      .then(response => response.text())
      .then(data => document.getElementById(id).outerHTML = data)
}

// <head>タグ専用
// <head>
//   <script src="include.js"></script>
//   <script>includeHead()</script>
// </head>
// headタグが、_head.html に置き換わる。
const includeHead = () => {
  fetch("_head.html")
      .then(response => response.text())
      .then(data => document.querySelector("head").innerHTML = data)
}
