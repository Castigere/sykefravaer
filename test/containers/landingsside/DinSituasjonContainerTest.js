import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { arbeidssituasjoner as situasjoner, sykmeldingstatuser as statuser } from 'digisyfo-npm';
import DinSituasjon from '../../../js/components/landingsside/DinSituasjon';
import {
    Container,
    mapStateToProps,
    sykmeldingerYngreEnnTreMaanederSelector,
    aktuelleArbeidssituasjonerSelector,
    arbeidsgivereIDinSituasjonSelector,
} from '../../../js/containers/landingsside/DinSituasjonContainer';
import ledere from '../../../js/reducers/ledere';
import { ledereHentet } from '../../../js/actions/ledere_actions';

const { ARBEIDSTAKER, FRILANSER } = situasjoner;
const { BEKREFTET, SENDT, TIL_SENDING } = statuser;

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('DinSituasjonContainer', () => {
    let clock;
    let sykmeldinger;
    let state;

    beforeEach(() => {
        clock = sinon.useFakeTimers(new Date('2018-01-01').getTime());

        sykmeldinger = [{
            id: 'fireMndSiden',
            status: BEKREFTET,
            mulighetForArbeid: {
                perioder: [{
                    fom: new Date('2017-08-01'),
                    tom: new Date('2017-09-01'),
                }],
            },
        }, {
            id: 'toMndSiden',
            status: BEKREFTET,
            valgtArbeidssituasjon: FRILANSER,
            mulighetForArbeid: {
                perioder: [{
                    fom: new Date('2017-10-01'),
                    tom: new Date('2017-11-01'),
                }],
            },
        }, {
            id: 'omTiMnd',
            status: SENDT,
            mottakendeArbeidsgiver: {
                navn: 'SOLSTRÅLEN PIZZA',
            },
            mulighetForArbeid: {
                perioder: [{
                    fom: new Date('2018-10-01'),
                    tom: new Date('2018-11-01'),
                }],
            },
        }];

        state = {
            dineSykmeldinger: {
                data: sykmeldinger,
            },
            ledere: ledere(),
        };
    });

    afterEach(() => {
        clock.restore();
    });

    describe('sykmeldingerYngreEnnTreMaanederSelector', () => {
        it('Skal filtrere sykmeldinger på periode', () => {
            const filtrert = sykmeldingerYngreEnnTreMaanederSelector(state);
            expect(filtrert).to.have.length(2);
        });

        it('Skal filtrere vekk sykmeldinger med tom mer enn 3 måneder tilbake i tid', () => {
            const filtrert = sykmeldingerYngreEnnTreMaanederSelector(state);
            expect(filtrert[0].id).to.not.equal('fireMndSiden');
        });

        it('Skal ikke filtrere vekk sykmeldinger med tom mindre enn 3 måneder tilbake i tid', () => {
            const filtrert = sykmeldingerYngreEnnTreMaanederSelector(state);
            expect(filtrert[0].id).to.equal('toMndSiden');
        });

        it('Skal ikke filtrere vekk sykmeldinger med tom framover i tid', () => {
            const filtrert = sykmeldingerYngreEnnTreMaanederSelector(state);
            expect(filtrert[1].id).to.equal('omTiMnd');
        });
    });

    describe('aktuelleArbeidssituasjonerSelector', () => {
        it('Skal filtrere sykemeldinger med status BEKREFTET', () => {
            const filtrert = aktuelleArbeidssituasjonerSelector(state);
            expect(filtrert).to.have.length(1);
        });

        it('Skal returnere arbeidssituasjon', () => {
            const filtrert = aktuelleArbeidssituasjonerSelector(state);
            expect(filtrert[0]).to.equal(FRILANSER);
        });
    });

    describe('arbeidsgivereIDinSituasjonSelector', () => {
        it('Skal filtrere sykemeldinger med status SENDT', () => {
            const filtrert = arbeidsgivereIDinSituasjonSelector(state);
            expect(filtrert).to.have.length(1);
        });

        it('Skal filtrere sykemeldinger med status TIL_SENDING', () => {
            sykmeldinger[1].status = TIL_SENDING;
            sykmeldinger[1].mottakendeArbeidsgiver = {
                navn: 'Min bedrift',
            };
            state.dineSykmeldinger.data = sykmeldinger;
            const filtrert = arbeidsgivereIDinSituasjonSelector(state);
            expect(filtrert).to.deep.equal(['Min bedrift', 'SOLSTRÅLEN PIZZA']);
        });

        it('Skal returnere arbeidsgiver', () => {
            const filtrert = arbeidsgivereIDinSituasjonSelector(state);
            expect(filtrert[0]).to.equal('SOLSTRÅLEN PIZZA');
        });

        it('Skal bare returnere arbeidsgivere for sykmeldinger som er yngre enn 3 måneder', () => {
            state.dineSykmeldinger.data[0].status = SENDT;
            state.dineSykmeldinger.data[0].mottakendeArbeidsgiver = {
                navn: 'Testbedrift',
            };
            const filtrert = arbeidsgivereIDinSituasjonSelector(state);
            expect(filtrert).to.deep.equal(['SOLSTRÅLEN PIZZA']);
        });

        it('Skal returnere arbeidsgivere for sykmeldinger som er eldre enn 3 måneder dersom arbeidsgiveren har en aktiv nærmeste leder', () => {
            state.dineSykmeldinger.data[0].status = SENDT;
            state.dineSykmeldinger.data[0].mottakendeArbeidsgiver = {
                navn: 'PONTYPANDY FIRE SERVICE',
                virksomhetsnummer: '110110110',
                juridiskOrgnummer: '110110110',
            };

            const lederData = [
                {
                    aktoerId: '1101101101102',
                    navn: 'Station Officer Steele',
                    epost: 'steele@pontypandyfire.gov.uk',
                    mobil: '110',
                    orgnummer: '110110110',
                    organisasjonsnavn: 'PONTYPANDY FIRE SERVICE',
                    aktivTom: null,
                    arbeidsgiverForskuttererLoenn: true,
                },
            ];

            state.ledere = ledere(ledere(), ledereHentet(lederData));
            const filtrert = arbeidsgivereIDinSituasjonSelector(state);
            expect(filtrert).to.deep.equal(['PONTYPANDY FIRE SERVICE', 'SOLSTRÅLEN PIZZA']);
        });
    });

    describe('mapStateToProps', () => {
        it('Skal returnere filtrerte arbeidssituasjoner', () => {
            const props = mapStateToProps(state);
            expect(props.arbeidssituasjoner[0]).to.equal(FRILANSER);
        });

        it('Skal returnere filtrerte arbeidsgivere', () => {
            const props = mapStateToProps(state);
            expect(props.arbeidsgivere[0]).to.equal('SOLSTRÅLEN PIZZA');
        });
        it('Skal returnere arbeidssituasjonen \'Arbeidstaker\' dersom det ikke finnes info om arbeidsgiver', () => {
            state.dineSykmeldinger.data[1].valgtArbeidssituasjon = ARBEIDSTAKER;
            state.dineSykmeldinger.data.pop();
            const props = mapStateToProps(state);
            expect(props.arbeidssituasjoner).to.have.length(1);
        });

        it('Skal filtrere vekk arbeidssituasjonen \'Arbeidstaker\' dersom det finnes info om arbeidsgiver', () => {
            state.dineSykmeldinger.data[1].valgtArbeidssituasjon = ARBEIDSTAKER;
            const props = mapStateToProps(state);
            expect(props.arbeidssituasjoner).to.have.length(0);
        });

        it('Skal returnere andre arbeidssituasjoner selv om det finnes info om arbeidsgiver', () => {
            const props = mapStateToProps(state);
            expect(props.arbeidssituasjoner).to.have.length(1);
        });
    });

    describe('Container', () => {
        it('Viser ingenting dersom det ikke finnes arbeidssituasjoner eller arbeidsgivere', () => {
            const container = shallow(<Container arbeidssituasjoner={[]} arbeidsgivere={[]} />);
            expect(container.find(DinSituasjon)).to.have.length(0);
        });

        it('Viser DinSituasjon hvis det finnes arbeidssituasjoner', () => {
            const container = shallow(<Container arbeidssituasjoner={[FRILANSER]} arbeidsgivere={[]} />);
            expect(container.find(DinSituasjon)).to.have.length(1);
        });

        it('Viser DinSituasjon hvis det finnes arbeidsgivere', () => {
            const container = shallow(<Container arbeidssituasjoner={[]} arbeidsgivere={['SOLSTRÅLEN PIZZA']} />);
            expect(container.find(DinSituasjon)).to.have.length(1);
        });
    });
});
