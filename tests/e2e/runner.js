#!/usr/bin/env node
/**
 * Master E2E Test Suite Runner
 * 
 * Executes all 4 tiers of opaque-box E2E tests:
 * - Tier 1: Feature Coverage (>=5 per feature)
 * - Tier 2: Boundary & Corner Cases (>=5 per feature)
 * - Tier 3: Cross-Feature Combinations (Pairwise)
 * - Tier 4: Real-World Application Scenarios (>=5 scenarios)
 * 
 * Usage:
 *   node tests/e2e/runner.js
 *   node tests/e2e/runner.js --json
 */

import { TestReport } from './helpers/assertions.js';
import { runTier1 } from './tier1-features.test.js';
import { runTier2 } from './tier2-boundaries.test.js';
import { runTier3 } from './tier3-combinations.test.js';
import { runTier4 } from './tier4-scenarios.test.js';

export async function runAllTests() {
  const report = new TestReport();

  console.log('\n[E2E Runner] Initializing 4-tier opaque-box E2E test suite...');
  console.log('[E2E Runner] Target: travel.varneet.in static build output (dist/) and library contracts\n');

  console.log('-> Executing Tier 1: Feature Coverage...');
  await runTier1(report);

  console.log('-> Executing Tier 2: Boundary & Corner Cases...');
  await runTier2(report);

  console.log('-> Executing Tier 3: Cross-Feature Combinations...');
  await runTier3(report);

  console.log('-> Executing Tier 4: Real-World Application Scenarios...');
  await runTier4(report);

  const formatted = report.formatSummary();
  console.log(formatted);

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(report, null, 2));
  }

  const { failed } = report.summary;
  return {
    report,
    exitCode: failed > 0 ? 1 : 0,
  };
}

// If invoked directly from CLI
if (process.argv[1] && process.argv[1].endsWith('runner.js')) {
  runAllTests().then(({ exitCode }) => {
    process.exit(exitCode);
  }).catch((err) => {
    console.error('Fatal error during test suite execution:', err);
    process.exit(1);
  });
}
