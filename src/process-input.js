function processInput (daysInput, reposInput, context) {
  let input = {
    currentPeriodDays: 30,
    repos: [context.repo.repo],
    owner: context.repo.owner
  }

  if (reposInput != null && reposInput.length > 0) {
    input.repos = reposInput.split(',');
  }

  let days = parseInt(daysInput);
  if (days != NaN && days > 0 && days <= 400) {
    input.currentPeriodDays = days;
  } else if (days != NaN && (days <= 0 || days > 400)) {
    throw new Error('current_period_days must be greater than 0 and less than or equal to 400.');
  }

  return input;
}

export { processInput };
