#!/usr/bin/env node
import { main } from '../cli/index.js';

main(process.argv).catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
