# Google Secret Manager 與 GKE 整合標準範例

## 1. 在 Google Secret Manager 建立 Secret

```bash
echo -n "your-app-id-value" | gcloud secrets create APP_ID --data-file=-
```

---

## 2. 讓 GKE 的 Service Account 有存取權限

GKE 節點（Node）預設會綁定一個 Google Service
Account（GSA），Pod 若要存取 Secret Manager，這個 Service Account 必須有
`roles/secretmanager.secretAccessor` 權限。

### 步驟說明

1. **查詢 GKE 節點使用的 Service Account**

   你可以在 GCP Console → Kubernetes Engine → 集群 → 節點池，或用指令查詢：

   ```bash
   gcloud iam service-accounts list
   ```

   會得到類似 `my-gke-sa@your-project.iam.gserviceaccount.com` 的帳號。

2. **將 Secret Manager 權限授予這個 Service Account**

   ```bash
   gcloud secrets add-iam-policy-binding APP_ID \
     --member="serviceAccount:my-gke-sa@your-project.iam.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   ```

   - `APP_ID`：你的 Secret 名稱
   - `my-gke-sa@your-project.iam.gserviceaccount.com`：你的 GKE 節點 Service
     Account

**這樣，GKE 節點上的 Pod 就能透過 CSI Driver 安全存取 Secret
Manager 的機敏資訊。**

---

## 3. 在 GKE 安裝 Secret Manager CSI Driver

**只需安裝一次**

### 透過 Helm 安裝 Secrets Store CSI Driver

1. 先安裝 (windows 下的指令)

```bash
$helmPath = "$env:USERPROFILE\helm"; New-Item -ItemType Directory -Force -Path $helmPath; $tempFile = "$env:TEMP\helm-installer.zip"; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri "https://get.helm.sh/helm-v3.13.2-windows-amd64.zip" -OutFile $tempFile; Expand-Archive -Path $tempFile -DestinationPath "$env:TEMP\helm" -Force; Move-Item -Path "$env:TEMP\helm\windows-amd64\helm.exe" -Destination "$helmPath" -Force; Remove-Item -Path $tempFile -Force; Remove-Item -Path "$env:TEMP\helm" -Recurse -Force; [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$helmPath", "User")
```

2. 加入 Helm Chart Repo（以 Secrets Store CSI Driver 為例）

```bash
helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
helm repo update
```

3.  安裝 Helm Chart 以 Secrets Store CSI Driver 為例：

```bash
helm install csi-secrets-store secrets-store-csi-driver/secrets-store-csi-driver --namespace kube-system
```

若是使用 GKE Autopilot 沒有權限在 kube-system namespace 建立 Secret

**解決方式**

1. 改用自訂 namespace 安裝 CSI Driver

可以在自己的 namespace（例如 csi-secrets-store）安裝：

```bash
kubectl create namespace csi-secrets-store
helm install csi-secrets-store secrets-store-csi-driver/secrets-store-csi-driver --namespace csi-secrets-store
```

### 安裝 GCP Provider

```bash
kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/secrets-store-csi-driver-provider-gcp/main/deploy/provider-gcp-plugin.yaml
```

若出現 `server reported 404 Not Found, status code=404`

> 請依實際 release 版本調整網址，  
> 你可在這裡查詢最新版本：
>
> - [CSI Driver Releases](https://github.com/kubernetes-sigs/secrets-store-csi-driver/releases)
> - [GCP Provider Releases](https://github.com/GoogleCloudPlatform/secrets-store-csi-driver-provider-gcp/releases)

---

## 4. 建立 SecretProviderClass

```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: appid-gsm
spec:
  provider: gcp
  parameters:
    secrets:
      - resourceName: 'projects/<YOUR_PROJECT_ID>/secrets/APP_ID'
        fileName: 'APP_ID'
```

> 請將 `<YOUR_PROJECT_ID>` 替換成你的 GCP 專案 ID。

---

## 5. 在 Deployment 掛載 Secret

```yaml
spec:
  containers:
    - name: steve-test-app-api
      # ...其他設定...
      volumeMounts:
        - name: appid-secret
          mountPath: '/secrets'
          readOnly: true
  volumes:
    - name: appid-secret
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: 'appid-gsm'
```

---

## 6. 應用程式讀取 Secret

- 你的 APP 可以從 `/secrets/APP_ID` 這個檔案讀取 APP_ID 的值。
- 若要自動設為環境變數，可在 entrypoint script 讀取檔案再 export。

---

## 參考文件

- [GKE 官方教學](https://cloud.google.com/kubernetes-engine/docs/how-to/secrets-store-csi-driver)
- [Secret Manager Pricing](https://cloud.google.com/secret-manager/pricing)
