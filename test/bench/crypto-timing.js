const crypto = require('crypto');
const { performance } = require('perf_hooks');
const assert = require('assert');

// Test vectors
const SHORT_A = Buffer.from('a');
const SHORT_B = Buffer.from('b');
const LONG_A = crypto.randomBytes(1024);
const LONG_B = crypto.randomBytes(1024);

function measure(fn) {
  const runs = 10000;
  const times = [];
  
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  
  return {
    avg: times.reduce((sum, t) => sum + t, 0) / runs,
    min: Math.min(...times),
    max: Math.max(...times)
  };
}

// Test constant-time equality
const equalTime = measure(() => crypto.timingSafeEqual(SHORT_A, SHORT_A));
const notEqualTime = measure(() => crypto.timingSafeEqual(SHORT_A, SHORT_B));
const longEqualTime = measure(() => crypto.timingSafeEqual(LONG_A, LONG_A));
const longNotEqualTime = measure(() => crypto.timingSafeEqual(LONG_A, LONG_B));

// Assert timing consistency
const MAX_VARIANCE = 0.1; // 10%
assert(
  Math.abs(equalTime.avg - notEqualTime.avg) / equalTime.avg < MAX_VARIANCE,
  `Timing variance exceeds threshold: ${equalTime.avg} vs ${notEqualTime.avg}`
);

console.log('TimingSafeEqual consistency verified:');
console.table({ equalTime, notEqualTime, longEqualTime, longNotEqualTime });
