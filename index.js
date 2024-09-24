import * as github from '@actions/github';
import * as core from '@actions/core';
import { artifactUsageReport } from './src/artifact-report.js';

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
    const currentPeriodDays = processInput(core.getInput('current_period_days'));
    const path = core.getInput('path');
    const owner = context.repo.owner;
    const repo = context.repo.repo;

    await artifactUsageReport.createReport(currentPeriodDays, path, repo, owner, octokit);

    return core.notice('Artifact usage report created.');
  } catch(error) {
    core.setFailed(error.message);
  }
}

main();
