const assert = require('assert');

const testing = "Just testing";

describe('Sample test', () => {
    it('assert sample equals', () => assert.deepStrictEqual(testing, "Just testing"));
});