import { repoArtifacts } from './repo-artifacts.js';
import * as fs from 'fs';

async function createReport(totalDays, path, repo, owner, octokit) {
  let artifacts = [];
  try {
    artifacts = await repoArtifacts.getArtifacts(totalDays, repo, owner, octokit);

    if (artifacts.length === 0) {
      return 'No artifacts found.';
    }

    writeReport(artifacts, path);
  } catch(error) {
    throw error;
  }

  return reportSummary(repo, artifacts);
}

function writeReport(artifacts, path) {
  const csvRows = artifacts.map((artifact) => [
    artifact.id,
    artifact.node_id,
    artifact.name,
    artifact.size_in_bytes,
    artifact.expired,
    artifact.created_at,
    artifact.updated_at,
    artifact.expires_at,
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
    'expired',
    'created_at',
    'updated_at',
    'expires_at',
    'workflow_run.id',
    'workflow_run.repository_id',
    'workflow_run.head_repository_id',
    'workflow_run.head_branch',
    'workflow_run.head_sha',
    'url',
    'archive_download_url'
  ]);

  artifactUsageReport.writeFile(path + 'artifact-usage-report.csv', csvRows.join('\r\n'), (error) => {
    console.log(error || 'Report created successfully.');
  })
}

function writeFile(path, data, callback) {
  fs.writeFile(path, data, callback);
}

function reportSummary(repo, artifacts) {
  return 'Total artifacts found: ' + artifacts.length.toString() + '.';
}
export const artifactUsageReport = {
  writeFile: writeFile,
  createReport: createReport
}
