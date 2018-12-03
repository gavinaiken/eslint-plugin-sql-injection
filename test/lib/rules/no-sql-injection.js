'use strict';

const fs = require('fs');
const path = require('path');
const rule = require('../../../lib/rules/no-sql-injection');
const RuleTester = require('eslint').RuleTester;

function loadExamples() {
    const exampleDir = path.join(__dirname, '..', '..', 'examples');
    const exampleDirContents = fs.readdirSync(exampleDir);
    const valid = exampleDirContents
        .filter(fileName => /^valid-\d+.js$/.test(fileName))
        .map(fileName => fs.readFileSync(path.join(exampleDir, fileName), 'utf8'));
    const invalid = exampleDirContents
        .filter(fileName => /^invalid-\d+.js$/.test(fileName))
        .map(fileName => fs.readFileSync(path.join(exampleDir, fileName), 'utf8'));


    return { valid, invalid };
}

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
const examples = loadExamples();

ruleTester.run('no-unsupported-keywords', rule, {
        valid: examples.valid.map(eg => {
            return { code: eg };
        }),
        invalid: examples.invalid.map(eg => {
            return {
                code: eg,
                errors: [{
                    message: 'Sql query uses string concatenation'
                }]
            };
        })
    });
