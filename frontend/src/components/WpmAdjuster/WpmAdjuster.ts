// Handles keyboard events for adjusting words per minute (WPM).
export const wpmAdjuster = (
  event: KeyboardEvent,
  curr_wpm: number,
  setWpm: React.Dispatch<React.SetStateAction<number>>,
): void => {
  if (event.code === "ArrowUp") {
    console.log("ArrowUp");
    const new_wpm = curr_wpm + 10;
    setWpm(new_wpm);
    console.log(new_wpm);
  }
  if (event.code === "ArrowDown") {
    console.log("ArrowDown");
    const new_wpm = Math.max(curr_wpm - 10, 1);
    setWpm(new_wpm);
    console.log(new_wpm);
  }
};
