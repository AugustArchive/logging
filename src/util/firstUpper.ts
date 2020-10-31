export default function firstUpper(text: string) {
  const arr = text.split(' ');
  return arr.map(x => `${x.charAt(0).toUpperCase()}${x.slice(1)}`).join(' ');
}
