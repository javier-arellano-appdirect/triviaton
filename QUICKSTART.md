# Triviaton - Quick Start Guide

## Running the Game

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open two browser windows**:
   - **Admin/Host Control**: http://localhost:3000/admin
   - **Game Display (for players)**: http://localhost:3000/game

## Game Workflow

### Step 1: Admin Setup
On the **admin page** (http://localhost:3000/admin):
1. Enter player names (2-6 players)
2. Click "Confirm Players"

### Step 2: Category Selection
1. Use the "Filter by Type" dropdown to narrow down categories (optional)
2. Select exactly 6 categories by clicking on them
3. Click "Start Game" when 6 categories are selected

### Step 3: Board Reveal
- The game page will automatically show a beautiful animation revealing categories and values
- Wait ~9 seconds for the animation to complete
- The admin page will automatically advance to the game board

### Step 4: Playing Questions
1. **Host clicks a value** on the admin board to select a question
2. **Question displays** on both admin and game screens
3. If it's a Daily Double:
   - A 5-second "DAILY DOUBLE!" animation plays
   - Only one player answers
   - Value is doubled
4. **Host clicks "Reveal Answer"** when ready
5. **Host selects results**:
   - **Normal Question**: Select who got it right (optional) and who got it wrong
   - **Daily Double**: Select the player and whether they were correct/incorrect
6. Click "Submit Results"
7. **Scores update automatically** on the game display
8. Repeat until all questions are answered

### Step 5: Game Over
- When all questions are revealed, the game automatically ends
- The game screen shows:
  - Animated emoji rain
  - Scores revealed from lowest to highest
  - Winner highlighted with trophies

## Tips

- Keep the **admin page** open in one window (for the host)
- Display the **game page** on a TV or second monitor for players to see
- The game state syncs in real-time via Server-Sent Events
- You can refresh the game page at any time without losing state
- Sound effects are optional - add MP3 files to `public/sounds/` (see `public/sounds/README.md`)

## Adding Custom Questions

1. Create a new YAML file in the `questions/` folder
2. Follow this format:
   ```yaml
   name: "Your Category Name"
   types:
     - type1
     - type2
   questions:
     - question: "Your question?"
       answer: "Your answer"
       value: 200
     - question: "Another question?"
       answer: "Another answer"
       value: 400
     # Add at least 5 questions per category
   ```
3. Restart the dev server to load new questions

## Troubleshooting

- **Game page not updating**: Check browser console for SSE connection errors
- **Questions not loading**: Verify YAML files are correctly formatted
- **Build errors**: Run `npm run build` to check for TypeScript errors
- **Port already in use**: Stop other Next.js apps or use `npm run dev -- -p 3001` to use a different port

## Production Build

To build for production:
```bash
npm run build
npm start
```

---

Have fun playing Triviaton! 🎉
