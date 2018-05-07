import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import * as actions from '../../js/actions/arbeidsgiversSykmeldinger_actions';
import * as actiontyper from '../../js/actions/actiontyper';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('arbeidsgiversSykmeldinger_actions', () => {
    beforeEach(() => {
        window = window || {};
        window.APP_SETTINGS = {
            REST_ROOT: 'http://tjenester.nav.no/syforest',
        };
    });

    it('Skal ha en henterArbeidsgiversSykmeldinger()-funksjon som returnerer riktig action', () => {
        expect(actions.henterArbeidsgiversSykmeldinger()).to.deep.equal({
            type: actiontyper.HENTER_ARBEIDSGIVERS_SYKMELDINGER,
        });
    });

    it('Skal ha en setArbeidsgiversSykmeldinger()-funksjon som returnerer riktig action', () => {
        expect(actions.setArbeidsgiversSykmeldinger([{ id: 12345, navn: 'Helge' }])).to.deep.equal({
            type: actiontyper.SET_ARBEIDSGIVERS_SYKMELDINGER,
            sykmeldinger: [{
                id: 12345, navn: 'Helge',
            }],
        });
    });

    it('Skal ha en hentArbeidsgiversSykmeldingerFeilet()-funksjon som returnerer riktig action', () => {
        expect(actions.hentArbeidsgiversSykmeldingerFeilet()).to.deep.equal({
            type: actiontyper.HENT_ARBEIDSGIVERS_SYKMELDINGER_FEILET,
        });
    });

    it('Skal ha en hentArbeidsgiversSykmeldinger()-funksjon som returnerer riktig action', () => {
        expect(actions.hentArbeidsgiversSykmeldinger()).to.deep.equal({
            type: actiontyper.HENT_ARBEIDSGIVERS_SYKMELDINGER_FORESPURT,
        });
    });
});
