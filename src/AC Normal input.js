// Your "Input" tab should look like this
const modifier = (text) => {
  // Your other input modifier s  const input = onInput_SAE(text);

  //ipts go here (preferred)
  text = AutoCards("input", text);
  const input = onInput_SAE(text);
  // ── Manual time-advance command (/advance X hours)
   // ── Manual time-advance command (/advance X hours)
  const adv = input.match(/^\/advance\s+(\d+)\s*hours?/i);
  if (adv) {
    const h = parseInt(adv[1], 10);
    state.manualHours = (state.manualHours || 0) + h;
    return { text: `<< Time advanced by ${h} hour${h !== 1 ? "s" : ""}. >>` };
  }

  // 2) Universal action → score changes + memories
  const actionMap = [
    { pattern: /\bcompliment\s+([A-Za-z ]+)\b/i, delta: +10, note: "You complimented %CHAR%." },
    { pattern: /\bhelp\s+([A-Za-z ]+)\b/i,       delta: +15, note: "You helped %CHAR%." },
    { pattern: /\battack\s+([A-Za-z ]+)\b/i,     delta: -20, note: "You attacked %CHAR%!" },
    { pattern: /\binsult\s+([A-Za-z ]+)\b/i,     delta: -15, note: "You insulted %CHAR%." },
  ];

  for (const { pattern, delta, note } of actionMap) {
    const m = input.match(pattern);
    if (m) {
      const name = m[1].trim();
      if (!(name in state.relationships)) state.relationships[name] = 0;
      state.relationships[name] += delta;
      const relSC = storyCards.find(sc => sc.title === "Relationships");
      relSC.entry = JSON.stringify(state.relationships);
      if (!(name in state.memories)) state.memories[name] = [];
      state.memories[name].push(note.replace("%CHAR%", name));
      const memSC = storyCards.find(sc => sc.title === "Memories");
      memSC.entry = JSON.stringify(state.memories);
    }
  }

  // 3) “Give gift” creates a memory but doesn’t affect the score
  const giftMatch = input.match(/\bgive\s+([A-Za-z ]+)\s+a\s+([A-Za-z ]+)\b/i);
  if (giftMatch) {
    const [, name, gift] = giftMatch;
    if (!(name in state.memories)) state.memories[name] = [];
    state.memories[name].push(`Received a gift: a ${gift}.`);
    const memSC = storyCards.find(sc => sc.title === "Memories");
    memSC.entry = JSON.stringify(state.memories);
  }

  // 4) `/memories Name` to display that character’s memory log
  const memQuery = input.match(/^\/memories\s+(.+)$/i);
  if (memQuery) {
    const name = memQuery[1].trim();
    const mems = state.memories[name] || ["No memories recorded."];
    state.commandCenter = mems.join("\n");
    return { text: " " };
  }

  // 5) finally, return the text object AiDungeon expects
  return { text: input };
  //crYour other input modifier scripts go here (alternative)
  return {text};
  
};
modifier(text);
