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
    if (!row) {
      res.status(400).send({error:"Not Found"})
    } else {
      // 取得した結果が返ってくる。
      res.status(200).json(row)
    }
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

// 関数の共通化
const run = async (sql, db) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      // エラーが発生したときステータスを返す
      if (err) {
        return reject(err);
      } else {
        return resolve()
      }
    })
  })
}

//Create a new user
// 今までapp.getでGETメソッドを作っていたが下記からPOSTメソッド
app.post('/api/v1/users', async (req, res) => {
  if (!req.body.name || !req.body.name != "") {
    res.status(400).send({error:"ユーザー名を入力してください"})
  }else {
    //Connect database
    const db = new sqlite3.Database(dbPath)
    // リクエストのbodyのnameは必須
    const name = req.body.name
    const profile = req.body.profile ? req.body.profile : "" //三項演算子
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""

    try {
      // 上記で設定している為resolve()かreject()が返ってくるまでrunの実行を待つ
      await run(
        `INSERT INTO users (name,profile,date_of_birth) VALUES ("${name}","${profile}","${dateOfBirth}")`,
        db
      )
      res.status(201).send({message:"新規ユーザーを作成しました"})
    } catch (e) {
      res.status(500).send({error: e})
    }
    db.close()
  }
})

//Update user data
app.put('/api/v1/users/:id', async (req, res) => {
  //Connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id

      // 現在のユーザー情報を取得する
    db.get(`SELECT * FROM users WHERE id = ${id}`, async (err, row) => {
      if (!row) {
        res.status(400).send({ error: "指定されたユーザーは存在しません" })
      } else {
        // 取得した結果が返ってくる。
        const name = req.body.name ? req.body.name : row.name
        const profile = req.body.profile ? req.body.profile : row.profile
        const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth
        try {
          await run(
            `UPDATE users SET name="${name}",profile="${profile}",date_of_birth="${dateOfBirth}" WHERE id = ${id}`,
            db
          )
          res.status(200).send({ message: "ユーザー情報を更新しました。" })
        } catch (e) {
          res.status(500).send({ error: e })
        }
      }
    })
  db.close()
})
//Delete user data
app.delete('/api/v1/users/:id', async (req, res) => {
  //Connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id
  // ユーザーが存在するか確認してからデリートを実行→ただ、ＳＱＬ二回投げることになるからあまりよくない
  db.get(`SELECT * FROM users WHERE id = ${id}`, async (err, row) => {
    if (!row) {
      res.status(400).send({ error: "指定されたユーザーは存在しません" })
    } else {
      try {
        await run(
          `DELETE FROM users WHERE id = ${id}`,
          db
        )
        res.status(201).send({message:"ユーザーを削除しました"})
      } catch (e) {
        res.status(500).send({error:e})
      }
    }
  })
  db.close()
})


// 指定している人がいたらその人のポート番号使ってローカルサーバー立ち上げる
const port = process.env.PORT || 3000;
app.listen(port)
console.log("Listen on port: " + port);
