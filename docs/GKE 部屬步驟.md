### 🔧 前置作業

1. 安裝 Google Cloud CLI

- 安裝： https://cloud.google.com/sdk/docs/install
- 初始化：gcloud init
- 登入 Google 帳戶並選擇專案

2. 啟用 Kubernetes Engine API

```bash
gcloud services enable container.googleapis.com
```

3. 安裝 kubectl

- 如果你已安裝 Google Cloud CLI，可以執行：

```bash
gcloud components install kubectl
```

---

### 🚀 建立 GKE 叢集（Cluster）

```bash
gcloud container clusters create steve-cluster \
  --zone=asia-east1 \
  --num-nodes=1
```

參數說明：

- my-cluster：叢集名稱
- --zone：指定地區（也可用 --region）
- --num-nodes：節點數量

---

### 🔐 建立 Image Pull Secret

使用以下指令建立 secret（請替換為你的資料）：

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=你的GitHub帳號 \
  --docker-password=你的PAT \
  --docker-email=你的Email
```

📌 建議命名為 `ghcr-secret`，也可以自定義。

---

### 🔗 取得叢集憑證並設定 kubectl

```bash
gcloud container clusters get-credentials my-cluster --zone=us-central1-a
```

這會將叢集的憑證加到 `~/.kube/config`，讓你可以用 `kubectl` 操作叢集。

---

### ♻️ 建立 k8s 資源

#### 建立 Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: steve-test-app-api
  labels:
    app: steve-test-app-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: steve-test-app-api
  template:
    metadata:
      labels:
        app: steve-test-app-api
    spec:
      automountServiceAccountToken: false
      containers:
        - name: steve-test-app-api
          image: ghcr.io/stevelin100132/steve-test-app # tag 由 kustomize 控制
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
              ephemeral-storage: 1Gi
            limits:
              cpu: 500m
              memory: 256Mi
              ephemeral-storage: '2Gi'
      imagePullSecrets:
        - name: ghcr-secret
```

#### 建立公開的 Service（External Load Balancer）

```bash
apiVersion: v1
kind: Service
metadata:
  name: steve-test-app-api-service
spec:
  type: ClusterIP
  selector:
    app: steve-test-app-api
  ports:
    - port: 80
      targetPort: 3000
```

#### 查看外部 IP：

```bash
kubectl get service nest-app-api-service
```

#### 建立 TLS 憑證(GCP 內建)

```yaml
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: steve-test-app-api-cert
spec:
  domains:
    - 34-8-111-101.nip.io # 這裡 nip.io 網域
```

#### 建立公開的 Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: steve-test-app-api-ingress
  annotations:
    kubernetes.io/ingress.class: 'gce'
    networking.gke.io/managed-certificates: steve-test-app-api-cert
spec:
  rules:
    - host: 34-8-111-101.nip.io # 這裡 nip.io 網域
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: steve-test-app-api-service
                port:
                  number: 80
```

須等第一次 Ingress 建立後，透過以下指令取得 `EXTERNAL-IP`

```bash
kubectl get ingress <ingress-name>
```

取得 `EXTERNAL-IP` 後可回頭修改 nip.io 網域

#### 建立 k8s 資源客製化 YAML

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - deployment.yaml
  - ingress.yaml
  - managed-certificate.yaml
  - service.yaml

images:
  - name: ghcr.io/stevelin100132/steve-test-app
    newTag: ${APP_VERSION}
```

---

### 📦 部署應用程式

輸入以下指令

```bash
kubectl apply -f .
```

---

### 🛠️ 管理叢集

- 查看節點：

```bash
kubectl get nodes
```

- 擴展 Deployment（e.g., 5 個 Pod）：

```bash
kubectl scale deployment hello-app --replicas=5
```

- 查看 Pod 狀態：

```bash
kubectl get pods
```

---

### 💰 建議事項

- 自動關閉叢集：測試完畢後記得刪除叢集以節省費用。

```bash
gcloud container clusters delete steve-cluster --zone=steve-cluster
```

使用 Autopilot 模式：GKE Autopilot 可以讓 Google 自動管理節點（較適合新手）。

---

### ⚙️ Google Cloud CD 設定

1. 前往
   [IAM 與管理員 → 服務帳戶](https://console.cloud.google.com/iam-admin/serviceaccounts)。
2. 選擇你的專案。
3. 選擇現有服務帳戶。
4. 點選「金鑰」分頁 →「新增金鑰」→ 選擇「JSON」→ 建立。
5. 下載產生的 JSON 金鑰檔案。

**注意：**

- 請妥善保管此金鑰，勿公開。
- 服務帳戶需有 GKE、Artifact Registry、Kubernetes Engine Admin 等必要權限。
