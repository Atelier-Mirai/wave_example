const DELAY_TIME = 0.25 // 一文字ずつの遅延時間

// .glow.text に shineクラス名を付与する関数定義
const addShineClassName = () => {
  let elements = document.querySelectorAll(".glow.text")
  elements.forEach((element, index) => {
    let elemPosition = element.getBoundingClientRect().top - 50
    let scroll       = window.scrollY
    let windowHeight = window.innerHeight

    // .glow.text要素の位置までスクロールされたなら、shineクラスを付与する。
    if (scroll >= elemPosition - windowHeight) {
      element.classList.add("shine");
    } else {
      element.classList.remove("shine");
    }
  })
}

// ページ読み込み時、addShineClassName関数を実行するよう、イベントリスナを設定
window.addEventListener("load", () => {
  document.querySelectorAll(".glow.text").forEach((element, index) => {
    let text                = element.textContent.trim()
    let delay_initial_value = 0 + (index * text.length * DELAY_TIME)
    let textbox             = ""
    text.split("").forEach((t, i) => {
      let delay = delay_initial_value + i * DELAY_TIME
      textbox += `<span style="animation-delay:${delay}s">${t}</span>`
    })
    element.innerHTML = textbox
  })
  addShineClassName()
})
