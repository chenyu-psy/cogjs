---
layout: default
title: CogJS Documentation
---

# CogJS Documentation

Welcome to the CogJS documentation, a utility library for JavaScript/TypeScript development.

## Available Documentation

- [Random Utility Functions](./random-utils.md) - Functions for random number generation, array shuffling, and sampling

## Getting Started

```typescript
// Import the utilities you need
import { random } from 'cogjs/utils/random';

// Use the functions
const randomValue = random.random();
const diceRoll = random.randint(1, 7);
const shuffledArray = random.shuffleCopy([1, 2, 3, 4, 5]);
```

## Installation

```bash
npm install cogjs
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
