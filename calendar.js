/* 暦 & 簡易ブログ のための JavaScript
 * https://www.cssscript.com/basic-calendar-view/ を参考に実装
-------------------------------------------------------------------------*/

// 祝日データを取り込む
import HOLIDAYS from "./holidays.js"

// ブログデータを取得
import BLOG_DATA from "./blog_data.js"

let today = new Date()
// 年と月も設定
let currentYear  = today.getFullYear()
let currentMonth = today.getMonth() + 1

// 定数宣言
const thisYear   = currentYear
const thisMonth  = currentMonth
const thisDay    = today.getDate()
const MONTHS      = ["", "睦月", "如月", "彌生", "卯月", "皐月", "水無月", "文月", "葉月", "長月", "神無月", "霜月", "師走"]
const WDAYS       = ["日", "月", "火", "水", "木", "金", "土"]
const NAME_OF_DAY = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
const NUM_TO_KAN  = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]

// <title>タグに<h1>タグの文字を設定する
const h1        = document.querySelector("h1")
document.title = `${h1.textContent} - WAVE`

// 暦の背景写真と暦本体の為の要素定義 & 生成
const wallpaper = document.getElementById("wallpaper")
wallpaper.setAttribute("data-month", currentMonth)
const calendar  = document.getElementById("calendar")

// 月ごとの暦の写真の為の要素生成
const photograph = document.createElement("div")
photograph.className = "photograph"
photograph.setAttribute("data-month", currentMonth)
calendar.appendChild(photograph)

// 前月翌月の操作盤の為の要素生成
const panel = document.createElement("div")
panel.className = "panel"
  // 前月
  const a_prev = document.createElement("a")
  a_prev.className = "prev"
  a_prev.setAttribute("title", "前月")
  a_prev.innerHTML = `<i class="fa-solid fa-angle-left"></i>`
  a_prev.addEventListener("click", previousMonth, false)
  // 翌月
  const a_next = document.createElement("a")
  a_next.className = "next"
  a_next.setAttribute("title", "翌月")
  a_next.innerHTML = `<i class="fa-solid fa-angle-right"></i>`
  a_next.addEventListener("click", nextMonth, false)
  // 年表示
  const span_year = document.createElement("span")
  span_year.className = "year"
  span_year.setAttribute("data-year", currentYear)
  span_year.innerHTML = `令和 ${NUM_TO_KAN[currentYear-2018]} 年`
  // 月表示
  const span_month = document.createElement("span")
  span_month.className = "month"
  span_month.setAttribute("data-month", currentMonth)
  span_month.innerHTML = MONTHS[currentMonth]
panel.appendChild(a_prev)
panel.appendChild(a_next)
panel.appendChild(span_year)
panel.appendChild(span_month)
calendar.appendChild(panel)

// 暦本体の為の要素生成
const table = document.createElement("table")
const thead = document.createElement("thead")
let tr = document.createElement("tr")
for (let wday in WDAYS) {
  let th   = document.createElement("th")
  let text = document.createTextNode(`${WDAYS[wday]}`)
  th.appendChild(text)
  tr.appendChild(th)
}
thead.appendChild(tr)
table.appendChild(thead)
calendar.appendChild(table)

// 今月投稿したブログの一覧の為の要素生成
const blogHeader = document.createElement("p")
blogHeader.className = "blog header"
blogHeader.innerHTML = "今月の投稿"
calendar.appendChild(blogHeader)

// 当月の暦生成&表示
showCalendar(currentYear, currentMonth)

// 前月操作時の各種更新
function previousMonth() {
  currentYear  = (currentMonth === 1) ? currentYear - 1 : currentYear
  currentMonth = (currentMonth === 1) ? 12 : currentMonth - 1
  document.querySelector("#calendar .year").setAttribute("data-year", currentYear)
  document.querySelector("#calendar .year").innerText = `令和 ${NUM_TO_KAN[currentYear-2018]} 年`
  document.querySelector("#calendar .month").setAttribute("data-month", currentMonth)
  document.querySelector("#calendar .month").innerText = MONTHS[currentMonth]
  document.getElementById("wallpaper").setAttribute("data-month", currentMonth)
  document.querySelector("#calendar .photograph").setAttribute("data-month", currentMonth)
  // カレンダー生成&表示
  showCalendar(currentYear, currentMonth)
}

