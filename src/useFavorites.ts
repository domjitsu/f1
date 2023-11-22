import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Favorite {
  raceName: string;
  lapNumber: string;
}

interface FavoritesState {
  favorites: Favorite[];
  addFavorite: (newFavorite: Favorite) => void;
  removeFavorite: (favorite: Favorite) => void;
}

export const useFavoritesStore = create(
  persist(
    (set) => ({
      favorites: [],
      addFavorite: (newFavorite: Favorite) =>
        set((state: FavoritesState) => {
          const isDuplicate = state.favorites.some(
            (fav) =>
              fav.raceName === newFavorite.raceName &&
              fav.lapNumber === newFavorite.lapNumber
          );

          if (!isDuplicate) {
            return { favorites: [...state.favorites, newFavorite] };
          }

          return state;
        }),
      removeFavorite: (favorite: Favorite) =>
        set((state: FavoritesState) => ({
          favorites: state.favorites.filter(
            (fav) =>
              !(
                fav.raceName === favorite.raceName &&
                fav.lapNumber === favorite.lapNumber
              )
          ),
        })),
    }),
    {
      name: "lap-favorites",
    }
  )
);
