async function getArtifacts(totalDays, repo, owner, octokit) {
  let artifacts = [];
  const daysAgo = new Date();
  daysAgo.setDate(new Date().getDate() - totalDays);

  try {
    await octokit.paginate(
      octokit.rest.actions.listArtifactsForRepo,
      {
        owner,
        repo,
        per_page: 100
      },
      (response, done) => {
        let stopListingArtifacts = response.data.find((artifact) => new Date(artifact.created_at) >= daysAgo);
        if (stopListingArtifacts) {
          done();
        }
        artifacts.push(...response.data);
      }
    )

    return filteredArtifacts(artifacts, daysAgo);
  } catch(error) {
    throw error;
  }
}

function filteredArtifacts(artifacts, daysAgo) {
  return artifacts.filter((artifact) => new Date(artifact.created_at) >= daysAgo);
}

export const repoArtifacts = {
  getArtifacts: getArtifacts
}
