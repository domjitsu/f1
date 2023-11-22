import { useMemo, useCallback } from "react";
import { Card, Title, List, ListItem, Button, Text } from "@tremor/react";
import { Favorite } from "@/useFavorites";
import { useFavoritesStore } from "@/useFavorites";
import { Race } from "@/types";

export const Favorites: React.FC<{
  favorites: Favorite[];
  races: Race[];
  handleRenderFavorite: (raceName: string, lapNumber: string) => void;
}> = ({ favorites, races, handleRenderFavorite }) => {
  // @ts-expect-error
  const { removeFavorite } = useFavoritesStore();

  const handleRemoveFavorite = useCallback(
    (raceName: string, lapNumber: string) => {
      removeFavorite({ raceName, lapNumber });
    },
    [removeFavorite]
  );

  const mapRaceAndLapToName = useMemo(() => {
    return (round: string, lapNumber: string) => {
      const raceName =
        races.find((race) => race.round === round)?.raceName || "Unknown Race";
      const lapName = lapNumber === "0" ? "Fastest Lap" : "Lap " + lapNumber;
      return `${raceName} - ${lapName}`;
    };
  }, [races]);

  return (
    <Card className="mx-auto mb-5">
      <Title>Your Favorite Laps</Title>
      <List>
        {favorites.length === 0 && (
          <Text>You have no favorites, search for a lap and save</Text>
        )}
        {favorites.map((fav: Favorite) => (
          <ListItem key={fav.lapNumber}>
            <span
              onClick={() => handleRenderFavorite(fav.raceName, fav.lapNumber)}
              className="cursor-pointer hover:underline"
              aria-label="View lap detail"
            >
              {mapRaceAndLapToName(fav.raceName, fav.lapNumber)}
            </span>

            <Button
              onClick={() => handleRemoveFavorite(fav.raceName, fav.lapNumber)}
              aria-label="Remove favorite"
            >
              Remove
            </Button>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};
