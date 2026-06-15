# yaoguayi.com 部署手册

> 服务器：Oracle Cloud Ubuntu 24.04 aarch64  
> IP：170.9.28.104  
> 域名：yaoguayi.com（A 记录已指向服务器）  
> 端口：80/443 已在安全列表放行

---

## 第一步：SSH 登录服务器

```bash
ssh ubuntu@170.9.28.104
```

---

## 第二步：系统更新 + 安装 Nginx & Certbot & Git

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx certbot python3-certbot-nginx git
```

验证 Nginx 是否启动：
```bash
sudo systemctl status nginx
# 应显示 active (running)
```

此时浏览器访问 http://170.9.28.104 应能看到 Nginx 默认欢迎页。  
如果看不到，检查 iptables：
```bash
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
# 持久化 iptables 规则
sudo apt install -y iptables-persistent
sudo netfilter-persistent save
```

---

## 第三步：克隆仓库

```bash
cd /var/www
sudo git clone https://github.com/Hypocrite65/yaoguayi.git
sudo chown -R ubuntu:ubuntu /var/www/yaoguayi
```

验证站点文件：
```bash
ls /var/www/yaoguayi/site/
# 应看到 index.html  favicon.svg
```

---

## 第四步：配置 Nginx

首次部署建议先使用纯 HTTP 配置（因为证书还没申请）：

```bash
sudo tee /etc/nginx/sites-available/yaoguayi.com > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name yaoguayi.com www.yaoguayi.com;

    root /var/www/yaoguayi/site;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;
    gzip_min_length 256;

    # Static file caching
    location ~* \.(svg|ico|css|js|png|jpg|jpeg|gif|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Block hidden files
    location ~ /\. {
        deny all;
    }
}
EOF

# 启用站点
sudo ln -sf /etc/nginx/sites-available/yaoguayi.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 测试 + 重载
sudo nginx -t && sudo systemctl reload nginx
```

此时访问 http://yaoguayi.com 应能看到密码门页面。

---

## 第五步：申请 HTTPS 证书（Let's Encrypt）

```bash
sudo certbot --nginx -d yaoguayi.com -d www.yaoguayi.com
```

按照提示操作：
1. 输入邮箱（用于证书到期提醒）
2. 同意 Terms of Service
3. 选择是否分享邮箱给 EFF（随意）

Certbot 会自动修改 Nginx 配置，添加 SSL 指令和 HTTP→HTTPS 跳转。

验证 HTTPS：
```bash
curl -I https://yaoguayi.com
# 应显示 HTTP/2 200 和证书信息
```

---

## 第六步：加固 Nginx 配置

证书申请成功后，补充安全头。编辑 `/etc/nginx/sites-available/yaoguayi.com`，在 443 server block 中添加：

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 第七步：验证证书自动续期

```bash
sudo certbot renew --dry-run
# 应输出: Congratulations, all simulated renewals succeeded
```

---

## 第八步：验证上线

浏览器访问以下地址，确认均正常：

- [ ] https://yaoguayi.com → 显示密码门
- [ ] http://yaoguayi.com → 自动跳转到 HTTPS
- [ ] https://www.yaoguayi.com → 正常访问
- [ ] 输入密码 → 进入首页
- [ ] 64 卦网格加载正常，动画流畅
- [ ] favicon.svg 显示在浏览器标签栏

---

## 后续更新部署

### 方式一：手动更新

```bash
cd /var/www/yaoguayi && git pull origin main
```

### 方式二：Webhook 自动部署（推荐）

本地 `git push` 后，GitHub 自动通知服务器拉取最新代码。

#### 第一步：服务器端 — 安装 webhook 服务

```bash
# 1. 先 git pull 把 webhook 脚本拉到服务器
cd /var/www/yaoguayi && git pull origin main

# 2. 生成一个随机密钥（记住它，后面 GitHub 配置要用）
openssl rand -hex 20
# 输出类似: a1b2c3d4e5f6...（复制保存）

# 3. 编辑 webhook.service，把 your-secret-here 替换成上面的密钥
sudo nano /var/www/yaoguayi/deploy/webhook.service
# 找到 Environment=WEBHOOK_SECRET=your-secret-here
# 改成 Environment=WEBHOOK_SECRET=a1b2c3d4e5f6...（你的实际密钥）

# 4. 安装并启动服务
sudo cp /var/www/yaoguayi/deploy/webhook.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable webhook
sudo systemctl start webhook

# 5. 验证服务在运行
sudo systemctl status webhook
# 应显示 active (running)
```

#### 第二步：开放防火墙端口 9000

```bash
sudo iptables -I INPUT -p tcp --dport 9000 -j ACCEPT
sudo netfilter-persistent save
```

验证端口可访问：
```bash
curl http://localhost:9000
# 应返回: yaoguayi webhook is running
```

#### 第三步：GitHub 配置 Webhook

1. 打开 https://github.com/Hypocrite65/yaoguayi/settings/hooks
2. 点击 **Add webhook**
3. 填写：
   - **Payload URL**: `http://170.9.28.104:9000`
   - **Content type**: `application/json`
   - **Secret**: 填入第一步生成的密钥
   - **Which events**: 选择 `Just the push event`
4. 点击 **Add webhook**

GitHub 会立刻发一个 ping 测试。如果显示绿色勾 ✓，说明配置成功。

#### 验证自动部署

在本地修改任意文件，push 到 main：
```bash
git push origin main
```

然后查看服务器日志确认自动拉取：
```bash
tail -f /var/www/yaoguayi/deploy/webhook.log
```

#### Webhook 运维命令

```bash
# 查看状态
sudo systemctl status webhook

# 查看日志
tail -20 /var/www/yaoguayi/deploy/webhook.log

# 重启
sudo systemctl restart webhook

# 停用（回到手动 git pull）
sudo systemctl stop webhook
```

如果只更新了 HTML/CSS/JS 静态文件，无需重启 Nginx。

后续迁移到 Next.js 后，部署方式会改为 `pnpm build` + 静态导出或 Node.js 进程 + Nginx 反代。

---

## 常用运维命令

```bash
# 查看 Nginx 状态
sudo systemctl status nginx

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log

# 重载配置（不中断服务）
sudo systemctl reload nginx

# 重启 Nginx
sudo systemctl restart nginx

# 查看证书到期时间
sudo certbot certificates

# 查看当前部署版本
cd /var/www/yaoguayi && git log --oneline -1
```
