getCalendarData(): any[] {
  // today
  const now = new Date();
  const todaysDay = now.getDate();
  const thisDay = new Date(now.getFullYear(), now.getMonth(), todaysDay);

  // Monday
  const thisMonday = new Date(thisDay.getFullYear(), thisDay.getMonth(), todaysDay - thisDay.getDay() + 1);
  const thisMondayDay = thisMonday.getDate();
  const thisMondayYear = thisMonday.getFullYear();
  const thisMondayMonth = thisMonday.getMonth();

  // 52 weeks before monday
  const calendarData = [];
  const getDate = d => new Date(thisMondayYear, thisMondayMonth, d);
  for (let week = -52; week <= 0; week++) {
    const mondayDay = thisMondayDay + week * 7;
    const monday = getDate(mondayDay);

    // one week
    const series = [];
    for (let dayOfWeek = 7; dayOfWeek > 0; dayOfWeek--) {
      const date = getDate(mondayDay - 1 + dayOfWeek);

      // skip future dates
      if (date > now) {
        continue;
      }

      // value
      const value = dayOfWeek < 6 ? date.getMonth() + 1 : 0;

      series.push({
        date,
        name: weekdayName.format(date),
        value
      });
    }

    calendarData.push({
      name: monday.toString(),
      series
    });
  }

  return calendarData;
}