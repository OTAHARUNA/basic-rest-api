const express = require('express')
const app = express()
const sqlite3 = require('sqlite3')
const dbPath = "app/db/database.sqlite3"

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
// 指定している人がいたらその人のポート番号使ってローカルサーバー立ち上げる
const port = process.env.PORT || 3000;
app.listen(port)
console.log("Listen on port: " + port);
