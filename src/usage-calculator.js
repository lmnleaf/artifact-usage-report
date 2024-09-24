function calculate(artifact, startDate, endDate, currentPeriodDays) {
  let currentPeriodBillableDays = currentPeriodDays;
  let createdDate = new Date(artifact.created_at);
  let expiresDate = new Date(artifact.expires_at);

  let totalDays = Math.ceil((expiresDate - createdDate) / (24 * 60 * 60 * 1000) + 1);

  if (createdDate > startDate) {
    if (String(artifact.expired).toLowerCase() === 'true') {
      createdDate = createdDate.setUTCHours(0, 0, 0, 0);
      expiresDate = expiresDate.setUTCHours(23, 59, 59, 999);
      currentPeriodBillableDays = Math.ceil((expiresDate - createdDate) / (24 * 60 * 60 * 1000));
    } else {
      currentPeriodBillableDays = Math.ceil((endDate - createdDate) / (24 * 60 * 60 * 1000));
    }
  } else {
    if (String(artifact.expired).toLowerCase() === 'true') {
      currentPeriodBillableDays = Math.ceil((expiresDate - startDate) / (24 * 60 * 60 * 1000));
    }
  }

  let usage = {
    current_period_usage: artifact.size_in_bytes * currentPeriodBillableDays,
    total_usage: artifact.size_in_bytes * totalDays
  };

  return usage;
}

export const usageCalculator = {
  calculate: calculate
}
