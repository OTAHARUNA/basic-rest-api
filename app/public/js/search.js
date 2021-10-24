// 検索ボタン押下時に実行させたい
const searchModule = (() => {
  const BASE_URL = "http://localhost:3000/api/v1/search"

  return {
    searchUsers: async () => {
      // 検索窓への入力値を取得
      const query = document.getElementById('search').value
      // フェッチメソッドで()内に投げる
      const res = await fetch(BASE_URL + '?q=' + query)
      const result = await res.json()

      let body = ""

      for (let i = 0; i < result.length; i++) {
        const user = result[i]
        // 配列に追加していくため加算+=
        body += `<tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.profile}</td>
                <td>${user.date_of_birth}</td>
                <td>${user.created_at}</td>
                <td>${user.updated_at}</td>
              </tr>`
      }
      // uesrs-listにbodyの中身を入れてあげる
      document.getElementById('users-list').innerHTML = body
    }
  }
})()