// 翌月操作時の各種更新
function nextMonth() {
  currentYear  = (currentMonth === 12) ? currentYear + 1 : currentYear
  currentMonth = (currentMonth === 12) ? 1 : currentMonth + 1
  document.querySelector("#calendar .year").setAttribute("data-year", currentYear)
  document.querySelector("#calendar .year").innerText = `令和 ${NUM_TO_KAN[currentYear-2018]} 年`
  document.querySelector("#calendar .month").setAttribute("data-month", currentMonth)
  document.querySelector("#calendar .month").innerText = MONTHS[currentMonth]
  document.getElementById("wallpaper").setAttribute("data-month", currentMonth)
  document.querySelector("#calendar .photograph").setAttribute("data-month", currentMonth)
  // カレンダー生成&表示
  showCalendar(currentYear, currentMonth)
}

// 当月の暦生成&表示
function showCalendar(year, month) {
  // 以前の暦を削除 ＆ 今月の暦新規作成
  let tbody     = document.getElementById("tbody")
  if (tbody !== null) { tbody.remove() }
  tbody     = document.createElement("tbody")
  tbody.id  = "tbody"

  // 以前のブログ一覧を削除 ＆ 今月のブログ一覧新規作成
  let nav     = document.getElementById("nav")
  if (nav !== null) { nav.remove() }
  nav = document.createElement("nav")
  nav.id = "nav"
  let ul = document.createElement("ul")
  ul.id = "ul"
  nav.appendChild(ul)
  calendar.appendChild(nav)
  nav.appendChild(ul)

  // 今月最初の日
  let firstDay = zeller(year, month, 1)

  // 月初の空日処理
  let wday = 0
  let tr = document.createElement("tr")

  // 月が始まるまでの空日処理
  for (let date = 1 - firstDay; date < 1; date++, wday++) {
    let td = document.createElement("td")
    tr.appendChild(td)
  }

  // 一日から末日までの処理
  for (let date = 1; date <= daysInMonth(year, month); date++) {
    let td = document.createElement("td")
    td.className = NAME_OF_DAY[wday]
    let a  = document.createElement("a")
    a.setAttribute("href", "#")
    a.innerHTML = date

    // 今日なら today クラス付与
    if (date === thisDay && currentMonth === thisMonth && currentYear === thisYear) {
      td.className = `${td.className} today`
    }

    // 祝日なら holiday クラス付与 & title属性付与
    let name
    if (name = holidayName(currentYear, currentMonth, date)) {
      td.className = `${td.className} holiday`
      td.setAttribute("title", name)
    }

    // ブログ執筆日なら blogday クラス付与 & data-title属性等を付与
    let blogData
    let reiwaDate = stringifyDate(currentYear, currentMonth, date)
    if (blogData = currentBlogData(reiwaDate)) {
      // blog クラス付与
      td.className = `${td.className} blogday`

      // title 属性 追記
      if (td.getAttribute("title")) {
        td.setAttribute("title", `${td.getAttribute("title")} ${blogData.title}`)
      } else {
        td.setAttribute("title", blogData.title)
      }

      td.dataset.date      = reiwaDate
      td.dataset.hiduke    = blogData.hiduke
      td.dataset.image     = blogData.image
      td.dataset.paragraph = blogData.paragraph.replaceAll("\n", "<br>")

      // ブログ一覧へのリンク生成
      let li = document.createElement("li")
      let blog_a  = document.createElement("a")
      // blog_a.setAttribute("href", link)
      blog_a.innerHTML = blogData.title
      blog_a.dataset.date = reiwaDate
      li.appendChild(blog_a)
      ul.appendChild(li)
    }

    td.appendChild(a)
    tr.appendChild(td)

    // 週末(土曜日)まで処理したら 翌週の行を生成 */
    if (wday === 6) {
      tbody.appendChild(tr)
      tr = document.createElement("tr")
      wday = 0
    } else {
      wday++
    }
  }
  tbody.appendChild(tr)
  table.appendChild(tbody)

  // tdにセットしたデータ属性に基づき、内容が変わるよう、
  // イベントリスナ 設定
  table.querySelectorAll(".blogday").forEach((td) => {
    td.querySelector("a").addEventListener("click", () => {
      document.title = td.title
      document.getElementById("title").textContent  = td.title
      document.getElementById("hiduke").textContent = td.dataset.hiduke
      if (td.dataset.image === "") {
        document.getElementById("image").style.display = "none"
      } else {
        document.getElementById("image").style.display = "block"
        document.getElementById("image").querySelector("img").src = `images/${td.dataset.image}`
      }
      document.getElementById("paragraph").innerHTML = td.dataset.paragraph
    })
  })

  // その月の最初のブログを表示する
  let td = table.querySelector(".blogday")
  if (td) {
    document.title = td.title
    document.getElementById("title").textContent  = td.title
    document.getElementById("hiduke").textContent = td.dataset.hiduke
    if (td.dataset.image === "") {
      document.getElementById("image").style.display = "none"
    } else {
      document.getElementById("image").style.display = "block"
      document.getElementById("image").querySelector("img").src = `images/${td.dataset.image}`
    }
    document.getElementById("paragraph").innerHTML = td.dataset.paragraph
  }

  // 今月の投稿欄の見出しをクリックした際、そのブログになるよう、
  // イベントリスナ 設定
  document.querySelectorAll("#nav #ul li a").forEach((a) => {
    a.addEventListener("click", () => {
      let date = a.dataset.date
      let td = document.querySelector(`[data-date="${date}"]`)
      document.title = td.title
      document.getElementById("title").textContent  = td.title
      document.getElementById("hiduke").textContent = td.dataset.hiduke
      if (td.dataset.image === "") {
        document.getElementById("image").style.display = "none"
      } else {
        document.getElementById("image").style.display = "block"
        document.getElementById("image").querySelector("img").src = `images/${td.dataset.image}`
      }
      document.getElementById("paragraph").innerHTML = td.dataset.paragraph
    })
  });
}

