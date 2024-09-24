import { usageCalculator } from './usage-calculator.js';

async function getArtifacts(currentPeriodDays, repo, owner, octokit) {
  let artifacts = [];
  let exclusiveTotalDays = currentPeriodDays - 1;

  let dateToday = new Date();
  let endDate = new Date(dateToday);
  endDate = endDate.setUTCHours(23, 59, 59, 999);
  let startDate = new Date(dateToday);
  startDate.setUTCDate(dateToday.getUTCDate() - exclusiveTotalDays)
  startDate = startDate.setUTCHours(0, 0, 0, 0);

  try {
    await octokit.paginate(
      octokit.rest.actions.listArtifactsForRepo,
      {
        owner,
        repo,
        per_page: 100
      },
      (response, done) => {
        let stopListingArtifacts = response.data.find((artifact) => new Date(artifact.expires_at) < startDate);
        if (stopListingArtifacts) {
          done();
        }
        artifacts.push(...response.data);
      }
    )

    return artifactsWithUsage(artifacts, startDate, endDate, currentPeriodDays);
  } catch(error) {
    throw error;
  }
}

function artifactsWithUsage(artifacts, startDate, endDate, currentPeriodDays) {
  let filteredArtifacts = artifacts.filter((artifact) => new Date(artifact.expires_at) >= startDate);

  let artifactsWithUsage = filteredArtifacts.map((artifact) => {
    let usage = usageCalculator.calculate(artifact, startDate, endDate, currentPeriodDays);

    let newArtifact = {...artifact,
      current_period_usage_in_bytes: usage.current_period_usage,
      total_usage_in_bytes: usage.total_usage
    };

    return newArtifact;
  });

  return artifactsWithUsage;
}

export const repoArtifacts = {
  getArtifacts: getArtifacts
}
