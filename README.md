# ElysiaJS OpenTelemetry Lab 🔭

Lab Environment สำหรับทดสอบ ElysiaJS ร่วมกับ OpenTelemetry, Prometheus และ Grafana

## 🏗️ Architecture

```
ElysiaJS App → OpenTelemetry Collector → Prometheus → Grafana Dashboard
```

## 🚀 Quick Start

### 1. เริ่มต้น Lab Environment

```bash
docker-compose up -d
```

### 2. เข้าถึง Services

- **ElysiaJS App**: http://localhost:3000
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

### 3. ทดสอบ Metrics

สร้าง traffic เพื่อให้เกิด metrics:

```bash
# ส่ง request ปกติ
curl http://localhost:3000/

# ทดสอบ endpoint ที่มี latency
curl http://localhost:3000/slow

# ทดสอบ metrics endpoint
curl http://localhost:3000/metrics-test

# ทดสอบ error metrics
curl http://localhost:3000/error
```

หรือใช้ loop เพื่อสร้าง continuous traffic:

```bash
# Windows PowerShell
while ($true) { Invoke-WebRequest -Uri http://localhost:3000/metrics-test; Start-Sleep -Milliseconds 500 }
```

### 4. ดู Dashboard ใน Grafana

1. เปิด http://localhost:3001
2. Login ด้วย `admin` / `admin`
3. ไปที่ Dashboards → ElysiaJS Observability Dashboard
4. คุณจะเห็น:
   - HTTP Request Rate
   - Request Duration (p95)
   - Memory Usage
   - CPU Usage
   - Active Requests
   - Total Requests

## 📊 Available Endpoints

- `GET /` - Hello message
- `GET /health` - Health check
- `GET /metrics-test` - Generate random metrics
- `GET /slow` - Slow endpoint (1s delay)
- `GET /error` - Error endpoint

## 🔍 Exploring Metrics

### ใน Prometheus (http://localhost:9090)

ลองค้นหา metrics เหล่านี้:

```promql
# HTTP request rate
rate(elysia_http_server_duration_count[1m])

# HTTP request duration (p95)
histogram_quantile(0.95, rate(elysia_http_server_duration_bucket[1m]))

# Memory usage
elysia_process_runtime_bun_memory_rss

# CPU usage
rate(elysia_system_cpu_time_seconds_total[1m])
```

### ใน Grafana

Dashboard ถูกสร้างไว้อัตโนมัติแล้ว! แต่คุณสามารถสร้าง panel ใหม่ได้โดย:

1. คลิก "Add" → "Visualization"
2. เลือก Prometheus datasource
3. ใส่ PromQL query
4. ปรับแต่ง visualization ตามต้องการ

## 🛠️ Project Structure

```
elysia-otel-lab/
├── app/
│   ├── index.ts              # ElysiaJS application
│   ├── instrumentation.ts    # OpenTelemetry setup
│   ├── package.json          # Dependencies
│   └── Dockerfile            # App container
├── grafana/
│   └── provisioning/
│       ├── datasources/      # Auto-configure Prometheus
│       └── dashboards/       # Pre-built dashboards
├── docker-compose.yaml       # All services
├── otel-collector-config.yaml
├── prometheus.yml
└── README.md
```

## 🧹 Cleanup

หยุดและลบทุกอย่าง:

```bash
docker-compose down -v
```

## 📝 Notes

- Metrics จะถูกส่งทุก 5 วินาที (ตั้งค่าไว้เร็วเพื่อการทดสอบ)
- Grafana dashboard จะ refresh ทุก 5 วินาที
- Data จะถูกเก็บใน Docker volumes (`prometheus-data`, `grafana-data`)

## 🎯 Next Steps

1. ลองปรับแต่ง dashboard ใน Grafana
2. เพิ่ม custom metrics ใน ElysiaJS app
3. ทดสอบ distributed tracing
4. เพิ่ม alerting rules ใน Prometheus

Happy Observing! 🔭✨
