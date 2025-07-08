// Library Script

// Story Arc Engine Script by Yi1i1i

/* Credits: 
  LewdLeah - Idea for AI calling, debugging, testing, feedback
  Purplejump - Testing, feedback
*/

onLibrary_SAE();
function onLibrary_SAE(){
  // Update settingsSC at start of every hook
  createIfNoSettingsSC();
  retrieveSettingsFromSC();
  storeSettingsToSC();
  
  // Update ArcSC at the start of every hook
  createIfNoArcSC();
  retrieveArcFromSC();
  storeArcToSC();
  
     // ── RELATIONSHIPS CARD ──
  if (!storyCards.find(sc => sc.title === "Relationships")) {
    addStoryCard(
      "Relationships",
      "{}",  
      "JSON map of Name→Score for how much each character likes you."
    );
  }
  const relSC = storyCards.find(sc => sc.title === "Relationships");
  try {
    state.relationships = JSON.parse(relSC.entry);
  } catch {
    state.relationships = {};
  }

  // ── TRAITS CARD ──
  if (!storyCards.find(sc => sc.title === "Traits")) {
    addStoryCard(
      "Traits",
      "{}",  
      "JSON map of Name→[traits] for each character’s personality."
    );
  }
  const traitsSC = storyCards.find(sc => sc.title === "Traits");
  try {
    state.traits = JSON.parse(traitsSC.entry);
  } catch {
    state.traits = {};
  }

  // ── MEMORIES CARD ──
  if (!storyCards.find(sc => sc.title === "Memories")) {
    addStoryCard(
      "Memories",
      "{}",  
      "JSON map of Name→[recent sentences] for each character’s memories."
    );
  }
  const memSC = storyCards.find(sc => sc.title === "Memories");
  try {
    state.memories = JSON.parse(memSC.entry);
  } catch {
    state.memories = {};
  }

  // ── WORLD EVENTS CARD ──
  if (!storyCards.find(sc => sc.title === "World Events")) {
    addStoryCard(
      "World Events",
      JSON.stringify({ current: "Clear skies" }),
      "Tracks the current random world event (weather, war, festival, etc.)"
    );
  }
  const eventsSC = storyCards.find(sc => sc.title === "World Events");
  try {
    state.worldEvent = JSON.parse(eventsSC.entry).current;
  } catch {
    state.worldEvent = "Clear skies";
  }

  // ── HIDDEN QUESTS CARD ──
  if (!storyCards.find(sc => sc.title === "Hidden Quests")) {
    addStoryCard(
      "Hidden Quests",
      JSON.stringify([]),
      "List of active hidden quests unlocked by relationships"
    );
  }
  const questsSC = storyCards.find(sc => sc.title === "Hidden Quests");
  try {
    state.hiddenQuests = JSON.parse(questsSC.entry);
  } catch {
    state.hiddenQuests = [];
  }

  // ── TIME-TRACKER INIT ──
  // ensure manual override counter exists
  if (state.manualHours === undefined) {
    state.manualHours = 0;
  }
}

function onInput_SAE(text){
  text = helpCommandInput(text);

  text = detectRedoStoryArc(text);

  text = detectStopGenerating(text);

  return text;
}
  

function onInput_SAE(text){
  text = helpCommandInput(text);

  text = detectRedoStoryArc(text);

  text = detectStopGenerating(text);

  return text;
}

function onContext_SAE(text){
  text = removeAngleText(text);
  
  text = feedAIPrompt(text);

  text = feedStoryArc(text);
  
  text = logContextToSettingsSC(text);
  //log(text);
  
  return text;
}

function onOutput_SAE(text) {
  text = helpCommandOutput(text);

  text = saveStoryArc(text);
  //log("state.storyArc", state.storyArc);

  text = callAIForArc(text);

  //
  
  
  
  //log(text);

 turnCounter();
 //state.message = JSON.stringify({
 //   turnCount:    state.turnCount,
 //   nextArcCall:  state.unlockFeedAIPrompt,
 //   savingArc:    state.saveOutput,
 //   lastArc:      state.storyArc.slice(0,50) + "…"
 // }, null, 2);

  return text;
}

