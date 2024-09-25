async function getRepoNames(owner, octokit) {
  let repoNames = [];

  try {
    await octokit.paginate(
      octokit.rest.repos.listForOrg,
      { 
        owner,
        per_page: 100
      },
      (response, done) => {
        let activeRepos = response.data.filter(
          (repo) => repo.archived === 'false' || repo.archived === false
        );
        repoNames.push(...activeRepos.map((repo) => repo.name));
      }
    );
  } catch(error) {
    throw error;
  }

  return repoNames;
}

export const repoNames = {
  getRepoNames: getRepoNames
}
