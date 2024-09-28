import { orgRepos } from './org-repos.js';
import * as fs from 'fs';

async function createReport(currentPeriodDays, path, repos, owner, octokit) {
  let artifacts = [];

  try {
    artifacts = await orgRepos.getArtifactsForRepos(currentPeriodDays, repos, owner, octokit);

    if (artifacts.length === 0) {
      return 'No artifacts found.';
    }

    writeReport(artifacts, path);
  } catch(error) {
    throw error;
  }

  return reportSummary(repos, artifacts);
}

function writeReport(artifacts, path) {
  const csvRows = artifacts.map((artifact) => [
    artifact.id,
    artifact.node_id,
    artifact.name,
    artifact.size_in_bytes,
    artifact.current_period_usage_in_bytes,
    artifact.total_usage_in_bytes,
    artifact.expired,
    artifact.created_at,
    artifact.updated_at,
    artifact.expires_at,
    artifact.current_period_starts_at,
    artifact.current_period_ends_at,
    artifact.repo,
    artifact.workflow_run.id,
    artifact.workflow_run.repository_id,
    artifact.workflow_run.head_repository_id,
    artifact.workflow_run.head_branch,
    artifact.workflow_run.head_sha,
    artifact.url,
    artifact.archive_download_url
  ]);

  csvRows.unshift([
    'id',
    'node_id',
    'name',
    'size_in_bytes',
    'current_period_usage_in_bytes', // from period start date to expires_at or today's date, inclusive
    'total_usage_in_bytes', // from created_at to expires_at, inclusive
    'expired',
    'created_at',
    'updated_at',
    'expires_at',
    'current_period_starts_at',
    'current_period_ends_at',
    'repo',
    'workflow_run.id',
    'workflow_run.repository_id',
    'workflow_run.head_repository_id',
    'workflow_run.head_branch',
    'workflow_run.head_sha',
    'url',
    'archive_download_url'
  ]);

  artifactUsageReport.writeFile(path + '/artifact-usage-report.csv', csvRows.join('\r\n'), (error) => {
    console.log(error || 'Report created successfully.');
  })
}

function writeFile(path, data, callback) {
  fs.writeFile(path, data, callback);
}

function reportSummary(repos, artifacts) {
  let reposSummary = repos.length === 1 && repos[0] === 'all' ? 'All Org Repos.' : repos.join(', ') + '.';
  let usageSummary = artifacts.reduce((total, artifact) => total + artifact.current_period_usage_in_bytes, 0);

  let reportSummary = 'Repos: ' + reposSummary + '\n' +
    'Total artifacts found: ' + artifacts.length.toString() + '.\n' +
    'Current period usage in bytes: ' + usageSummary.toString() + '.';

  return reportSummary;
}

export const artifactUsageReport = {
  writeFile: writeFile,
  createReport: createReport
}