function helpCommandInput(text){
  if(text.includes("/help sae")){
    text = " ";

    state.commandCenter = 
    `
    << 
    - Story Arc Engine calls the AI to create a story arc in the Author's notes to better guide future storytelling.
    - Type "Story Arc" into story cards to access and modify settings. Logs are logged in the notes.
    - Input "/redo arc" to call the AI to regen the story arc. 
    - Text encased in << >> are auto cleared from context.
    - Repeated attempts for generating story arcs may be due to AI failing to fulfill instructions or low response length (< 125). troubleshoot by stopping and retrying in a few turns.
    >>
    `
  }

  return text;
}

function helpCommandOutput(text){
  if(state.commandCenter){
    text = state.commandCenter;
  }
  delete state.commandCenter
  return text;
}

// Prompt to be fed to AI context
state.arcPrompt = state.arcPrompt || [`
<<</SYSTEM>  
- Stop the story.  
- Only write a structured story arc outline for the future based on everything so far by following these strict instructions:  
- Write a numbered list of 11 major events within the story arc.  
- Each event must be under 7 words.  
- Events must be in chronological order.  
- Each event must build on the last and be further in the future.  
- Dont write clichés, dialogue, description, and prose.  
- Dont write the protagonist, main character, and player.  
- Use only brief, high-level story developments.  
- Events contain turning points, twists, discoveries, conflicts, motives, and lore.  
- Maintain immersion and consistent narrative tone. >>`
];

// Initialize variables
if(state.unlockFeedAIPrompt == undefined){
  state.unlockFeedAIPrompt = false;
}

if(state.saveOutput == undefined){
  state.saveOutput = false;
}

if(state.storyArc == undefined){
  state.storyArc = "";
}

if(state.attemptCounter == undefined){
  state.attemptCounter = 0;
}

state.turnsPerAICall = state.turnsPerAICall || 25;
//log("state.turnsPerAICall: " + state.turnsPerAICall);

// Increment turn counter at end of onOutput
function turnCounter(){
  if (state.turnCount == undefined) {
  state.turnCount = 0;
  }

  state.turnCount += 1;
  //log("state.turnCount: " + state.turnCount);
}

// Remove script texts to clean AI context
function removeAngleText(text) {
  return text.replace(/<<[\s\S]*?>>/g, '');
}

function createIfNoArcSC(){
  if (!storyCards.find(sc => sc.title === "Current Story Arc")) {
    // If sc doesn't exist, create it
    addStoryCard("Current Story Arc", "", "Current Story Arc");

    // Fetch the sc
    const arcSC = storyCards.find(sc => sc.title === "Current Story Arc");
    arcSC.keys = "/Current Story Arc"
    arcSC.description = "SPOILERS! This story card stores the story arc being fed to the AI to improve storytelling. Feel free to modify the contents.";
  }
}

function storeArcToSC(){
  // Fetch the sc
  const arcSC = storyCards.find(sc => sc.title === "Current Story Arc");

  arcSC.entry = state.storyArc;
}

function retrieveArcFromSC(){
  // Fetch the sc
  const arcSC = storyCards.find(sc => sc.title === "Current Story Arc");

  state.storyArc = arcSC.entry;
}

function createIfNoSettingsSC(){
  if (!storyCards.find(sc => sc.title === "Story Arc Settings")) {
    // If sc doesn't exist, create it
    addStoryCard("Story Arc Settings", "", "Story Arc Settings");

    // Fetch the sc
    const settingsSC = storyCards.find(sc => sc.title === "Story Arc Settings");
    settingsSC.description = `
    turnsPerAICall: Number of turns before calling AI to update the story arc. Takes in an integer.
    arcPrompt: Prompt that is fed to the AI to generate a story arc. Must be encased in << >>.
    `;
  }
}

function storeSettingsToSC(){
  // Fetch the sc
  const settingsSC = storyCards.find(sc => sc.title === "Story Arc Settings");

  settingsSC.entry = `turnsPerAICall = ${state.turnsPerAICall}\narcPrompt = ${state.arcPrompt}`
}

function retrieveSettingsFromSC(){
  // Fetch the sc
  const settingsSC = storyCards.find(sc => sc.title === "Story Arc Settings");

  // Extract turnsPerAICall
  const turnsMatch = settingsSC.entry.match(/turnsPerAICall\s*=\s*(\d+)/);
  if (turnsMatch) {
    state.turnsPerAICall = Number(turnsMatch[1]) ?? state.turnsPerAICall;
  }

  // Extract arcPrompt block
  const promptMatch = settingsSC.entry.match(/arcPrompt\s*=\s*(<<[\s\S]*?>>)/);
  if (promptMatch) {
    state.arcPrompt = promptMatch[1];
  }

}

