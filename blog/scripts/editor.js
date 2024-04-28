// ブログデータを取得
import BLOG_DATA from "../blog_data.js"

// Workerの登録
let connection = new JsStore.Connection(new Worker("scripts/jsstore.worker.js"))

// SqlWebの登録
connection.addPlugin(SqlWeb.default)
window.onload = function () {
  initiateDb()

  // 読込
  document.querySelector("#load_record").addEventListener("click", loadData, false)

  // 保存
  document.querySelector("#save_record").addEventListener("click", saveData, false)

  $("#upsert_record").on("click", function () {
    window.location.href = "upsert.html"
  })

  $("#record_list tbody").on("click", ".edit", function () {
    let recordId = $(this).parents().eq(1).data("id")
    window.location.href = "upsert.html?id=" + recordId
  })
  $("#record_list tbody").on("click", ".delete", function () {
    let result = confirm("本当に削除しても良いですか？")
    if (result) {
      let recordId = $(this).parents().eq(1).data("id")
      deleteData(recordId)
    }
  })
}

// データベース定義
function getDbQuery() {
  let db = "define db records;"
  let tblRecord = `define table record(
        id primarykey autoincrement,
        title notnull string,
        date notnull string,
        hiduke notnull string,
        image string,
        paragraph notnull string
    )
    `
  let dbQuery = db + tblRecord
  return dbQuery
}

// データベース初期化
function initiateDb() {
  try {
    let dbQuery = getDbQuery()
    connection.$sql.run(dbQuery).then(function (isDbCreated) {
      if (isDbCreated) {
        // insertRecords()
      }
      showTableData()
    })
  } catch (ex) {
    console.error(ex)
  }
}

// 表の表示更新
function showTableData() {
  connection.$sql.run("select * from record").then(function (records) {
    let html = ""
    records.forEach(function (record) {
      html += `
        <tr data-id=${record.id}>
          <td>${record.id}</td>
          <td>${record.title}</td>
          <td>${record.date}</td>
          <td>${record.hiduke}</td>
          <td>${record.image === null ? "" : record.image}</td>
          <td>${record.paragraph.split("\n").map((s) => s.strip()).join("<br>").substring(0, 49)}</td>
          <td class="ui center aligned"><a href="#" class="ui green tertiary edit button">編集</a>
              <a href="#" class="ui red tertiary delete button">削除</a></td>
        </tr>
      `
    })
    $("#record_list tbody").html(html)
  }).catch(function (error) {
    console.log(error)
  })
}

// 日付文字列へ変換
function stringifyDate(yyyy_mm_dd) {
  let y, m, d
  [y, m, d] = yyyy_mm_dd.split("-")
  let year  = Number(y)
  let month = Number(m)
  let day   = Number(d)
  let reiwa = (year-2018).toString().padStart(2, '0')
  let mm    = month.toString().padStart(2, '0')
  let dd    = day.toString().padStart(2, '0')
  return `R${reiwa}-${mm}-${dd}`
}
// 表の保存
function saveData() {
  connection.$sql.run("select * from record").then(function (records) {
    let html = ""
    let json_array   = []
    let json_element = ""
    records.forEach(function (record) {
      html += `
        <tr data-id=${record.id}>
          <td>${record.id}</td>
          <td>${record.title}</td>
          <td>${record.date}</td>
          <td>${record.hiduke}</td>
          <td>${record.image === null ? "" : record.image}</td>
          <td>${record.paragraph.split("\n").map((s) => s.strip()).join("<br>").substring(0, 49)}</td>
          <td class="ui center aligned"><a href="#" class="ui green tertiary edit button">編集</a>
              <a href="#" class="ui red tertiary delete button">削除</a></td>
        </tr>
      `
      json_element = `
"${stringifyDate(record.date)}": {
  "title": "${record.title}",
  "date": "${record.date}",
  "hiduke": "${record.hiduke}",
  "image": "${record.image === null ? "" : record.image}",
  "paragraph": "${record.paragraph.replaceAll("\n", '\\n')}"
}
`
      json_array.push(json_element)
    })
    let jsonString = "const BLOG_DATA = {" + json_array.join(",") + "}\n\nexport default BLOG_DATA"

    const text = jsonString
    const blob = new Blob([text], {type: "text/plain"})
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "blog_data.js"
    a.click()
    URL.revokeObjectURL(url)

  }).catch(function (error) {
    console.log(error)
  })
}

