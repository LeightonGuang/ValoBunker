export const eventStatus = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) {
    return "Upcoming";
  }

  const formatedCurrentDate = new Date();

  // Set the time to 00:00:00 to compare only the date
  formatedCurrentDate.setHours(0, 0, 0, 0);

  const formatedStartDate = startDate ? new Date(startDate) : null;
  const formatedEndDate = endDate ? new Date(endDate) : null;

  if (!formatedStartDate || !formatedEndDate) {
    return "TBD";
  }

  const isUpcoming: boolean = formatedCurrentDate < formatedStartDate;
  const isOngoing: boolean =
    formatedCurrentDate >= formatedStartDate &&
    formatedCurrentDate <= formatedEndDate;
  const isEnded: boolean = formatedEndDate < formatedCurrentDate;

  if (isUpcoming) {
    return "Upcoming";
  } else if (isOngoing) {
    return "Ongoing";
  } else if (isEnded) {
    return "Ended";
  } else {
    return "Unknown";
  }
};
