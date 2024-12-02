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
  const similarityScores = locationIdsGroupA.map((locationIdA, index) => {
    const appearanceCount = locationIdsGroupB.reduce(
      (count, locationIdB) => locationIdA === locationIdB ? count + 1 : count,
      0,
    );
    const similarityScore = locationIdA * appearanceCount;
    return similarityScore;
  });
  const totalSimilarityScores = similarityScores.reduce(
    (total, similarityScore) => total + similarityScore,
    0,
  );

  debug(`Done.`);
  answer(totalSimilarityScores);
};
