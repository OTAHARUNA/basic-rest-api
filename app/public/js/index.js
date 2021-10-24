const indexModule = (() => {
  // 検索ボタンを押下したときのイベントリスナー設定
  document.getElementById('search-btn').addEventListener('click', () => {
    // searchModuleのsearchUsersのメソッドをイベントリスナーで設定する
    return searchModule.searchUsers()
  })
  //UsersモジュールのfetchAllUsersメソッドを呼び出す
  return usersModule.fetchAllUsers()

})()
