import chai from 'chai';
import {
    hentSporsmalForAktiviteterISykmeldingsperioden,
} from '../../../../js/components/sykepengesoknad-selvstendig/AktiviteterISykmeldingsperioden/AktiviteterISykmeldingsperioden';
import { getSoknad } from '../../../mockSoknader';

const expect = chai.expect;

describe('AktiviteterISykmeldingsperioden', () => {
    describe('hentSporsmalForAktiviteterISykmeldingsperioden', () => {
        it("Skal ikke returnere spørsmål med tag = 'ANDRE_INNTEKTSKILDER' (1)", () => {
            const soknad = getSoknad();
            const sporsmal = hentSporsmalForAktiviteterISykmeldingsperioden(soknad);
            expect(sporsmal).not.to.deep.include(soknad.sporsmal[0]);
        });

        it('Skal ikke returnere spørsmål om jobbing unduer sykefraværet', () => {
            const soknad = getSoknad();
            const sporsmal = hentSporsmalForAktiviteterISykmeldingsperioden(soknad);
            expect(sporsmal).not.to.deep.include(soknad.sporsmal[1]);
            expect(sporsmal).not.to.deep.include(soknad.sporsmal[2]);
        });

        it('Skal returnerre spørsmål om inntektskilder', () => {
            const soknad = getSoknad();
            const sporsmal = hentSporsmalForAktiviteterISykmeldingsperioden(soknad);
            expect(sporsmal).to.deep.include(soknad.sporsmal[5]);
        });

        it('Skal returnerre spørsmål om utenlandsopphold', () => {
            const soknad = getSoknad();
            const sporsmal = hentSporsmalForAktiviteterISykmeldingsperioden(soknad);
            expect(sporsmal).to.deep.include(soknad.sporsmal[4]);
        });

        it('Skal returnerre spørsmål om utdanning', () => {
            const soknad = getSoknad();
            const sporsmal = hentSporsmalForAktiviteterISykmeldingsperioden(soknad);
            expect(sporsmal).to.deep.include(soknad.sporsmal[5]);
        });
    });
});