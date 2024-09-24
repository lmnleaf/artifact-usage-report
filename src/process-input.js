function processInput (daysInput) {
  let days = parseInt(daysInput);
  let currentPeriodDays = 30;

  if (days != NaN && days > 0 && days <= 400) {
    currentPeriodDays = days;
  } else if (days != NaN && (days <= 0 || days > 400)) {
    throw new Error('current_period_days must be greater than 0 and less than or equal to 400.');
  }

  return currentPeriodDays;
}

export { processInput };
