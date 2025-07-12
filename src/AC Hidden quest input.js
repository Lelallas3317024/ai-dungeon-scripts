// input.txt

// Checkout the Guidebook examples to get an idea of other ways you can use scripting
// https://help.aidungeon.com/scripting

const modifier = (text) => {
  // 1) let the SAE input-hook run first
  const input = onInput_SAE(text);

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
      // a) Relationships
      if (!(name in state.relationships)) state.relationships[name] = 0;
      state.relationships[name] += delta;
      const relSC = storyCards.find(sc => sc.title === "Relationships");
      relSC.entry = JSON.stringify(state.relationships);
      // b) Memories
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

  // 5) `/world` to show current world event
  if (/^\/world$/i.test(input)) {
    state.commandCenter = `Current world event: ${state.worldEvent}`;
    return { text: " " };
  }

  // 6) `/quests` to show hidden quests
  if (/^\/quests$/i.test(input)) {
    const quests = state.hiddenQuests.length
                 ? state.hiddenQuests.map(q => `- Aid ${q}`).join("\n")
                 : "No hidden quests unlocked yet.";
    state.commandCenter = quests;
    return { text: " " };
  }

  // 7) finally, return the text object AiDungeon expects
  return { text: input };
    text = AutoCards("input", text);
  // Your other input modifier scripts go here (alternative)
  return {text};
};

// AiDungeon will call this under the hood:
modifier(text);