function loadData() {
  let records = Object.values(BLOG_DATA)
  let query = new connection.$sql.Query("insert into record values='@val'")
  query.map("@val", records)
  connection.$sql.run(query).then(function (rowsAdded) {
    if (rowsAdded > 0) {
      alert("ブログデータの読み込みが完了しました。")
      window.location.href = "editor.html"
    }
  }).catch(function (err) {
    console.log(err)
    alert("ブログデータの読み込み時にエラーが発生しました。")
  })
}

// データ挿入という名称だが、
// 初回起動時に、
// getRecordsにハードコーディングされたデータを読み込み、
// indexedDBに書き込む。
function insertRecords() {
  let records = getRecords()
  let query = new connection.$sql.Query("insert into record values='@val'")
  query.map("@val", records)
  connection.$sql.run(query).then(function (rowsAdded) {
    if (rowsAdded > 0) {
      alert("初期データの読み込みが完了しました。")
    }
  }).catch(function (err) {
    console.log(err)
    alert("初期データの追加時にエラーが発生しました。")
  })
}

// データの削除
function deleteData(recordId) {
  let query = new connection.$sql.Query("delete from record where id='@recordId'")
  query.map("@recordId", Number(recordId))
  connection.$sql.run(query).then(function (rowsDeleted) {
    console.log(rowsDeleted + " rows deleted")
    if (rowsDeleted > 0) {
      showTableData()
    }
  }).catch(function (error) {
    console.log(err)
    alert(error.message)
  })
}

// 初期データ
function getRecords() {
  let records = [{
    title: "新年のご挨拶",
    date: "2024-01-01",
    hiduke: "元旦",
    image: "aozora_to_sakura.webp",
    paragraph:
`令和六年元旦。新しい年の始まりです。
海岸に出て初日の出を拝み、良い年であるようにと祈ります。
お節料理にお屠蘇、お雑煮をいただきます。`
  },
  {
    title: "七草粥",
    date: "2024-01-07",
    hiduke: "正月七日",
    image: "ipponzakura.webp",
    paragraph:
`今日は七草粥を作っていただきます。
無病息災、健康で過ごせますように。`
  },
  {
    title: "節分",
    date: "2024-02-03",
    hiduke: "節分",
    image: "mizuho_sakura.webp",
    paragraph:
`今日は、2月3日節分の豆まきです。
鬼は外、福は内、豆まきして厄を払います。
歳の数だけ豆を食べ、無病息災を祈ります。`
  },
  {
    title: "雛祭り",
    date: "2024-03-03",
    hiduke: "三月三日",
    image: "sakura_mejiro.webp",
    paragraph:
`今日は、3月3日桃の節句、雛祭りです。
御内裏様と御雛様、桜や橘、桃の花などを飾ります。
雛霰や菱餅などをお供えして、白酒やちらし寿司などで楽しみます。`
  },
  {
    title: "新年度の始まり",
    date: "2024-04-01",
    hiduke: "四月一日",
    image: "sakura.webp",
    paragraph:
`今日から新年度の始まりです。美しい櫻と青空を眺めていると、それだけで仕事や勉強にもやる気が出てきます。最近のお気に入りは、お花見ができる近くの公園です。
毎日の健康づくりのために、ちょっとした散歩を心がけています。`
  },
  {
    title: "週末はゆっくり",
    date: "2024-04-06",
    hiduke: "四月六日",
    image: "yamazakura.webp",
    paragraph:
`一週間が終わり、はじめての週末です。
週末は、近くの公園でお散歩したり、家でごろごろしたりしてゆっくり過ごします。
櫻の次は卯の花や藤の花を見にいこうと思います。その次は紫陽花かな。
美しい花を見るのがとっても大好きです。`
  }
]
  return records
}
