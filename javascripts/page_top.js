/*=====================================================================
 ウィンドウがスクロールした際
 先頭へ戻る要素の表示/非表示を行う
=====================================================================*/
const pageTopAnimation = () => {
  // scroll という変数に、ウィンドウのスクロール量を取得して、代入する。
  let scroll = document.querySelector("html").scrollTop
  // 先頭へ戻る要素を取得
  let page_top = document.querySelector("#page_top")

  // もしスクロール量が200px以上ならば
  if (scroll >= 200){
    // #page_top要素からdownwardクラスを削除する
    page_top.classList.remove("downward")
    // #page_top要素にupwardクラスを追加する
    page_top.classList.add("upward")

  // そうではなくて、もし#page_topに upwardクラスが付与されていたら
  } else if (page_top.classList.contains("upward")) {
    // #page_top要素からupwardクラスを削除する
    page_top.classList.remove("upward")
    // #page_top要素にdownwardクラスを追加する
    page_top.classList.add("downward")
  }
}

// スクロールイベント発火で pageTopAnimation 関数を呼ぶ
document.addEventListener("scroll", (event) => {
  pageTopAnimation()
})
