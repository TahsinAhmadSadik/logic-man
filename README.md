# ⚡ LogicMan

> **A real-world TTL digital logic trainer board simulator built for students, by students.**

[![GitHub Repository](https://img.shields.io/badge/GitHub-logic--man-amber?logo=github)](https://github.com/TahsinAhmadSadik/logic-man)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Why LogicMan?

While there are many general circuit simulators available online, **none of them are tailored specifically for university-level Digital Logic Design laboratory courses**. 

Most existing tools present abstract logic gate nodes rather than real hardware. Students often struggle when transitioning from theoretical gate diagrams to physical lab sessions involving actual IC chips, pinouts, VCC/GND rails, and breadboards.

**LogicMan bridges this gap by offering:**
* **An Authentic Trainer Board Experience:** Virtual breadboards, physical 7400-series IC DIP chips, data switches, and LED displays matching real university lab hardware.
* **Built-in Problem Sets:** A structured curriculum featuring both **Design** and **Debugging** challenges.
* **Automated Real-Time Testing:** An integrated auto-grader that validates student circuits line-by-line against truth tables.
* **Open-Source Authoring:** An intuitive Problem Studio allowing students and instructors to author and share custom problem sets.

---

## Major Features

- **Realistic Vector Breadboard Engine:** Wire 7400-series TTL IC chips, data switches, power rails, and LED indicators on an interactive SVG canvas with zoom and pan controls.
- **Real-Time Multi-Pass Circuit Solver:** Evaluates combinational logic, detects short circuits ($V_{CC}$ to $GND$), pin contention, and unpowered IC floating signals.
- **Dual Learning Modes:**
  - **Design Mode:** Build combinational logic circuits from scratch using basic and complex 7400-series chips.
  - **Debug Mode:** Inspect pre-wired faulty circuits with floating pins, incorrect wiring, or power drops and fix them.
- **Free Simulation Sandbox:** An unconstrained playground with access to all combinational IC chips for freeform circuit experimentation.
- **Automated Truth Table Tester:** Animates switch toggling line-by-line in real time to verify circuit behavior against problem specifications.
-  **Timer & Stopwatch Engine:** Integrated stopwatch and countdown alarm for timed lab practice and speed runs.
- **Circuit Export & Import:** Save your complete breadboard state to a `.json` file to backup progress or share with peers.
- **Local Progress Tracking:** Automatically saves solved challenge statuses locally in your browser.
- **Visual Problem Studio:** Build, configure, and export complete problem sets and debugging scenarios with custom schema validation.

---

## How to Use LogicMan

### 1. Navigating Challenges (Design vs. Debug)
- Toggle between **Design Challenges** (building from scratch) and **Debugging Labs** (fixing pre-wired boards) on the homepage hero toggle.
- Search problems by name, numeric ID, or filter by difficulty and 7400-series IC tags.

### 2. The Breadboard Canvas
- **IC Library:** Open the IC Library from the top navbar to select and place 7400-series ICs onto the board.
- **Wiring:** Click any breadboard hole to start a wire, choose a wire color from the bottom floating palette, and click the target hole to connect.
- **Power Switch:** Click the **Power Button** to turn on the trainer board. When power is ON, circuit wiring is locked, and real-time logic evaluation takes effect.

### 3. Auto-Tester & Truth Table
- Open the **Lab Spec** panel from the top navbar.
- Switch to the **Truth Table** tab and click **Run Tester**.
- Watch the switches toggle and LEDs light up in real time as the auto-grader evaluates each row line-by-line. Successfully completing a problem marks it as **Solved** locally.

### 4. Timed Practice
- Open the **Stopwatch / Timer** panel to track your solving speed or set a countdown alarm for exam practice.

### 5. Circuit Export & Import
- Use the **Export** button in the simulator navbar to download your breadboard layout as a `.json` file.
- Use **Import** to load saved circuit files or inspect files sent by classmates.

### 6. Keyboard Shortcuts & Gestures
| Shortcut | Action |
| :--- | :--- |
| **Right-Click** | Cancel active wire routing or IC placement |
| **DEL / Backspace** | Delete currently selected wire or IC chip |
| **Ctrl + Q** | Reset all wire connections |
| **Ctrl + R** | Reset the whole circuit |
| **Ctrl + Z** | Undo last wire or IC placement |
| **Ctrl + Y** | Redo last action |
| **Mouse Wheel** | Zoom canvas in / out |
| **Drag Canvas** | Pan around the trainer board |

---

## How to Contribute

LogicMan is open-source and built for student collaboration! We welcome contributions ranging from UI improvements and solver engine optimizations to new problem set submissions.

### 1. Authoring New Problems (Problem Studio)
You don't need deep coding experience to add new challenges:
1. Open the **Problem Studio** (`/author`) on the live app or locally.
2. Fill out problem metadata, I/O pin assignments, IC limits, and truth table expectations.
3. **Adding Debug Problems:** To create a pre-wired debugging challenge, build the faulty circuit in the simulator, click **Export**, and upload the `.json` file directly inside Problem Studio under *Initial Pre-wired Circuit*.
4. Click **Copy Problem JSON** at the top right.
5. Save the generated JSON inside `src/data/problems/prob_X.json` and register it in `src/data/problems/index.js`.

### 2. Submitting Pull Requests
1. Fork the repository: `https://github.com/TahsinAhmadSadik/logic-man`
2. Create a feature branch: `git checkout -b feature/new-problem-set`
3. Commit your changes: `git commit -m "feat: add 74138 decoder problem set"`
4. Push to your branch and open a **Pull Request** on GitHub!

---

## Local Development Setup

Clone the repository and run the development server locally:

```bash
# Clone repository
git clone [https://github.com/TahsinAhmadSadik/logic-man.git](https://github.com/TahsinAhmadSadik/logic-man.git)

# Navigate to project directory
cd logic-man

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open http://localhost:5173 in your browser.

## Built With
 * Framework: React 18 + Vite
 * State Management: Zustand
 * Styling: Tailwind CSS
 * Icons: Lucide React
 * Routing: React Router v6
## Contributors & Leadership
 * Project Lead & Core Architect: Tahsin Ahmad
 * Special Thanks: Check out our Contributors Page to see all the students who helped author problem sets, test edge cases, and refine the lab specs!
<p center>Made with ❤️ for Computer Science & Engineering Students.</p>

