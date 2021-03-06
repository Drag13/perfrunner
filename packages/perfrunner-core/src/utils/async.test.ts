import 'mocha';
import { expect } from 'chai';
import { iterateAsync } from './async';

describe('iterate async should', () => {
    const data = [0, 1, 2];
    const handler = (v: number) => new Promise<number>((res) => res(v + 1));

    it('produce expected values', async () => {
        const asyncSequence = iterateAsync(data, handler);
        let i = 0;
        for await (const result of asyncSequence) {
            expect(result).to.eql(i + 1);
            i++;
        }
    });
});
