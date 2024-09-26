import * as github from '@actions/github';
import * as core from '@actions/core';
import { artifactUsageReport } from './src/artifact-report.js';
import { processInput } from './src/process-input.js';

// Note: use when running locally
// import * as dotenv from 'dotenv';
// const env = dotenv.config();
// const token = process.env.GITHUB_TOKEN;
// const owner = process.env.OWNER;
// const repo = process.env.REPO;
// const path = './';

const context = github.context;

async function main() {
  try {
    const token = core.getInput('token');
    const octokit = new github.getOctokit(token);
    const daysInput = core.getInput('current_period_days');
    const path = core.getInput('path');
    const reposInput = core.getInput('repos');

    const { currentPeriodDays, repos, owner } = processInput(daysInput, reposInput, context);

    const reportSummary = await artifactUsageReport.createReport(currentPeriodDays, path, repos, owner, octokit);

    return core.notice(reportSummary);
  } catch(error) {
    core.setFailed(error.message);
  }
}

main();
