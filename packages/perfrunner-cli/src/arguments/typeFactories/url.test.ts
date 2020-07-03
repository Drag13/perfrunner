import 'mocha';
import { expect } from 'chai';

import { Url } from './url';

describe('URL type should', () => {
    describe('throw an error for', () => {
        it('the undefined', () => {
            expect(() => Url(undefined)).to.throw();
        });

        it('the empty URL', () => {
            expect(() => Url('')).to.throw();
        });
    });

    describe('return', () => {
        it('expected url', () => {
            const url = Url('drag13.io');
            expect(url.href).to.be.equal('http://drag13.io/');
        });
    });
});