// On output, waits for the correct turn to call AI for generating story arc
function callAIForArc(text){
  if (state.turnCount == 1 || state.turnCount % state.turnsPerAICall === 0) {
    // Warn player of AI call next turn
    text = text + "\n\n<< ⚠️ Updating Story Arc Next Turn! Click 'Continue' or type '/stop'. >>";

    // Unlock feed prompt to AI for onContext
    state.unlockFeedAIPrompt = true;
    //log("state.unlockFeedAIPrompt: " + state.unlockFeedAIPrompt);

    // Unlock save resulting output to save story arc for next onOutput
    state.saveOutput = true;
   // log("state.saveOutput: " + state.saveOutput);
  }

  return text;
}

// After AI is called, this function will feed the prompt onContext for AI to create a story arc
function feedAIPrompt(text){
  if(state.unlockFeedAIPrompt){
    text = text + " " + state.arcPrompt;

    // Turn off after done feeding
    state.unlockFeedAIPrompt = false;
  }

  return text;
}

// After AI call and prompt is fed to context, this function saves the generated story arc during the following output hook
function saveStoryArc(text){
  if(state.saveOutput){
    // Copy the generated story arc from the output text
    state.storyArc = text;

    // Clean story arc text to ensure no incomplete numbered lines
    //log("Before: ", state.storyArc);
    state.storyArc = state.storyArc.replace(/\n?\d+\.\s*$/, '');
    state.storyArc = state.storyArc
      .split('\n')
      .filter(line => /^\d+\.\s/.test(line.trim()))
      .join('\n');
    //log("After: ", state.storyArc);

    // Incorrect story arc formatting recalls AI
    if(!/[89]/.test(state.storyArc)){
      state.unlockFeedAIPrompt = true;
      state.saveOutput = true;

      state.attemptCounter += 1;

      text = `\n<< ⏳ Generating Story Arc (Attempt ${state.attemptCounter})... Click 'Continue' or type '/stop'. >>`;

    }
    // Correct story arc formatting gets saved
    else {
      state.attemptCounter = 0;

      state.storyArc = "Write the story in the following direction:\n" + state.storyArc;

      text = "\n<< ✅ Story Arc generated and saved! Click 'Continue'. >>\n\n";

      // Fetch the sc and log the previous arc in sc notes
      const arcSC = storyCards.find(sc => sc.title === "Current Story Arc");
      arcSC.description = `Log ${state.turnCount} | Previous Story Arc:\n${arcSC.entry}\n` + arcSC.description;

      // Save the new story arc to the sc
      storeArcToSC();

      // Turn off save output when done saving story arc
      state.saveOutput = false;

    }
  }

  return text;
}

// Feeds the Story Arc into the Author's Note in the AI context every turn
function feedStoryArc(text){
  // Ensure story arc is fed only when a new story arc is not being generated
  if(state.saveOutput == false){
    text = text.replace(
      /(\[Author's note: [\s\S]*?)(])/,
      (_, noteStart, noteEnd) => noteStart + "\n" + state.storyArc + noteEnd
    );
  }

  return text;
}

function detectRedoStoryArc(text){
  if(text.includes("/redo arc")){
    state.unlockFeedAIPrompt = true;
    state.saveOutput = true;

    text = "<< ➰ Regenerating Story Arc... >>"
  }

  return text;
}

// Function to allow player to stop story arc generating
function detectStopGenerating(text){
  if(text.includes("/stop") && state.unlockFeedAIPrompt == true){
    state.unlockFeedAIPrompt = false;
    state.saveOutput = false;

    state.attemptCounter = 0;

    text = "<< ⛔ Story Arc Generation Stopped. >>";
  }

  return text;
}

function logContextToSettingsSC(text){
  // Fetch the sc
  const settingsSC = storyCards.find(sc => sc.title === "Story Arc Settings");
  
  // Trim notes on char limit to prevent memory overfill
  if(settingsSC.description.length > 5000){
    halfIndex = Math.floor(settingsSC.description.length / 2);
    settingsSC.description = settingsSC.description.slice(0, halfIndex);

    console.log("Trimming description to prevent memory overload.");
  }

  // Log to setting sc notes
  settingsSC.description = `Context Log ${state.turnCount} | ${text}\n` + settingsSC.description;

  return text;
}


// Library Script: Character System for Civilians & Pet-Vamp in Night Huntress





