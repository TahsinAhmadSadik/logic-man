# ⚡ LogicMan

> **A real-world TTL digital logic trainer board simulator built for students, by students.**

[![GitHub Repository](https://img.shields.io/badge/GitHub-logic--man-amber?logo=github)](https://github.com/TahsinAhmadSadik/logic-man)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<!-- Optional Demo Video -->

<!-- [![LogicMan Video Demo](https://img.shields.io/badge/YouTube-Watch%20Demo-red?logo=youtube)](YOUR_YOUTUBE_VIDEO_URL_HERE) -->

---

## Why LogicMan?

While general gate-level circuit simulators are widely available online, **few are specifically tailored to university-level Digital Logic Design (DLD) laboratory courses**.

Most existing tools represent circuits as abstract logic nodes rather than physical hardware. As a result, students often struggle when transitioning from theoretical gate diagrams to physical laboratory sessions involving actual **7400-series DIP IC chips, pin orientation notches, VCC/GND power rails, breadboards, and signal buses**.

**LogicMan bridges this gap by offering:**

* **An Authentic Trainer Board Experience**
  Virtual breadboards, physical DIP IC chips with pinout manuals, toggle data switches, and LED output indicators designed to resemble real university laboratory hardware.

* **Structured Practice Curriculum**
  Both **Design Challenges**, where students build circuits from scratch, and **Debugging Labs**, where students troubleshoot pre-wired faulty circuits.

* **Automated Real-Time Testing**
  An integrated auto-grader that cycles through all input states with live switch animations to validate circuits against expected truth tables.

* **Free Simulation & Truth Table Synthesis**
  A freeform sandbox that can simulate custom breadboard circuits and automatically generate their complete truth tables.

* **Open-Source Problem Authoring**
  A built-in **Problem Studio** that allows instructors and students to design, validate, and share custom problem sets without writing boilerplate code.

---

## Core Features

### Realistic Breadboard Engine

* Responsive SVG-based virtual breadboard.
* Wire **7400-series TTL IC chips**, data switches, power rails, and LED indicators.
* Smooth zoom and pan controls.
* Physical-style DIP IC pin layouts and orientation.
* Power rail and signal-bus visualization.

### Real-Time Circuit Solver

The multi-pass circuit solver evaluates combinational logic while detecting common hardware-level mistakes, including:

* Short circuits between `VCC` and `GND`.
* Logic contention caused by multiple gates driving the same node.
* Unconnected IC power pins.
* Floating TTL inputs.
* Incorrect or incomplete connections.
* Invalid power configurations.

### Dual Learning Modes

#### Design Mode

Build combinational logic circuits completely from scratch while following:

* Required input/output specifications.
* Allowed IC chip limits.
* Expected truth tables.
* Problem-specific constraints.

#### Debug Mode

Troubleshoot pre-wired circuits containing intentional faults such as:

* Signal clashes.
* Missing power connections.
* Incorrect pin connections.
* Broken or misplaced wires.
* Other hardware-level wiring errors.

### Free Simulation Sandbox

Experiment without problem constraints using an unrestricted canvas with access to:

* Basic logic gates.
* Adders.
* Decoders.
* Multiplexers.
* Priority encoders.
* Other supported digital logic components.

### Instant Truth Table Generator

The free-mode simulator can:

1. Detect connected switch inputs.
2. Detect connected LED outputs.
3. Generate all possible input combinations.
4. Simulate every `2^N` input state.
5. Automatically generate the complete truth table.

### Automated Truth Table Tester

The built-in auto-grader:

* Automatically cycles through input combinations.
* Animates switch changes.
* Monitors LED outputs.
* Compares the circuit against the expected truth table.
* Supports input and output **Don't-Care** conditions.
* Provides real-time validation feedback.

### Editorial & Solution Inspector

When students are stuck, they can access a verified reference solution with:

* Spoiler protection.
* Complete circuit layouts.
* Step-by-step solution information.
* Itemized changelogs for debugging problems.

### Touch-Friendly Eraser Mode

Delete wires and ICs easily on touchscreen devices using the **Eraser** toggle in the bottom toolbar.

### Live Diagnostics Console

Provides clear feedback for common circuit problems, including:

* Unpowered ICs.
* Floating inputs.
* Inputs unintentionally pulled HIGH.
* Power shorts.
* Signal contention.
* Invalid connections.

### Stopwatch & Exam Timer

Practice under realistic laboratory conditions with:

* Integrated stopwatch.
* Countdown timer.
* Timed practice sessions.

### Circuit Export & Import

Save and share complete breadboard layouts using `.json` files.

This makes it easy to:

* Back up progress.
* Share circuits with classmates.
* Create debugging problems.
* Reproduce circuit configurations.

### Visual Problem Studio

Create, validate, and export complete problem sets using a visual authoring interface.

Problem Studio supports:

* Problem metadata.
* Input/output definitions.
* IC limits.
* Hints.
* Expected truth tables.
* Pre-wired debugging circuits.
* Live JSON schema validation.
* Problem export.

---

## User Guide

### 1. Navigating Challenges

From the homepage, choose between:

* **Design Challenges**
* **Debugging Labs**

Problems can be searched and filtered by:

* Problem name.
* Problem ID.
* Difficulty.
* 7400-series IC tags.

---

### 2. Breadboard Controls

#### Zoom & Pan

* Use the mouse scroll wheel to zoom in and out.
* Click and drag empty canvas space to pan around the breadboard.

#### Wire Colors

Use the floating color palette at the bottom of the screen to organize your wiring.

Recommended conventions:

* 🔴 **Red** → `VCC`
* ⚫ **Black** → `GND`
* Other colors → Data and signal buses

#### Power Switch

Turn the **+5V power switch ON** to power the virtual board and test your circuit.

> ⚠️ When power is ON, circuit modifications are locked to prevent hot-plugging.

---

### 3. Deleting Wires & IC Chips

> ⚠️ **Power must be OFF before deleting or modifying circuit components.**

#### Desktop / Mouse

You can delete a wire or IC by:

* Right-clicking the component.
* Selecting it and pressing `Delete`.
* Selecting it and pressing `Backspace`.

#### Tablet / Touchscreen

Activate the **Eraser** toggle in the bottom ColorPicker toolbar and tap the component you want to remove.

---

### 4. Keyboard Shortcuts

| Shortcut            | Action                                            |
| ------------------- | ------------------------------------------------- |
| Mouse Drag          | Pan the canvas                                    |
| Mouse Wheel         | Zoom in / out                                     |
| Right-Click         | Delete wire/IC or cancel active routing/placement |
| `DEL` / `Backspace` | Delete selected wire or IC                        |
| `Ctrl + Z`          | Undo                                              |
| `Ctrl + Y`          | Redo                                              |
| `Ctrl + W`          | Remove all wires                                  |
| `Ctrl + R`          | Reset the problem                                 |
| Power Switch        | Toggle +5V system power                           |

---

## How to Contribute

LogicMan is open-source and built for student collaboration!

We welcome contributions ranging from:

* UI/UX improvements.
* Solver engine optimizations.
* Bug fixes.
* New circuit components.
* New problem sets.
* Debugging scenarios.
* Documentation improvements.

---

### 1. Authoring New Problems

You don't need to manually write JSON files.

Use the **Problem Studio** available at:

```text
/author
```

#### To create a new problem:

1. Open **Problem Studio** from the top navigation bar.
2. Enter the problem metadata.
3. Define input/output pin assignments.
4. Set IC limits.
5. Add hints.
6. Define the expected truth table.
7. Validate the problem.
8. Click **Copy JSON** or **Download `.json`**.

#### Creating Debugging Problems

For debugging problems:

1. Build the faulty circuit inside the simulator.
2. Click **Export**.
3. Download the circuit `.json` file.
4. Upload it as the **Initial Pre-wired Circuit** in Problem Studio.
5. Define the expected corrected behavior.
6. Export the final problem.

---

### 2. Submitting a Pull Request

#### Step 1 — Fork the Repository

Fork the LogicMan repository:

[https://github.com/TahsinAhmadSadik/logic-man](https://github.com/TahsinAhmadSadik/logic-man)

#### Step 2 — Add Your Problem

Add your problem file to:

```text
src/data/problems/prob_X.json
```

Then register it in:

```text
src/data/problems/index.js
```

#### Step 3 — Add the Reference Solution

Add the corresponding solution file to:

```text
src/data/solutions/prob_X.json
```

Then register it in:

```text
src/data/solutions/index.js
```

#### Step 4 — Create a Pull Request

Create a feature branch, commit your changes, push the branch, and open a **Pull Request** on GitHub.

---

### 3. Reporting Issues & Bugs

Found a bug, incorrect circuit behavior, false-positive short-circuit detection, or incorrect problem specification?

Please report it through the GitHub Issues page:

[https://github.com/TahsinAhmadSadik/logic-man/issues/new](https://github.com/TahsinAhmadSadik/logic-man/issues/new)

When reporting an issue, please include:

* A clear description of the problem.
* Steps to reproduce it.
* Expected behavior.
* Actual behavior.
* Screenshots or exported circuit files when applicable.

---

## Local Development Setup

### Prerequisites

Make sure you have **Node.js** and **npm** installed.

### Clone the Repository

```bash
git clone https://github.com/TahsinAhmadSadik/logic-man.git
cd logic-man
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev -- --host 127.0.0.1
```

The application will be available at:

```text
http://127.0.0.1:5173
```

---

## Built With

| Technology          | Purpose                           |
| ------------------- | --------------------------------- |
| **React 18**        | Frontend framework                |
| **Vite**            | Development server and build tool |
| **Zustand**         | State management                  |
| **Tailwind CSS**    | Styling                           |
| **Lucide React**    | Icons                             |
| **React Router v6** | Client-side routing               |

---

## Project Structure

A simplified overview of the important project directories:

```text
logic-man/
├── src/
│   ├── data/
│   │   ├── problems/
│   │   └── solutions/
│   ├── ...
│   └── ...
├── package.json
└── README.md
```

Problem definitions and their corresponding reference solutions are stored separately to make problem authoring and contribution easier.

---

## Contributors & Leadership

### Project Lead & Core Architect

**Tahsin Ahmad**

* Engine Architecture
* Combinational Logic Solver
* Automated Grader
* UI/UX System

### Project Contributors

Special thanks to all the students who authored problem sets, tested edge cases, contributed feedback, and helped refine the laboratory specifications:

* Abdur Rahman Rounak
* Ali Tahmid Chowdhury
* Al Nahian Alif
* Jarin Subah
* Jeneya Islam
* Nazmul Hasan Rafi
* Rahat Mohashin Zarif
* Raiyan Kazi
* Sadia Jahan Ritaz
* Sifat Al Islam
* Siratul Mustakim Arman
* Tabassum Binte Kamal
* Tanzimul Hasan Tahsin
* Tasnia Mehzabin Mysha

---

## License

LogicMan is open-source software released under the **MIT License**.

See the [`LICENSE`](LICENSE) file for more information.

---

## Support the Project

If you find **LogicMan** useful for learning Digital Logic Design, consider:

* ⭐ Starring the repository.
* 🐛 Reporting bugs.
* 💡 Suggesting new features.
* 🧩 Contributing new problems.
* 🔧 Improving the simulator.
* 📢 Sharing LogicMan with other students.

**Built by students, for students — one logic gate at a time. ⚡**