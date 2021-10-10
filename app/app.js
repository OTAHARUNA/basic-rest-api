const express = require('express')
const app = express()

//getメソッドを投げたときに実行する関数を作成
app.get('/api/v1/hello', (req, res) => {
  // レスポンスがjsonメソッドを持っていてこの中に書いたオブジェクトメソッドを返す
  res.json({"message": "Hello World!"})
})
// 指定している人がいたらその人のポート番号使ってローカルサーバー立ち上げる
const port = process.env.PORT || 3000;
app.listen(port)
console.log("Listen on port: " + port);
