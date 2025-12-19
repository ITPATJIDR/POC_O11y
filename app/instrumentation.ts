import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { Resource } from '@opentelemetry/resources';
import { 
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION 
} from '@opentelemetry/semantic-conventions';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

const resource = new Resource({
  [ATTR_SERVICE_NAME]: 'elysia-service',
  [ATTR_SERVICE_VERSION]: '1.0.0',
});

const sdk = new NodeSDK({
  resource,
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT 
        ? `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`
        : 'http://localhost:4318/v1/metrics',
    }),
    exportIntervalMillis: 5000, // ส่งทุก 5 วินาทีเพื่อดูผลเร็วขึ้น
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT 
      ? `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`
      : 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [
    new HttpInstrumentation(),
  ],
});

// เริ่ม SDK
sdk.start();

// เพิ่ม Host Metrics (CPU, Memory, etc.)
const hostMetrics = new HostMetrics({ name: 'host-metrics' });
hostMetrics.start();

console.log('🔭 OpenTelemetry instrumentation initialized');

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry SDK shut down successfully'))
    .catch((error) => console.log('Error shutting down OpenTelemetry SDK', error))
    .finally(() => process.exit(0));
});
