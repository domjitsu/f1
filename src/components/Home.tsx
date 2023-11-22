"use client";

import React, { useCallback, useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { StarIcon } from "@heroicons/react/24/outline";
import { Button, Title, Select, SelectItem } from "@tremor/react";
import { TremorChart } from "@/components/TremorChart";
import { TremorTable } from "@/components/TremorTable";
import { useFavoritesStore } from "@/useFavorites";
import { Race, RaceData, RaceResult, Driver } from "@/types";
import { Favorites } from "./Favorites";
import { convertLapTimeToSeconds } from "@/utils/convertLapTimeToSeconds";
import { fetcher } from "@/utils/fetcher";
import Image from "next/image";

const BASE_URL = "https://ergast.com/api/f1";
const CURRENT_RACES = "/current.json";

export function Home() {
  // @ts-expect-error
  const { favorites, addFavorite } = useFavoritesStore();

  const [theme, setTheme] = useState("dark");
  const [race, setRace] = useState<string>("");
  const [selectedLap, setSelectedLap] = useState<string>("0");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const { data, error } = useSWR<RaceData>(BASE_URL + CURRENT_RACES, fetcher);

  const { data: raceData, error: raceDataError } = useSWR<RaceResult>(
    race ? `${BASE_URL}/2023/${race}/results.json` : null,
    fetcher
  );

  const { data: lapData, error: lapDataError } = useSWR<RaceResult>(
    selectedLap !== "0"
      ? `${BASE_URL}/2023/${race}/laps/${selectedLap}.json`
      : null,
    fetcher
  );

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleChange = useCallback((event: string) => {
    setRace(event);
    setSelectedLap("0");
  }, []);

  const handleLapChange = useCallback((event: string) => {
    setSelectedLap(event);
  }, []);

  const handleSaveFavorite = useCallback(
    (raceName: string, lapNumber = "0") => {
      addFavorite({ raceName, lapNumber });
    },
    [addFavorite]
  );

  const handleRenderFavorite = (raceName: string, lapNumber: string) => {
    setRace(raceName);
    setSelectedLap(lapNumber);
  };

  const races = data?.MRData.RaceTable.Races;
  const raceHasCompleted = raceData?.MRData.RaceTable.Races[0];
  const numberOfLaps = useMemo(() => {
    return raceData && raceHasCompleted
      ? Number(raceData?.MRData.RaceTable.Races[0].Results[0].laps)
      : undefined;
  }, [raceData, raceHasCompleted]);

  const selectedRace = useMemo(() => {
    return raceData && raceHasCompleted
      ? raceData?.MRData.RaceTable.Races[0].Results.filter(
          (d: Driver) => d.FastestLap?.Time?.time
        ).map((driver) => ({
          givenName: driver.Driver.givenName,
          familyName: driver.Driver.familyName,
          driverId: driver.Driver.driverId,
          code: driver.Driver.code,
          "Lap Time": convertLapTimeToSeconds(
            driver.FastestLap?.Time?.time || "0"
          ),
        }))
      : undefined;
  }, [raceData, raceHasCompleted]);

  const lapTimings = useMemo(() => {
    return lapData?.MRData.RaceTable.Races[0].Laps[0].Timings;
  }, [lapData]);

  if (error || raceDataError || lapDataError || !races)
    return <p>Error loading data. Please try again.</p>;
  if (!data) return <p>Loading race data...</p>;

  selectedRace?.forEach((lap) => {
    const result = lapTimings?.find(
      (result) => result.driverId === lap.driverId
    );
    if (result) {
      lap["Lap Time"] = convertLapTimeToSeconds(result.time || "0");
    }
  });

  const showDetails = selectedRace && race;
  const showNoRaceData = raceData && !raceHasCompleted;

  const backgroundClass = theme === "dark" ? "bg-slate-950" : "bg-white";

  return (
    <main
      className={`flex min-h-screen flex-col items-center ${backgroundClass} ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      <div className="container mx-auto px-5 pb-8">
        <div className="pb-6 pt-3 text-right">
          <Button onClick={toggleTheme} variant="secondary">
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
        </div>

        <div className="flex justify-center mb-10 ">
          <Image
            src="/logo.png"
            width={300}
            height={100}
            alt="Formula 1 Logo"
            className="text-center"
          />
        </div>
        <Favorites
          favorites={favorites}
          races={races}
          handleRenderFavorite={handleRenderFavorite}
        />

        <Title>Select Race</Title>
        <Select
          className="text-black mb-5 mt-1"
          value={race}
          onValueChange={handleChange}
          enableClear={false}
          aria-label="Select a race"
        >
          {races.map((race: Race) => (
            <SelectItem key={race.round} value={race.round}>
              {race.raceName}
            </SelectItem>
          ))}
        </Select>

        {showNoRaceData && <div>No data yet for this race</div>}

        {numberOfLaps && (
          <>
            <Title>Select Lap</Title>
            <Select
              className="text-black mb-5 mt-1"
              value={selectedLap}
              onValueChange={handleLapChange}
              enableClear={false}
              aria-label="Select a lap"
            >
              <SelectItem key="0" value="0">
                Fastest Lap
              </SelectItem>
              {Array.from({ length: numberOfLaps }, (_, i) => i + 1).map(
                (lapNumber) => (
                  <SelectItem key={lapNumber} value={lapNumber.toString()}>
                    {lapNumber}
                  </SelectItem>
                )
              )}
            </Select>
            <div className="text-center">
              <Button
                onClick={() => handleSaveFavorite(race, selectedLap)}
                icon={StarIcon}
              >
                Save this lap to Favorites
              </Button>
            </div>
          </>
        )}

        {showDetails && (
          <div>
            <TremorChart data={selectedRace} />
            <TremorTable data={selectedRace} />
          </div>
        )}
      </div>
    </main>
  );
}
