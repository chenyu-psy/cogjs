---
layout: default
title: Random Utility Functions
---

# Random Utility Functions

This document provides an overview and examples of the random utility functions available in the `random.ts` module.

**Navigation**: 
- [Back to Documentation Index]({{ site.baseurl }}/docs/)
- [GitHub Repository](https://github.com/chenyu-psy/cogjs)

## Table of Contents
- [Random Utility Functions](#random-utility-functions)
  - [Table of Contents](#table-of-contents)
  - [Basic Random Generation](#basic-random-generation)
    - [random()](#random)
    - [randint()](#randint)
  - [Array Shuffling](#array-shuffling)
    - [shuffle()](#shuffle)
    - [shuffleCopy()](#shufflecopy)
  - [Sampling](#sampling)
    - [sample()](#sample)

## Basic Random Generation

### random()

Generates a random floating-point number between 0 (inclusive) and 1 (exclusive).

**Example:**
```typescript
import { random } from '../src/utils/random';

// Generate a random number between 0 and 1
const value = random.random();
console.log(value); // Outputs: 0.7564832671287935 (example)
```

### randint()

Generates a random integer within the specified range.

**Parameters:**
- `start`: The lower bound of the range (inclusive)
- `end`: The upper bound of the range (exclusive)

**Example:**
```typescript
import { random } from '../src/utils/random';

// Generate a random integer between 1 and 10
const value = random.randint(1, 11);
console.log(value); // Outputs: 7 (example)

// Generate random dice roll (1-6)
const diceRoll = random.randint(1, 7);
console.log(diceRoll); // Outputs: 3 (example)
```

**Note:** The function will throw an error if `start` is greater than or equal to `end`.

## Array Shuffling

### shuffle()

Randomly shuffles an array in-place using the Fisher-Yates (Knuth) algorithm.

**Parameters:**
- `array`: The array to shuffle

**Example:**
```typescript
import { random } from '../src/utils/random';

const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
random.shuffle(cards);
console.log(cards); // Outputs: ['7', 'A', 'Q', '4', '2', '10', 'K', '3', 'J', '8', '5', '6', '9'] (example)
```

**Note:** This function modifies the original array.

### shuffleCopy()

Creates a new shuffled copy of the given array using the Fisher-Yates (Knuth) algorithm.

**Parameters:**
- `array`: The array to shuffle

**Example:**
```typescript
import { random } from '../src/utils/random';

const originalArray = [1, 2, 3, 4, 5];
const shuffledArray = random.shuffleCopy(originalArray);

console.log(originalArray); // Outputs: [1, 2, 3, 4, 5]
console.log(shuffledArray); // Outputs: [3, 1, 5, 2, 4] (example)
```

**Note:** Unlike `shuffle()`, this function creates a new array and does not modify the original.

## Sampling

### sample()

Sample a specified number of elements from an array, allowing for either repeated or non-repeated sampling.

**Parameters:**
- `arr`: The array to sample from
- `num`: The number of elements to sample
- `repeat`: Optional boolean (default: false). If true, allows repeated elements in the sample

**Example without repetition:**
```typescript
import { random } from '../src/utils/random';

const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
const selectedColors = random.sample(colors, 3);
console.log(selectedColors); // Outputs: ['green', 'yellow', 'red'] (example)
```

**Example with repetition:**
```typescript
import { random } from '../src/utils/random';

const diceOutcomes = [1, 2, 3, 4, 5, 6];
const diceRolls = random.sample(diceOutcomes, 4, true);
console.log(diceRolls); // Outputs: [6, 3, 3, 1] (example - notice repeated 3)
```