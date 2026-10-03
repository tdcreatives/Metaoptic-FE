import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { normalizeAnnouncement, toTitleCase } from './announcements.js';

const announcements = JSON.parse(
    readFileSync(new URL('../constants/announcements.json', import.meta.url))
);

test('preserves required announcement title capitalization', () => {
    assert.equal(
        toTitleCase('MOT METAOPTICS DLW AI US U.S. FY2025 S$1.1M nano@Stanford LQN SGX-ST IoT CES MOU EGM'),
        'MOT MetaOptics DLW AI US U.S. FY2025 S$1.1M nano@Stanford LQN SGX-ST IoT CES MOU EGM'
    );
});

test('keeps incorrect capitalization out of the complete announcement list', () => {
    const incorrectCapitalization =
        /\b(?:Mot|Metaoptics|Dlw|Ai|Us|Fy\d|Lqn|Sgx(?:-St)?|Iot|Ces|Mou|Egm)\b|U\.s\.|S\$\d+(?:\.\d+)?[mkb]\b|Nano@stanford/;
    const invalidTitles = announcements
        .map(normalizeAnnouncement)
        .map(({ displayTitle }) => displayTitle)
        .filter((title) => incorrectCapitalization.test(title));

    assert.deepEqual(invalidTitles, []);
});