// その月の日数を返す
function daysInMonth(year, month) {
  if (leapYear()) {
    // 閏年
    //   1   2   3   4   5   6   7   8   9  10  11  12月
    return [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
  } else {
    // 平年
    return [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
  }
}

// 閏年判定
function leapYear(year) {
  return (year % 4 === 0) && (year % 100 !== 0) || (year % 400 === 0)
}

// ツェラーの公式
// https://ja.wikipedia.org/wiki/ツェラーの公式
function zeller(year, month, day) {
  if (month === 1 || month === 2) {
    month += 12
    year  -= 1
  }

  let d     = day
  let m     = month
  let C     = Math.floor(year/100)
  let Y     = year % 100
  let gamma = -2*C + Math.floor(C/4)

  let h     = (d + Math.floor(26*(m+1)/10) + Y + Math.floor(Y/4) + gamma) % 7
  let wday  = (h + 6) % 7
  // 曜日 日  月  火  水  木  金  土
  // h    1   2   3   4   5   6   0
  // wday 0   1   2   3   4   5   6

  return wday
}

// 祝日名を返す
function holidayName(year, month, day) {
  // 日付文字列へ変換
  let yyyy          = `${year}`
  let mm            = month.toString().padStart(2, '0')
  let dd            = day.toString().padStart(2, '0')
  let stringifyDate = `${yyyy}-${mm}-${dd}`

  return  HOLIDAYS[stringifyDate]
}

// 日付文字列へ変換
function stringifyDate(year, month, day) {
  let reiwa         = (year-2018).toString().padStart(2, '0')
  let mm            = month.toString().padStart(2, '0')
  let dd            = day.toString().padStart(2, '0')
  return `R${reiwa}-${mm}-${dd}`
}

// ブログ表題を返す
function currentBlogData(reiwaDate) {
  return  BLOG_DATA[reiwaDate]
}
