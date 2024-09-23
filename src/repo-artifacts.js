async function getArtifacts(totalDays, repo, owner, octokit) {
  let artifacts = [];
  let exclusiveTotalDays = totalDays - 1;

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

    return filteredArtifacts(artifacts, startDate);
  } catch(error) {
    throw error;
  }
}

function filteredArtifacts(artifacts, startDate) {
  let filteredArtifacts = artifacts.filter((artifact) => new Date(artifact.expires_at) >= startDate);
  return filteredArtifacts;
}

export const repoArtifacts = {
  getArtifacts: getArtifacts
}
