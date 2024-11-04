// こんにちは 関数の定義
const hello = () => {
  // #aisatsu要素(element)を取得
  const element = document.querySelector("#aisatsu")
  // h1 の中身
  let aisatsu = element.textContent

  // 条件分岐
  if (aisatsu === "おはようございます。JavaScript!") {
    // こんにちは に設定する
    element.textContent = "こんにちは。JavaScript!"
  } else if (aisatsu === "こんにちは。JavaScript!") {
    // おやすみ に設定する
    element.textContent = "おやすみ。JavaScript!"
  } else {
    // おはよう に設定する
    element.textContent = "おはようございます。JavaScript!"
  }
}

// ようこそボタンを取得
const welcomeButton = document.querySelector("#welcome")

// イベントリスナを設定
// welcomeボタンを押すと、hello関数が実行される
welcomeButton.addEventListener("click", hello, false)
