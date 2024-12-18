export function getDateTime(dateTime: string) {
  let date = new Date(dateTime);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} at
  ${date.getHours() < 10 ? '0':''}${date.getHours()}:${date.getMinutes() < 10 ? '0':''}${date.getMinutes()}`;
}

export function getCurrentDate(): string {
  return new Date().toISOString().slice(0, 10).replace('T', ' ');
}

export function generateRandomNumber(lengthOfCode: number): number {
  return Math.floor(Math.random() * Math.pow(10, lengthOfCode));
}


export function getCurrentTimeStamp(): string {
  return new Date().toISOString();
}
