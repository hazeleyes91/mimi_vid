# Diagnostics & Test Report

## Anomaly Entry 1: Build Failure TS1382 [RESOLVED]

### Observed Failure / Stack Trace
```text
src/components/Terminal2.tsx(304,57): error TS1382: Unexpected token. Did you mean '{'>'}` or `&gt;`?
```

### Suspected Root Cause
In `src/components/Terminal2.tsx` line 304, an unescaped raw `>` character was used inside a JSX text node (`... -> ACCELERATING`), violating JSX grammar rules.

### Applied Fix
Encapsulated the telemetry text within a JSX template string literal expression.

---

## Anomaly Entry 2: TypeScript Unused Locals TS6133 [RESOLVED]

### Observed Failure / Stack Trace
```text
src/components/Terminal2.tsx(21,10): error TS6133: 'isTypingDone' is declared but its value is never read.
src/components/Terminal3.tsx(1,38): error TS6133: 'useRef' is declared but its value is never read.
```

### Suspected Root Cause
`tsconfig.json` has `noUnusedLocals: true` and `noUnusedParameters: true` enabled. `isTypingDone` in `Terminal2.tsx` and `useRef` in `Terminal3.tsx` were unreferenced.

### Applied Fix
Removed unused `useRef` import from `Terminal3.tsx` and bound `isTypingDone` to the terminal status indicator badge.

---

## Anomaly Entry 3: Browser Runtime Type Error TS2503 [RESOLVED]

### Observed Failure / Stack Trace
```text
src/components/Terminal2.tsx(61,22): error TS2503: Cannot find namespace 'NodeJS'.
```

### Suspected Root Cause
Browser DOM environments use numeric IDs for timer handles rather than `NodeJS.Timeout`.

### Applied Fix
Replaced all occurrences of `NodeJS.Timeout` with `ReturnType<typeof setTimeout>`.

---

## Anomaly Entry 4: Unused Identifier TS6133 [RESOLVED]

### Observed Failure / Stack Trace
```text
src/components/Terminal2.tsx(44,10): error TS6133: 'streamRate' is declared but its value is never read.
```

### Suspected Root Cause
When removing non-process speed metrics from `Terminal2.tsx`, `streamRate` was left in component state without consumers.

### Applied Fix
Removed the unused `streamRate` state declaration and setter call from `src/components/Terminal2.tsx`. Production build (`tsc && vite build`) passed with zero errors.

