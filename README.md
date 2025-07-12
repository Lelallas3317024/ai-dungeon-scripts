## Introduction

This repository provides a set of reusable scripts for AI Dungeon that you can plug into any scenario to automatically generate hidden quests, world events, and maintain character memories.

- **Hidden-Quest**: Unlock side-story quests based on in-game triggers.
- **World-Event**: Inject global events that affect all players.
- **Memory Engine**: Track NPC relationships and memories across turns.


## Features

- **Modular**: Choose only the scripts you need.
- **Extensible**: Easily add new cues, events, or memory rules.
- **JSON-Compatible**: Scripts output structured data for advanced integrations.


## Project Files

Branches:

- **main**: Primary branch for legacy scripts and documentation.

- **add-new-scripts**: Stable branch providing updated files containing Auto Cards by Lewd Leah.

## Project Structure

├── src/

│ ├── hidden-quest-library.js

│ ├── hidden-quest-context.js

│ ├── hidden-quest-input.js

│ ├── hidden-quest-output.js

│ ├── normal-library.js

│ ├── normal-context.js

│ ├── normal-input.js

│ └── normal-output.js

├── src/add-new-scripts

│ | ├──  AC hidden-quest-library.js

| │ ├──  AC hidden-quest-context.js

| │ ├──  AC hidden-quest-input.js

| │ ├──  AC hidden-quest-output.js

| │ ├──  AC normal-library.js

| │ ├──  AC normal-context.js

| │ ├──  AC normal-input.js

| │ └──  AC normal-output.js

├── .gitignore

├── LICENSE

└── README.md

## Usage

Pick **one** of the four script-sets below:

### A) Hidden-Quest Mode
|---  Time management, hidden quests, random world events, relationships with characters ---|

Copy into your AI Dungeon Scripting:

hidden-quest-library.js

hidden-quest-context.js

hidden-quest-input.js

hidden-quest-output.js

###OR

### B) Normal Mode
|---  Time management and relationships with characters ---|

Copy into your AI Dungeon Scripting:

normal-library.js  
normal-context.js  
normal-input.js  
normal-output.js  

###OR

### C) Auto Card Hidden-Quest Mode
|---  Time management, hidden quests, random world events, relationships with characters, story card auto update ---|

Copy into your AI Dungeon Scripting:

AC hidden-quest-library.js

AC hidden-quest-context.js

AC hidden-quest-input.js

AC hidden-quest-output.js

###OR

### D) Auto Card Normal Mode
|---  Time management and relationships with characters, story card auto update ---|

Copy into your AI Dungeon Scripting:

AC normal-library.js  
AC normal-context.js  
AC normal-input.js  
AC normal-output.js  

1. Fork the repo  
2. Create a branch: `git checkout -b feature/my-change`  
3. Commit, push, open a Pull Request  

## License

MIT © Lelallas3317024
