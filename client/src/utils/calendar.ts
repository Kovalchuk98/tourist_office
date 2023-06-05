function getWeek(counter: number): Array<string> {
  const curr = new Date();
  curr.setDate(curr.getDate() + 7 * counter);
  const week: Array<string> = [];

  for (let i = 1; i <= 7; i++) {
    const first = curr.getDate() - curr.getDay() + i;
    const day = new Date(curr.setDate(first))
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join(".");

    week.push(day);
  }
  return week;
}

export default getWeek;
