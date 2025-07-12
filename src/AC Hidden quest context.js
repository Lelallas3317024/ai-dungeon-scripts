// context.txt

// Checkout the Guidebook examples to get an idea of other ways you can use scripting
// https://help.aidungeon.com/scripting

// Every script needs a modifier function
const modifier = (text) => {
  // Ensure defaults to prevent crashes
  state.relationships ??= {};
  state.traits ??= {};
  state.memories ??= {};

  // 0) TURN-1: Detect and set initial in-game time
  if (!state.startDate && state.turnCount === 1) {
    const time24 = text.match(/\b([01]?\d|2[0-3]):[0-5]\d\b/);
    const time12 = text.match(/\b(1[0-2]|[1-9])\s*(am|pm)\b/i);
    const kw     = text.toLowerCase();
    let hour = null;
    if (time24) {
      hour = parseInt(time24[1], 10);
    } else if (time12) {
      const h = parseInt(time12[1], 10) % 12;
      hour = h + (time12[2].toLowerCase() === "pm" ? 12 : 0);
    } else if (kw.includes("dawn"))      hour = 6;
    else if (kw.includes("morning"))     hour = 9;
    else if (kw.includes("noon"))        hour = 12;
    else if (kw.includes("afternoon"))   hour = 15;
    else if (kw.includes("dusk"))        hour = 18;
    else if (kw.includes("evening"))     hour = 19;
    else if (kw.includes("night"))       hour = 22;
    else if (kw.includes("midnight"))    hour = 0;
    if (hour === null) hour = 8;

    try {
      const today = new Date();
      const iso = isNaN(today.getTime()) ? "2024-01-01" : today.toISOString().slice(0,10);
      state.startDate = `${iso}T${String(hour).padStart(2,'0')}:00:00`;
    } catch {
      state.startDate = `2024-01-01T${String(hour).padStart(2,'0')}:00:00`;
    }
  }

  // 1) run SAE context hook with fallback if undefined or erroring
  let ctx;
  try {
    ctx = typeof onContext_SAE === "function" ? onContext_SAE(text) : text;
  } catch (err) {
    ctx = text;
  }

  // 2) compute world time: 1 hour per 25 turns + manual override
  try {
    const start = new Date(state.startDate);
    if (isNaN(start.getTime())) throw new Error("Invalid startDate");
    const autoHours = Math.floor(state.turnCount / 25);
    const manual = state.manualHours || 0;
    start.setHours(start.getHours() + autoHours + manual);
    const currentDate = start.toISOString().slice(0, 16).replace("T", " ");
    const timeNote = `-- Current In-Game Time: ${currentDate} --\n\n`;

    // 3) build Character Profiles note
    let profileNote = "-- Character Profiles --\n";
    for (const name of Object.keys(state.relationships)) {
      const traits = state.traits[name] || ["none"];
      const score = state.relationships[name];
      const mood = score > 20 ? "friendly"
                 : score < -20 ? "hostile"
                 : "neutral";
      const recentMems = (state.memories[name] || []).slice(-3);
      const recent = recentMems.length ? recentMems.join(" | ") : "no memories";
      profileNote += `${name}: [traits: ${traits.join(", ")}] `
                  + `[mood: ${mood} (${score})] `
                  + `[recent: ${recent}]\n`;
    }
    profileNote += "\n";

    // 4) build World Event note
    const eventNote = `<< World Event: ${state.worldEvent || "Clear skies"} >>\n\n`;

    // 5) prepend time, profiles, event, then return
    return { text: timeNote + profileNote + eventNote + ctx };

  } catch (err) {
    return { text: ctx };
  }
    [text, stop] = AutoCards("context", text, stop);
  // Your other context modifier scripts go here (alternative)
  return {text, stop};
};

// AiDungeon calls this under the hood:
modifier(text);
