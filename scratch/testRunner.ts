import { runPipelineQASuite } from '../src/services/pipelineQA';

async function main() {
  console.log('Running MetrologyLens AI Pipeline QA Suite (15 Test Cases)...');
  const report = await runPipelineQASuite();
  console.log('\n================ QA SUITE REPORT ================');
  console.log(`Timestamp: ${report.timestamp}`);
  console.log(`Total Tests: ${report.totalTests}`);
  console.log(`Passed: ${report.passedTests}`);
  console.log(`Failed: ${report.failedTests}`);
  console.log(`Success Rate: ${report.successRatePercent}%`);
  console.log(`Duration: ${report.durationTotalMs}ms\n`);

  report.results.forEach(r => {
    const symbol = r.passed ? '✓ PASS' : '✗ FAIL';
    console.log(`[${symbol}] ${r.id}: ${r.name} (${r.category})`);
    console.log(`   Expected: ${r.expected}`);
    console.log(`   Actual:   ${r.actual}`);
    console.log(`   Details:  ${r.details}\n`);
  });

  if (report.failedTests > 0) {
    process.exit(1);
  } else {
    console.log('All 15 pipeline QA tests passed with 100% accuracy!');
  }
}

main().catch(err => {
  console.error('QA Runner error:', err);
  process.exit(1);
});
