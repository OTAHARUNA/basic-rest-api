// 即時関数でモジュール化する ユーザーに関数部品
const usersModule = (() => {
  // グローバルのスコープでなくusersModule内：ユーザーに関してのみのモジュール
  const BASE_URL = "http://localhost:3000/api/v1/users"
  const headers = new Headers()
  // リクエストの中身がJSONで渡していると設定できる
  headers.set("Content-Type","application/json")

  return {
    // メソッドを呼び出すと下記アロー関数が実行される
    fetchAllUsers: async () => {
      // GETメソッドを実行するだけならフェッチメソッドのみ：非同期処理　投げっぱなしになる為実行結果が返ってくるのが関係なしに実行される→asyncで実行結果が返って来るのを待ってあげてから次の処理へ移る
      const res = await fetch(BASE_URL)
      // json形式でかえってきている状態→パースする必要 JSのオブジェクト型として扱う必要がある。配列の中にオブジェクトが入っているイメージ
      const users = await res.json()

      for (let i = 0; i < users.length; i++){
        const user = users[i]
        // ``で囲う　テンプレートリテラル　HTMLの構文をかけるようになる
        const body = `<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.profile}</td>
                        <td>${user.date_of_birth}</td>
                        <td>${user.created_at}</td>
                        <td>${user.updated_at}</td>
                      </tr>`
        // 一番末尾にデータを入れるようにwhere:'beforeend'
        document.getElementById('users-list').insertAdjacentHTML('beforeend',body)
      }
    },
    createUsers: async () => {
      // フォームに入力された値を受け取る
      const name = document.getElementById('name').value
      const profile = document.getElementById('profile').value
      const dateOfBirth = document.getElementById('date_of_birth').value

      const body = {
        name: name,
        profile: profile,
        date_of_birth: dateOfBirth
      }

      // リクエストを投げる
      const res = await fetch(BASE_URL, {

        method: "POST",
        headers: headers,
        body: JSON.stringify(body) //bodyもjsonにしてあげる必要ある
      })
      const resJson = await res.json() //resに対してjsonメソッドを実行する

      alert(resJson.message) //app.jsの66行目で設定している
      window.location.href = "/"
    }
  }
})()
