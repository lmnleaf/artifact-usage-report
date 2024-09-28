# artifact-usage-report

The Artifact Usage Report action generates a CSV that contains a list of artifacts and a summary of their usage in bytes.
* This action can be configured to include artifacts from select repositories or all repositories in an organization.
* Each row in the CSV is an artifact that includes artifact data returned from GitHub's REST API as well as
`current_period_usage_in_bytes`,`current_period_starts_at`, `current_period_ends_at`,  `total_usage_in_bytes`, and `repo`.
The additional information is useful for determining how much storage is used by an artifact, which can then be used to
determine the total cost of storage for that artifact.
  * `current_period_usage_in_bytes` is the total usage from the start of the period to the end of the period OR from the
  start of the period to the artifact expiration date when that's before the end of the period.
  * `total_usage_in_bytes` is the total usage from the `created_at` to `expires_at` dates.
  * `repo` is the name of the repo where the artifact is found.
* The current period for the report is specified in days. The current period includes the day the action runs, and the
report will include artifacts that expire within or after the current period. For example, if the current period is seven
days, the action will get artifacts that expire at or after midnight UTC seven days ago, inclusive of today. So if today is
a Monday, seven total days will include artifacts expiring on or after Tuesday of the previous week.
* The workflow annotation includes a report summary.
* **Note:** A row is added to the CSV for each artifact that is found. When a repo is NOT found, the action will exit with
an error. When a repo is found but artifacts are NOT found, the action will continue without error.

<br>

:star: **Configuration Details**
* Required input:
  * `token` - GITHUB_TOKEN or PAT. Use a PAT to get artifacts for repos other than the repo where the action is used.
  * `path` - the path where the CSV should be written. **Note:** to upload the CSV as an artifact, use GitHub's
  [upload-artifact](https://github.com/actions/upload-artifact) action.
* Optional input:
  * `current_period_days` - the number of days to look back for artifacts. Minimum is 1 and maximum is 400. Defaults to 30.
  * `repos` - a comma separated list of repos from which to get the artifacts. Set it to `all` to get analyses from all
  repos in an organization. Defaults to the current repo.

<br>

:file_cabinet: :page_facing_up: **Sample CSV Header and Data**
```
id,node_id,name,size_in_bytes,current_period_usage_in_bytes,total_usage_in_bytes,expired,created_at,updated_at,expires_at,current_period_starts_at,current_period_ends_at,repo,workflow_run.id,workflow_run.repository_id,workflow_run.head_repository_id,workflow_run.head_branch,workflow_run.head_sha,url,archive_download_url
1989853583,MDg6QXJ0aWZhY3QxOTg5ODUzNTgz,artifact-usage-report,1584,1584,144144,false,2024-09-28T00:40:59Z,2024-09-28T00:40:59Z,2024-12-27T00:40:50Z,2024-09-22T00:00:00.000Z,2024-09-28T23:59:59.999Z,cool-repo,11079562997,629776099,629776099,main,29e8a6b8d82c6ac8e3587e5f34e24009584a0643,https://api.github.com/repos/owner/cool-repo/actions/artifacts/1989853583,https://api.github.com/repos/owner/cool-repo/actions/artifacts/1989853583/zip
```

<br>

:closed_book: **Sample Workflow Annotation/Report Summary**
```
Repos: cool-repo, woot-repo, wow-repo.
Total artifacts found: 21.
Current period usage in bytes: 203682.
```

<br>

:yo_yo: **Example Workflow Configuration**
```
name: Artifacts Usage Report

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 28-31 * *'

jobs:
  artifacts-csv:
    runs-on: ubuntu-latest
    name: Artifacts Usage CSV
    steps:
      - name: Generate CSV
        uses: lmnleaf/artifacts-usage-report@v1.0.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          path: ${{ github.workspace }}
          repos: cool-repo,woot-repo,wow-repo
          total_days: 7
      - name: Upload CSV
        uses: actions/upload-artifact@v4
        with:
          name: artifacts-usage-csv
          path: ${{ github.workspace }}/*.csv
```
