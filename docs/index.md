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

Once you have an index file in /docs, GitHub Pages will find the source folder.

### [index.md](file:///Users/chenyu/GitHub/cogjs/docs/index.md)

Add an index file with basic content:

```markdown
---
layout: default
title: CogJS Documentation
---

# CogJS Documentation

Welcome to the documentation for CogJS.

- [Random Utilities]({{ site.baseurl }}/docs/random-utils.html)
- [Other Docs]({{ site.baseurl }}/docs/other-docs.html)
```
