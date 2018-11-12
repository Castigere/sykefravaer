import { expect } from 'chai';
import { actiontyper } from 'moter-npm';
import { get } from 'digisyfo-npm';
import { put, call } from 'redux-saga/effects';
import { hentMote } from '../../js/sagas/moteSagas';

describe('moteSagas', () => {
    describe('hentMote', () => {
        const generator = hentMote({});

        it('Skal dispatche HENTER_MOTE', () => {
            const nextPut = put({ type: actiontyper.HENTER_MOTE });
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it('Skal dernest hente mote', () => {
            const nextCall = call(get, '/moterest/api/v2/moter/siste');
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it('Skal dernest lagre mote', () => {
            const nextPut = put({
                type: actiontyper.MOTE_HENTET,
                data: { mitt: 'mote' },
            });
            expect(generator.next({ mitt: 'mote' }).value).to.deep.equal(nextPut);
        });
    });
});
