/**
 * Test assertion and reporting primitives for the 4-tier E2E test suite.
 * Pure zero-dependency Node.js ESM.
 */

export class TestReport {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  addResult({ id, name, tier, feature, passed, error = null, details = null }) {
    this.results.push({
      id,
      name,
      tier,
      feature,
      passed,
      error: error ? (error.message || String(error)) : null,
      details,
    });
  }

  get summary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const durationMs = Date.now() - this.startTime;
    return { total, passed, failed, durationMs };
  }

  getByTier(tierName) {
    return this.results.filter(r => r.tier === tierName);
  }

  formatSummary() {
    const { total, passed, failed, durationMs } = this.summary;
    let out = '\n' + '='.repeat(80) + '\n';
    out += `  E2E TEST SUITE RUNNER SUMMARY (${durationMs}ms)\n`;
    out += '='.repeat(80) + '\n\n';

    const tiers = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'];
    for (const tier of tiers) {
      const tierResults = this.getByTier(tier);
      const tPassed = tierResults.filter(r => r.passed).length;
      const tFailed = tierResults.length - tPassed;
      out += `[${tier}] ${tPassed}/${tierResults.length} passed`;
      if (tFailed > 0) {
        out += ` (${tFailed} failed)`;
      }
      out += '\n';

      for (const r of tierResults) {
        const mark = r.passed ? '  ✓' : '  ✗';
        out += `${mark} [${r.id}] ${r.name}\n`;
        if (!r.passed && r.error) {
          out += `      FAIL: ${r.error}\n`;
          if (r.details) {
            out += `      Details: ${r.details}\n`;
          }
        }
      }
      out += '\n';
    }

    out += '-'.repeat(80) + '\n';
    out += `TOTAL: ${total} tests | PASSED: ${passed} | FAILED: ${failed}\n`;
    out += '-'.repeat(80) + '\n';
    return out;
  }
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || 'Assertion failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

export function assertIncludes(haystack, needle, message) {
  if (!haystack || !haystack.includes(needle)) {
    throw new Error(`${message || 'Assertion failed'}: expected string to include "${needle}"`);
  }
}

export function assertNotIncludes(haystack, needle, message) {
  if (haystack && haystack.includes(needle)) {
    throw new Error(`${message || 'Assertion failed'}: expected string NOT to include "${needle}"`);
  }
}

export function assertMatch(text, regex, message) {
  if (!regex.test(text)) {
    throw new Error(`${message || 'Assertion failed'}: text does not match pattern ${regex}`);
  }
}

export function assertNotMatch(text, regex, message) {
  if (regex.test(text)) {
    throw new Error(`${message || 'Assertion failed'}: text unexpectedly matches pattern ${regex}`);
  }
}
