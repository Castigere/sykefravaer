import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import * as actions from '../../js/actions/dineArbeidsgivere_actions';
import * as actiontyper from '../../js/actions/actiontyper';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('dineArbeidsgivere_actions', () => {
    beforeEach(() => {
        window = window || {};
        window.APP_SETTINGS = {
            REST_ROOT: 'http://tjenester.nav.no/syforest',
        };
    });

    it('Skal ha en hentAktuelleArbeidsgivere(sykmeldingId, dato)-funksjon som returnerer en funksjon', () => {
        const action = actions.hentAktuelleArbeidsgivere('455');
        expect(action).to.deep.equal({
            type: actiontyper.HENT_AKTUELLE_ARBEIDSGIVERE_FORESPURT,
            sykmeldingId: '455',
        });
    });

    it('Skal ha en henterAktuelleArbeidsgivere(sykmeldingId)-funksjon som returnerer riktig action', () => {
        const sykmeldingId = 'olsen';
        const resultat = actions.henterAktuelleArbeidsgivere(sykmeldingId);
        expect(resultat).to.deep.equal({
            type: actiontyper.HENTER_AKTUELLE_ARBEIDSGIVERE,
            sykmeldingId: 'olsen',
        });
    });

    it('Skal ha en hentAktuelleArbeidsgivereFeilet(sykmeldingId)-funksjon som returnerer riktig action', () => {
        const sykmeldingId = 'olsen';
        const resultat = actions.hentAktuelleArbeidsgivereFeilet(sykmeldingId);
        expect(resultat).to.deep.equal({
            type: actiontyper.HENT_AKTUELLE_ARBEIDSGIVERE_FEILET,
            sykmeldingId: 'olsen',
        });
    });

    it('Skal ha en aktuelleArbeidsgivereHentet(sykmeldingId, [arbeidsgivere])-funksjon som returnerer riktig action', () => {
        const sykmeldingId = 'olsen';
        const arbeidsgivere = [{
            orgnr: 12345678,
            navn: 'Hansens Frisørsalong',
        }, {
            orgnr: 87654321,
            navn: 'Oslo Sykkelbutikk',
        }, {
            orgnr: 32165478,
            navn: 'Bergen Malingsfabrikk',
        }];
        const resultat = actions.aktuelleArbeidsgivereHentet(sykmeldingId, arbeidsgivere);
        expect(resultat).to.deep.equal({
            type: actiontyper.AKTUELLE_ARBEIDSGIVERE_HENTET,
            sykmeldingId: 'olsen',
            arbeidsgivere: [{
                orgnr: 12345678,
                navn: 'Hansens Frisørsalong',
            }, {
                orgnr: 87654321,
                navn: 'Oslo Sykkelbutikk',
            }, {
                orgnr: 32165478,
                navn: 'Bergen Malingsfabrikk',
            }],
        });
    });
});