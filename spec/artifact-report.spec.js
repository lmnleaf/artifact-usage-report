import { artifactUsageReport } from '../src/artifact-report.js';
import { repoArtifacts } from '../src/repo-artifacts.js';
import Moctokit from './support/moctokit.js';

describe("Artifacts Usage Report", function() {
  let octokit;
  let getArtifactsOriginal;
  let owner = 'orgA';
  let repo = 'repoA';
  let totalDays = null;
  let path = '/home/runner/work/this-repo/this-repo/';
  let mockData = [
    {
      id: 1935320941,
      node_id: 'MDg6QXJ0aWZhY3QxOTM1MzIwOTQx',
      name: 'artifact',
      size_in_bytes: 970209,
      url: 'https://api.github.com/repos/orgA/repoA/actions/artifacts/1935320941',
      archive_download_url: 'https://api.github.com/repos/orgA/repoA/actions/artifacts/1935320941/zip',
      expired: false,
      created_at: '2024-09-15T22:51:24Z',
      updated_at: '2024-09-15T22:51:25Z',
      expires_at: '2024-12-14T22:49:56Z',
      workflow_run: {
        id: 10874914009,
        repository_id: 476841352,
        head_repository_id: 476841352,
        head_branch: 'main',
        head_sha: 'a8be65a390c2bff1eddd634387ebcf41cc21ada1'
      }
    },
    {
      id: 1774246572,
      node_id: "MDg6QXJ0aWZhY3QxNzc0MjQ2NTcy",
      name: "artifact",
      size_in_bytes: 9551553,
      url: "https://api.github.com/repos/orgA/repoA/actions/artifacts/1774246572",
      archive_download_url: "https://api.github.com/repos/orgA/repoA/actions/artifacts/1774246572/zip",
      expired: false,
      created_at: "2024-09-04T22:50:50Z",
      updated_at: "2024-09-04T22:50:51Z",
      expires_at: "2024-12-02T22:49:21Z",
      workflow_run: {
        id: 10239848305,
        repository_id: 476841352,
        head_repository_id: 476841352,
        head_branch: "main",
        head_sha: "a8be65a390c2bff1eddd634387ebcf41cc21ada1"
      }
    },
    {
      id: 1723785662,
      node_id: "MDg6QXJ0aWZhY3QxNzIzNzg1NjYy",
      name: "artifact",
      size_in_bytes: 476841352,
      url: "https://api.github.com/repos/orgA/repoA/actions/artifacts/1723785662",
      archive_download_url: "https://api.github.com/repos/orgA/repoA/actions/artifacts/1723785662/zip",
      expired: false,
      created_at: "2024-07-21T22:51:01Z",
      updated_at: "2024-07-21T22:51:02Z",
      expires_at: "2024-10-19T22:49:35Z",
      workflow_run: {
        id: 10031917224,
        repository_id: 476841352,
        head_repository_id: 476841352,
        head_branch: "main",
        head_sha: "a8be65a390c2bff1eddd634387ebcf41cc21ada1"
      }
    },
    {
      id: 1653352608,
      node_id: "MDg6QXJ0aWZhY3QxNjUzMzUyNjA4",
      name: "artifact",
      size_in_bytes: 934441,
      url: "https://api.github.com/repos/orgA/repoA/actions/artifacts/1653352608",
      archive_download_url: "https://api.github.com/repos/orgA/repoA/actions/artifacts/1653352608/zip",
      expired: false,
      created_at: "2024-05-30T22:51:22Z",
      updated_at: "2024-05-30T22:51:23Z",
      expires_at: "2024-08-28T22:49:51Z",
      workflow_run: {
        id: 9735510910,
        repository_id: 476841352,
        head_repository_id: 476841352,
        head_branch: "main",
        head_sha: "a8be65a390c2bff1eddd634387ebcf41cc21ada1"
      }
    }
  ]

  beforeEach(() => {
    octokit = new Moctokit();

    getArtifactsOriginal = repoArtifacts.getArtifacts;

    artifactUsageReport.writeFile = jasmine.createSpy('writeFile').and.callFake((path, data, callback) => {
      callback(null); // Simulate successful write operation
    });
  });

  afterEach(() => {
    // reset to original module function, so doesn't affect other tests
    repoArtifacts.getArtifacts = getArtifactsOriginal;
  });

 it ('creates a CSV of artifacts', async function() {
    spyOn(repoArtifacts, 'getArtifacts').and.returnValue(Promise.resolve(mockData));

    await artifactUsageReport.createReport(totalDays, path, repo, owner, octokit);

    expect(repoArtifacts.getArtifacts).toHaveBeenCalledWith(totalDays, repo, owner, octokit);
    expect(artifactUsageReport.writeFile).toHaveBeenCalled();

    const args = artifactUsageReport.writeFile.calls.mostRecent().args;
    const filePath = args[0];
    const fileContent = args[1];

    expect(filePath).toContain('/home/runner/work/this-repo/this-repo/artifact-usage-report.csv');

    const lines = fileContent.split('\n');

    expect(lines.length).toBe(5);
    expect(lines[0]).toContain(
      'id,node_id,name,size_in_bytes,expired,' +
      'created_at,updated_at,expires_at,' + 
      'workflow_run.id,workflow_run.repository_id,' +
      'workflow_run.head_repository_id,workflow_run.head_branch,workflow_run.head_sha,' +
      'url,' +
      'archive_download_url'
    );
    expect(lines[1]).toContain(
      '1935320941,MDg6QXJ0aWZhY3QxOTM1MzIwOTQx,artifact,970209,false,' +
      '2024-09-15T22:51:24Z,2024-09-15T22:51:25Z,2024-12-14T22:49:56Z,' +
      '10874914009,476841352,476841352,main,a8be65a390c2bff1eddd634387ebcf41cc21ada1,' +
      'https://api.github.com/repos/orgA/repoA/actions/artifacts/1935320941,' +
      'https://api.github.com/repos/orgA/repoA/actions/artifacts/1935320941/zip'
    );
    expect(lines[2]).toContain(
      '1774246572,MDg6QXJ0aWZhY3QxNzc0MjQ2NTcy,artifact,9551553,false,' + 
      '2024-09-04T22:50:50Z,2024-09-04T22:50:51Z,2024-12-02T22:49:21Z,' + 
      '10239848305,476841352,476841352,main,a8be65a390c2bff1eddd634387ebcf41cc21ada1,' + 
      'https://api.github.com/repos/orgA/repoA/actions/artifacts/1774246572,' + 
      'https://api.github.com/repos/orgA/repoA/actions/artifacts/1774246572/zip'
    );
    expect(lines[3]).toContain(
      '1723785662,MDg6QXJ0aWZhY3QxNzIzNzg1NjYy,artifact,476841352,false,' + 
      '2024-07-21T22:51:01Z,2024-07-21T22:51:02Z,2024-10-19T22:49:35Z,' + 
      '10031917224,476841352,476841352,main,a8be65a390c2bff1eddd634387ebcf41cc21ada1,' + 
      'https://api.github.com/repos/orgA/repoA/actions/artifacts/1723785662,' + 
      'https://api.github.com/repos/orgA/repoA/actions/artifacts/1723785662/zip'
    );
    expect(lines[4]).toContain(
      '1653352608,MDg6QXJ0aWZhY3QxNjUzMzUyNjA4,artifact,934441,false,' + 
      '2024-05-30T22:51:22Z,2024-05-30T22:51:23Z,2024-08-28T22:49:51Z,' + 
      '9735510910,476841352,476841352,main,a8be65a390c2bff1eddd634387ebcf41cc21ada1,' + 
      'https://api.github.com/repos/orgA/repoA/actions/artifacts/1653352608,' + 
      'https://api.github.com/repos/orgA/repoA/actions/artifacts/1653352608/zip'
    );
  });

  it ('returns a report summary', async function() {
    spyOn(repoArtifacts, 'getArtifacts').and.returnValue(Promise.resolve(mockData));

    const reportSummary = await artifactUsageReport.createReport(totalDays, path, repo, owner, octokit);

    expect(reportSummary).toEqual(
      'Total artifacts found: 4.'
    );
  });

  it('returns a report summary when there are no Artifacts found', async function() {
    spyOn(repoArtifacts, 'getArtifacts').and.returnValue(Promise.resolve([]));
    const reportSummary= await artifactUsageReport.createReport(totalDays, path, repo, owner, octokit);

    expect(reportSummary).toEqual(
      'No artifacts found.'
    );
  });

  it('handles errors', async function() {
    let repos = 'repo1,repo2';
    let caughtError;
    spyOn(repoArtifacts, 'getArtifacts').and.returnValue(Promise.reject(new Error('fetch error')));

    try {
      await artifactUsageReport.createReport(totalDays, path, repo, owner, octokit);
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toEqual(new Error('fetch error'));
  });
});
