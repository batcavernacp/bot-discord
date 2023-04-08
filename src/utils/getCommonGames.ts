const parseString = require("xml2js").parseStringPromise;

const url = (id: string) =>
  `https://steamcommunity.com/profiles/${id}/games?tab=all&xml=1`;

const fetchGames = async (id: string) => {
  const res = await fetch(url(id));

  const json = await parseString(await res.text());

  const games = json.gamesList.games[0].game.map((game: any) => game.name[0]);
  const name = json.gamesList.steamID[0];

  return {
    games,
    name,
  };
};

export const getCommonGames = (ids: string[]): Promise<string[][]> => {
  return Promise.allSettled(ids.map(fetchGames)).then((results) => {
    const resultFulfilled = results.filter((t) => t.status == "fulfilled");

    const names = resultFulfilled.map((result: any) => result.value.name);

    const commonGames = resultFulfilled
      .filter((t) => t.status == "fulfilled")
      .reduce(
        (prev, result: any) =>
          prev.filter((item: any) => result.value.games.includes(item)),
        (results as any)[0].value.games
      );

    return [names, commonGames];
  });
};
