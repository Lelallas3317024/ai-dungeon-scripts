# AI Dungeon Scripts

A collection of modifier scripts for AI Dungeon, including hidden-quest, world-event, and memory engines.

## Project Structure
ai-dungeon-scripts/
├── src/
│ ├── hidden-quest-library.js
│ ├── hidden-quest-context.js
│ ├── hidden-quest-input.js
│ ├── hidden-quest-output.js
│ ├── normal-library.js
│ ├── normal-context.js
│ ├── normal-input.js
│ └── normal-output.js
├── docs/ ← design notes, examples, diagrams
├── .gitignore
├── LICENSE
└── README.md
## Usage

1. Copy the eight `.js` files from `src/` into your AI Dungeon “mods” folder.  
2. Load files in this order:  
   - `hidden-quest-library.js`  
   - `hidden-quest-context.js`  
   - `hidden-quest-input.js`  
   - `hidden-quest-output.js`  
   - then the `normal-*.js` counterparts.  
3. Customize as needed (turn counts, story-card titles, etc.).

## Contributing

1. Fork the repo  
2. Create a branch: `git checkout -b feature/my-change`  
3. Commit, push, open a Pull Request  

## License

MIT © Lelallas3317024
