const express = require('express')
const app = express()
const sqlite3 = require('sqlite3')
const path = require('path')
const bodyParser = require('body-parser')
const { resolveObjectURL } = require('buffer')


const dbPath = "app/db/database.sqlite3"

// リクエストのbodyをパースする設定→この設定でエクスプレスのAPIで使うことができるようになる
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//publicディレクトリを静的ファイル群のルートディレクトリとして設定
app.use(express.static(path.join(__dirname, 'public')))

// Get all users
//getメソッドを投げたときに実行する関数を作成
app.get('/api/v1/users', (req, res) => {
  //connect database
  const db = new sqlite3.Database(dbPath)
  db.all('SELECT * FROM users', (err, rows) => {
    // 取得した結果が返ってくる。
    res.json(rows)
  })
  db.close()
})

// Get a user
//:idは動的に設定ができる
app.get('/api/v1/users/:id', (req, res) => {
  //connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id
//``にする事でJSの構文を使うことができる 結果はrowに入ってくる
  db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
    // 取得した結果が返ってくる。
    res.json(row)
  })
  db.close()
})

// Search users matching keywords
app.get('/api/v1/search', (req, res) => {
  //connect database
  const db = new sqlite3.Database(dbPath)
  const keywords = req.query.q
  // db.getだとデータ一つしか取得できない
  db.all(`SELECT * FROM users WHERE name LIKE "%${keywords}%"`, (err, rows) => {
    // 取得した結果が返ってくる。
    res.json(rows)
  })
  db.close()
})
//Create a new user
// 今までapp.getでGETメソッドを作っていたが下記からPOSTメソッド
app.post('/api/v1/users', async (req, res) => {
  //Connect database
  const db = new sqlite3.Database(dbPath)
  // リクエストのbodyのnameは必須
  const name = req.body.name
  const profile = req.body.profile ? req.body.profile : "" //三項演算子
  const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""
  // クエリを投げる為に関数を作成する
  const run = async (sql) => {
    // resolve()かreject()が実行完了されるまで待つ 非同期処理になる為クエリ投げて結果返ってくるまでしっかりと待ちたい為、Promise関数を使う
    return new Promise((resolve, reject) => {
      // sqlite3のrunメソッドを実行していく
      db.run(sql, (err) => {
        // エラーが発生したときステータスを返す
        if (err) {
          res.status(500).send(err) //SQL失敗→サーバーエラー
          return reject();
        } else {
          res.json({message: "新規ユーザーを作成しました"})
          return resolve()
        }
      });
    })
  }

  // asyncをしてしてあげているからawaitを使えるようになる
  // ``で囲ってあげることで$で囲われた箇所がJSの世界になる
  // 上記で設定している為resolve()かreject()が返ってくるまでrunの実行を待つ
  await run(`INSERT INTO users (name,profile,date_of_birth) VALUES ("${name}","${profile}","${dateOfBirth}")`)
  db.close()
})

// 指定している人がいたらその人のポート番号使ってローカルサーバー立ち上げる
const port = process.env.PORT || 3000;
app.listen(port)
console.log("Listen on port: " + port);
