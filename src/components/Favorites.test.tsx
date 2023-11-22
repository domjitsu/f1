import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Favorites } from "./Favorites";
import { Favorite, useFavoritesStore } from "@/useFavorites";

jest.mock("../useFavorites", () => ({
  useFavoritesStore: jest.fn(),
}));

const mockFavorites: Favorite[] = [
  { raceName: "1", lapNumber: "0" },
  { raceName: "2", lapNumber: "3" },
];

const mockRaces = [
  { round: "1", raceName: "Australian Grand Prix" },
  { round: "2", raceName: "Bahrain Grand Prix" },
];

const handleRenderFavorite = jest.fn();
const removeFavorite = jest.fn();

beforeEach(() => {
  (
    useFavoritesStore as jest.MockedFunction<typeof useFavoritesStore>
  ).mockReturnValue({ removeFavorite });
  jest.clearAllMocks();
});

it("renders favorites correctly", () => {
  render(
    <Favorites
      favorites={mockFavorites}
      races={mockRaces}
      handleRenderFavorite={handleRenderFavorite}
    />
  );
  expect(
    screen.getByText("Australian Grand Prix - Fastest Lap")
  ).toBeInTheDocument();
  expect(screen.getByText("Bahrain Grand Prix - Lap 3")).toBeInTheDocument();
});

it("displays message when there are no favorites", () => {
  render(
    <Favorites
      favorites={[]}
      races={mockRaces}
      handleRenderFavorite={handleRenderFavorite}
    />
  );
  expect(
    screen.getByText("You have no favorites, search for a lap and save")
  ).toBeInTheDocument();
});

it("handles removing a favorite", () => {
  render(
    <Favorites
      favorites={mockFavorites}
      races={mockRaces}
      handleRenderFavorite={handleRenderFavorite}
    />
  );
  const removeButtons = screen.getAllByText("Remove");
  fireEvent.click(removeButtons[0]);
  expect(removeFavorite).toHaveBeenCalledWith({
    raceName: "1",
    lapNumber: "0",
  });
});

it("handles viewing a favorite", () => {
  render(
    <Favorites
      favorites={mockFavorites}
      races={mockRaces}
      handleRenderFavorite={handleRenderFavorite}
    />
  );
  const firstFavorite = screen.getByText("Australian Grand Prix - Fastest Lap");
  fireEvent.click(firstFavorite);
  expect(handleRenderFavorite).toHaveBeenCalledWith("1", "0");
});
