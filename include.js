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
  let filename = ""
  if (partial.includes("../")) {
    // 親ディレクトリを参照する
    partial = partial.slice(3)
    filename = `../_${partial}.html`
  } else {
    filename = `_${partial}.html`
  }
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
//
// 本番環境では、画面の再描画が発生し、1秒ほどちらつくため使用不可
const includeHead = () => {
  fetch("_head.html")
      .then(response => response.text())
      .then(data => document.querySelector("head").innerHTML = data)
}
