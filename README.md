# APEX | System 🚀

A high-performance habit tracking application inspired by the "Solo Leveling" aesthetic, featuring a robust RPG progression system, deep analytics, and immersive UI/UX.

## 🌐 Live Demo
[APEX-habit-tracker](https://huzef-zo.github.io/APEX-habit-tracker)

## ✨ Core Features

### ⚔️ Quest System (Habit Tracking)
- **Daily Missions:** Initialize quests as Repeating, One-time, or Date Range tasks.
- **Ranked Difficulty:** Quests are categorized from **E-Rank (Easy)** to **A-Rank (Hard)**, providing scaled XP rewards.
- **Attribute Association:** Link quests to specific RPG attributes (STR, INT, AGI, VIT, SNS) to influence your player growth.

### 📈 RPG Progression System
- **Leveling:** Progress from Level 1 to 90 through a tiered linear XP curve.
- **Rank Advancement:** Advance your player rank: **E → D → C → B → A → S**.
- **Attribute Allocation:** Earn points on level-up to increase your stats. Features an **Overflow Pool** for maxed-out attributes.
- **Level Regression:** Missed daily quests can lead to level-downs and attribute point deductions, maintaining high stakes for consistency.

### 📜 Chronicles (Analytics)
- **Holographic Activity Trend:** A 30-day visual representation of your quest completion rate.
- **Dungeon Log (Heatmap):** A hex-grid activity map showing daily consistency and completion density.
- **Monthly Sync Rate:** Track your overall completion percentage for the current month.

### 🛡️ System & UI
- **Solo Leveling Aesthetic:** Deep void black base with electric blue and purple accents, scanlines, and particle effects.
- **System Guide:** In-app documentation explaining all mechanics and progression rules.

## 📜 System Rules & Mechanics

### 📈 Leveling & Attributes
- **Progression:** Level 1 to 90 with tiered XP requirements.
- **Attributes:** STR, INT, AGI, VIT, SNS.
- **Rewards:** +5 Attribute Points per level-up.
- **Caps:** Stats cap at 999; excess points go to an **Overflow Pool**.

### 🏆 Player Ranks
- **E-Rank:** Levels 1 - 10
- **D-Rank:** Levels 11 - 20
- **C-Rank:** Levels 21 - 35
- **B-Rank:** Levels 36 - 50
- **A-Rank:** Levels 51 - 70
- **S-Rank:** Levels 71 - 90

### ⚠️ Penalty System
- **Daily Check:** Missing quests results in XP loss.
- **Calculation:** 5% XP penalty for normal quests, 10% for **Mandatory** quests.
- **Cap:** Daily penalty is capped at 25% of current XP.
- **Vitality Bonus:** The VIT attribute reduces XP loss by up to 50%.
- **Critical State:** 3 consecutive days of missing mandatory quests triggers a state where all XP gains are halved.

### 🛡️ Other Systems
- **Audio Feedback:** Immersive sound effects for quest completion, leveling up, and system interactions.
- **PWA Ready:** Install APEX as a native app on mobile or desktop with offline support.
- **System Backup:** Securely export and import your player data and quest history as JSON files.

## 🛠️ Built With
- **Vanilla JavaScript** (Modern ES6+)
- **CSS3** (Custom Properties, Grids, Flexbox, Animations)
- **HTML5** (Canvas API, Web Audio API)
- **Service Workers** (PWA & Offline Capability)

---
*Consistency Compounds. Only those who keep moving forward will reach the S-Rank.*
