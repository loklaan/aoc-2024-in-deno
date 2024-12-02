import { Solution } from "@/lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const locationIdsListsPairs = input
    .split("\n")
    .filter((x) => x)
    .map((line) =>
      line
        .split("   ")
        .map((id) => parseInt(id))
    );

  debug(`Total location ID pairs: ${locationIdsListsPairs.length}`);

  const locationIdsGroupA = locationIdsListsPairs.map((locationIds) =>
    locationIds[0]
  ).toSorted();
  const locationIdsGroupB = locationIdsListsPairs.map((locationIds) =>
    locationIds[1]
  ).toSorted();
  const distances = locationIdsGroupA.map((locationIdA, index) => {
    const locationIdB = locationIdsGroupB[index];
    return Math.abs(locationIdA - locationIdB);
  });
  const totalDistance = distances.reduce(
    (total, distance) => total + distance,
    0,
  );

  debug(`Done.`);
  answer(totalDistance);
};
