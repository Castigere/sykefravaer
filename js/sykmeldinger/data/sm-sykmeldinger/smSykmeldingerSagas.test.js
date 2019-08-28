import { expect } from 'chai';
import { put, select, call } from 'redux-saga/effects';
import { hentSykmeldingsregisterUrl, oppdaterSmSykmeldinger } from './smSykmeldingerSagas';
import { henterSmSykmeldinger, smSykmeldingerHentet } from './smSykmeldingerActions';
import { toggleNyttSykmeldingsmottak, unleashtogglesHentetSelector } from '../../../data/unleash-toggles/unleashTogglesSelectors';
import { NYTT_SYKMELDINGSMOTTAK } from '../../../enums/unleashToggles';
import { get } from '../../../data/gateway-api';

describe('smSykmeldingerSagas', () => {
    describe('hent sykmeldinger', () => {
        const generator = oppdaterSmSykmeldinger();
        const state = {
            unleashToggles: {
                hentingFeilet: false,
                hentet: true,
                data: {
                    [NYTT_SYKMELDINGSMOTTAK]: true,
                },
            },
        };

        it('skal hente toggles', () => {
            const selectToggleNyttSykmeldingsmottak = select(toggleNyttSykmeldingsmottak);
            expect(toggleNyttSykmeldingsmottak(state)).to.equal(true);
            expect(generator.next(state).value).to.deep.equal(selectToggleNyttSykmeldingsmottak);
            const selectUnleashtogglesHentetSelector = select(unleashtogglesHentetSelector);
            expect(unleashtogglesHentetSelector(state)).to.equal(true);
            expect(generator.next(state).value).to.deep.equal(selectUnleashtogglesHentetSelector);
        });

        it('skal dispatche henter sm sykmeldinger action', () => {
            const nextPut = put(henterSmSykmeldinger());
            expect(generator.next(state).value).to.deep.equal(nextPut);
        });

        it('skal gjore kall mot syfosmregister', () => {
            const nextCall = call(get, `${hentSykmeldingsregisterUrl()}/v1/sykmeldinger`);
            expect(generator.next(state).value).to.deep.equal(nextCall);
        });

        it('skal dispatche action med data hentet', () => {
            const nextPut = put(smSykmeldingerHentet([]));
            expect(generator.next().value).to.deep.equal(nextPut);
        });
    });
});
