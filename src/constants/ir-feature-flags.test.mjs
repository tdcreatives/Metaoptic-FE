import test from 'node:test';
import assert from 'node:assert/strict';

import { parseEnvFlag } from './ir-feature-flags.js';

test('parseEnvFlag treats true-ish values', () => {
    assert.equal(parseEnvFlag('true'), true);
    assert.equal(parseEnvFlag('TRUE'), true);
    assert.equal(parseEnvFlag('1'), true);
    assert.equal(parseEnvFlag('yes'), true);
});

test('parseEnvFlag treats false-ish values', () => {
    assert.equal(parseEnvFlag('false'), false);
    assert.equal(parseEnvFlag('0'), false);
    assert.equal(parseEnvFlag('no'), false);
});

test('parseEnvFlag uses fallback when unset or unknown', () => {
    assert.equal(parseEnvFlag(undefined), false);
    assert.equal(parseEnvFlag(''), false);
    assert.equal(parseEnvFlag(undefined, true), true);
    assert.equal(parseEnvFlag('maybe', true), true);
    assert.equal(parseEnvFlag('maybe', false), false);
});
