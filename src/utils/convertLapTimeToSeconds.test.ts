import { convertLapTimeToSeconds } from "./convertLapTimeToSeconds"; // replace with your actual file name

describe("convertLapTimeToSeconds", () => {
  it("converts a valid lap time to seconds correctly", () => {
    expect(convertLapTimeToSeconds("00:30")).toBe(30);
    expect(convertLapTimeToSeconds("02:15")).toBe(135);
    expect(convertLapTimeToSeconds("1:02")).toBe(62);
  });

  it("handles a lap time with fractional seconds correctly", () => {
    expect(convertLapTimeToSeconds("1:20.123")).toBeCloseTo(80.123, 3);
  });

  it("returns 0 for empty string", () => {
    expect(convertLapTimeToSeconds("")).toBe(0);
  });

  it("handles invalid lap time formats", () => {
    expect(convertLapTimeToSeconds("invalid")).toBeNaN();
    expect(convertLapTimeToSeconds("123")).toBeNaN();
  });
});
