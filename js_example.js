// こんにちは 関数の定義
const hello = () => {
  // h1要素を取得
  const h1 = document.querySelector("h1")
  // h1 の中身
  let aisatsu = h1.textContent

  // 条件分岐
  if (aisatsu === "おはようございます。JavaScript!") {
    // こんにちは に設定する
    h1.textContent = "こんにちは。JavaScript!"
  } else if (aisatsu === "こんにちは。JavaScript!") {
    // おやすみ に設定する
    h1.textContent = "おやすみ。JavaScript!"
  } else {
    // おはよう に設定する
    h1.textContent = "おはようございます。JavaScript!"
  }
}

// ようこそボタンを取得
const welcomeButton = document.querySelector("#welcome")

// イベントリスナを設定
// welcomeボタンを押すと、hello関数が実行される
welcomeButton.addEventListener("click", hello, false)
