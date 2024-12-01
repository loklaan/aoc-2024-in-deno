// deno-lint-ignore ban-types
export function keys<T extends {}>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}
export function reverse(str: string) {
  return str.split("").reverse().join("");
}
export function min(min: number, val: number) {
  return min < val ? val : min;
}
export function max(max: number, val: number) {
  return max > val ? val : max;
}
