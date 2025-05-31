# GitHub Actions Secrets 說明

## 1. `${{ secrets.CR_PAT }}`

- **用途**：用於 Docker 登入 GitHub Container
  Registry（ghcr.io），讓 workflow 有權限推送/拉取私有映像。
- **來源**：你需要在 GitHub 上建立一組
  [Personal Access Token (PAT)](https://github.com/settings/tokens)，並賦予
  `write:packages`、`read:packages` 權限（建議也加 `repo` 權限）。
- **設置方式**：
  1. 到
     [GitHub 個人設定 → Developer settings → Personal access tokens](https://github.com/settings/tokens)
     建立新 token。
  2. 複製 token，進入你的 repository → Settings → Secrets and variables →
     Actions → New repository secret。
  3. 名稱填入 `CR_PAT`，值貼上剛剛複製的 token。

---

## 2. `${{ secrets.GITHUB_TOKEN }}`

- **用途**：GitHub Actions 內建自動產生的權杖，讓 workflow 可以安全地呼叫 GitHub
  API（如修改 repo variable、建立 release、發 issue 等）。
- **來源**：每次 workflow 執行時自動產生，**不需手動建立**。
- **設置方式**：無需手動設置，直接在 workflow 內用 `${{ secrets.GITHUB_TOKEN }}`
  即可。
- **權限設定**：
  - 若 workflow 需要寫入權限（如修改 repository variable），請到  
    `Settings → Actions → General → Workflow permissions`  
    勾選 **"Read and write permissions"**。

---

## 小結

| Secret 名稱    | 用途                    | 來源/設置方式                  |
| -------------- | ----------------------- | ------------------------------ |
| `CR_PAT`       | Docker 登入 ghcr.io     | 手動建立 PAT，設為 repo secret |
| `GITHUB_TOKEN` | GitHub Actions 內建權杖 | 自動產生，無需手動設置         |
