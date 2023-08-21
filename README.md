## Installation

```bash
npm install
```

## Run Project

```bash
// Start 2 Grapes
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'

// Run all the nodes within 30 seconds
node firstClient.js
node secondClient.js
node thirdClient.js
```
