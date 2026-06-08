#!/usr/bin/env node
const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Check for unmatched braces
const openBraces = (content.match(/{/g) || []).length;
const closeBraces = (content.match(/}/g) || []).length;
const openParens = (content.match(/\(/g) || []).length;
const closeParens = (content.match(/\)/g) || []).length;
const openBrackets = (content.match(/\[/g) || []).length;
const closeBrackets = (content.match(/\]/g) || []).length;

console.log('Brace count:');
console.log(`  { : ${openBraces}`);
console.log(`  } : ${closeBraces}`);
console.log(`  Match: ${openBraces === closeBraces ? '✓' : '✗ MISMATCH'}`);

console.log('\nParenthesis count:');
console.log(`  ( : ${openParens}`);
console.log(`  ) : ${closeParens}`);
console.log(`  Match: ${openParens === closeParens ? '✓' : '✗ MISMATCH'}`);

console.log('\nBracket count:');
console.log(`  [ : ${openBrackets}`);
console.log(`  ] : ${closeBrackets}`);
console.log(`  Match: ${openBrackets === closeBrackets ? '✓' : '✗ MISMATCH'}`);

// Find the last closing tag
const bodyMatch = content.match(/<body[^>]*>/i);
const bodyCloseIndex = content.lastIndexOf('</body>');
const htmlCloseIndex = content.lastIndexOf('</html>');

console.log('\nTag structure:');
console.log(`  <body> found: ${bodyMatch ? '✓' : '✗'}`);
console.log(`  </body> found at position: ${bodyCloseIndex >= 0 ? bodyCloseIndex : '✗ NOT FOUND'}`);
console.log(`  </html> found at position: ${htmlCloseIndex >= 0 ? htmlCloseIndex : '✗ NOT FOUND'}`);
console.log(`  File length: ${content.length}`);

if (bodyCloseIndex < 0) {
  console.log('\n⚠️  CRITICAL: </body> tag is missing!');
}
if (htmlCloseIndex < 0) {
  console.log('\n⚠️  CRITICAL: </html> tag is missing!');
}
