# GitHub Repository 重新命名指南

請按照以下步驟在 GitHub 上重新命名你的 repository：

## 步驟 1：在 GitHub 上重新命名 Repository

1. 前往你的 GitHub repository：https://github.com/bohachu/botrun-google-slide-mcp

2. 點擊 **Settings** （設定）標籤

3. 在 General 區塊的最上方，你會看到 **Repository name** 欄位

4. 將名稱從 `botrun-google-slide-mcp` 改為 `botrun-google-slides-mcp`

5. 點擊 **Rename** 按鈕

GitHub 會自動設定重新導向，所以舊的 URL 仍會導向新的 repository。

## 步驟 2：確認本地端設定（已完成）

我們已經更新了以下檔案：
- ✅ package.json - repository URLs
- ✅ README.md - 所有相關連結
- ✅ git remote origin - 已更新為新的 URL

## 步驟 3：提交並推送變更

在 GitHub 上完成重新命名後，執行以下命令：

```bash
# 提交本地變更
git add -A
git commit -m "Update repository URLs from botrun-google-slide-mcp to botrun-google-slides-mcp"

# 推送到新的 repository URL
git push origin main
```

## 步驟 4：更新 npm package（如果已發布）

如果你已經將套件發布到 npm，記得在下次發布時，新的 repository URL 會自動更新。

## 注意事項

- GitHub 會自動從舊 URL 重新導向到新 URL
- 現有的 clone、fork 和 star 都會保留
- 建議通知協作者更新他們的 remote URL：
  ```bash
  git remote set-url origin https://github.com/bohachu/botrun-google-slides-mcp.git
  ```

## 驗證步驟

重新命名完成後，確認以下連結都能正常運作：
- https://github.com/bohachu/botrun-google-slides-mcp
- https://github.com/bohachu/botrun-google-slides-mcp/issues
- https://github.com/bohachu/botrun-google-slides-mcp#readme