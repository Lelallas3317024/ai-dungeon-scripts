const modifier = (text) => {
  let output = onOutput_SAE(text);

  // 2) Define positive & negative cues
  const positive = /\bhug\b|\bkiss\b|\bthank you\b/i;
  const negative = /\battack\b|\binsult\b|\bbetray\b|\bkill\b/i;

  for (const name of Object.keys(state.relationships)) {
    const esc    = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameRx = new RegExp(`\\b${esc}\\b`, 'i');

    if (nameRx.test(output)) {
      if (positive.test(output)) state.relationships[name] += 5;
      if (negative.test(output)) state.relationships[name] -= 10;
      const sentenceMatch = output.match(
        new RegExp(`[^.]*\\b${esc}\\b[^.]*\\.`, 'i')
      );
      if (sentenceMatch) {
        if (!(name in state.memories)) state.memories[name] = [];
        state.memories[name].push(sentenceMatch[0].trim());
      }
    }
  }

  // Persist relationships & memories
  const relSC = storyCards.find(sc => sc.title === "Relationships");
  const memSC = storyCards.find(sc => sc.title === "Memories");
  relSC.entry = JSON.stringify(state.relationships);
  memSC.entry = JSON.stringify(state.memories);

  return { text: output };
  text = AutoCards("output", text);
  // Your other output modifier scripts go here (alternative)
  return {text};
};

modifier(text);