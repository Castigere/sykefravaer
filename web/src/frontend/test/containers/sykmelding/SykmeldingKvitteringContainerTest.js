import chai from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import configureMockStore from 'redux-mock-store';
import createSagaMiddleware from 'redux-saga';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { setLedetekster, arbeidssituasjoner, sykmeldingstatuser, sykepengesoknadstatuser } from 'digisyfo-npm';
import SykmeldingKvitteringContainer, { mapStateToProps } from '../../../js/containers/sykmelding/SykmeldingKvitteringContainer';
import Standardkvittering from '../../../js/components/sykmeldingkvittering/StandardSykmeldingkvittering';
import FrilanserMedPapirsoknadKvittering from '../../../js/components/sykmeldingkvittering/FrilanserMedPapirsoknadKvittering';
import FrilanserUtenSoknadKvittering from '../../../js/components/sykmeldingkvittering/FrilanserUtenSoknadKvittering';

import getSykmelding from '../../mockSykmeldinger';
import { getParsetSoknad } from '../../mockSykepengesoknader';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SykmeldingkvitteringContainer', () => {
    const ownProps = {};
    const state = {};
    let nySoknad1;
    let nySoknad2;
    let nySoknad3;
    let nySoknad4;
    let fremtidigSoknad1;
    let sykmeldinger;
    let ledetekster;
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];
    const mockStore = configureMockStore(middlewares);

    beforeEach(() => {
        sykmeldinger = [{
            id: '2',
            fnr: '12',
            fornavn: 'Per',
            etternavn: 'Person',
            sykmelder: 'Ove Olsen',
            arbeidsgiver: 'Selskapet AS',
            mulighetForArbeid: {
                perioder: [{
                    fom: '2015-12-31',
                    tom: '2016-01-06',
                    grad: 67,
                }],
            },
            hoveddiagnose: {
                diagnose: 'Influensa',
                diagnosesystem: 'ICPC',
                diagnosekode: 'LP2',
            },
            arbeidsfoerEtterPerioden: true,
        }, {
            id: '1',
            fnr: '12',
            fornavn: 'Per',
            etternavn: 'Person',
            sykmelder: 'Ove Olsen',
            arbeidsgiver: 'Selskapet AS',
            mulighetForArbeid: {
                perioder: [{
                    fom: '2015-12-31',
                    tom: '2016-01-06',
                    grad: 67,
                }],
            },
            hoveddiagnose: {
                diagnose: 'Influensa',
                diagnosesystem: 'ICPC',
                diagnosekode: 'LP2',
            },
            arbeidsfoerEtterPerioden: true,
        }, {
            id: '3',
            fnr: '12',
            fornavn: 'Per',
            etternavn: 'Person',
            sykmelder: 'Ove Olsen',
            arbeidsgiver: 'Selskapet AS',
            mulighetForArbeid: {
                perioder: [{
                    fom: '2015-12-31',
                    tom: '2016-01-06',
                    grad: 67,
                }],
            },
            hoveddiagnose: {
                diagnose: 'Influensa',
                diagnosesystem: 'ICPC',
                diagnosekode: 'LP2',
            },
            arbeidsfoerEtterPerioden: true,
        }, {
            id: '4',
            status: 'BEKREFTET',
            fnr: '12',
            fornavn: 'Per',
            etternavn: 'Person',
            sykmelder: 'Ove Olsen',
            arbeidsgiver: 'Selskapet AS',
            hoveddiagnose: {
                diagnose: 'Influensa',
                diagnosesystem: 'ICPC',
                diagnosekode: 'LP2',
            },
            arbeidsfoerEtterPerioden: true,
            mulighetForArbeid: {
                perioder: [{
                    fom: '2015-12-31',
                    tom: '2016-01-06',
                    grad: 67,
                }],
            },
        }, {
            id: '5',
            status: 'BEKREFTET',
            innsendtArbeidsgivernavn: null,
            orgnummer: null,
            arbeidsgiver: 'LOMMEN BARNEHAVE',
            valgtArbeidssituasjon: 'arbeidstaker',
            mulighetForArbeid: {
                perioder: [{
                    fom: '2015-12-31',
                    tom: '2016-01-06',
                    grad: 67,
                }],
            },
        }];

        nySoknad1 = getParsetSoknad({
            sykmeldingId: '1',
            status: sykepengesoknadstatuser.NY,
        });

        nySoknad2 = getParsetSoknad({
            sykmeldingId: '2',
            status: sykepengesoknadstatuser.NY,
        });

        nySoknad3 = getParsetSoknad({
            sykmeldingId: '1',
            status: sykepengesoknadstatuser.NY,
        });

        nySoknad4 = getParsetSoknad({
            sykmeldingId: '1',
            status: sykepengesoknadstatuser.NY,
        });

        fremtidigSoknad1 = getParsetSoknad({
            sykmeldingId: '1',
            status: sykepengesoknadstatuser.FREMTIDIG,
        });

        state.dineSykmeldinger = {
            data: sykmeldinger,
        };
        state.arbeidsgiversSykmeldinger = {
            data: sykmeldinger.map((s) => {
                return {
                    ...s,
                    valgtArbeidsgiver: {},
                };
            }),
        };
        state.ledetekster = {};
        state.brukerinfo = {
            bruker: {
                data: {
                    strengtFortroligAdresse: false,
                },
            },
            innlogging: {
                hentingFeilet: false,
            },
        };
        state.sykepengesoknader = {
            data: [nySoknad1, nySoknad2, nySoknad3, nySoknad4, fremtidigSoknad1],
        };
        state.sykmeldingMeta = {
            1: {
                erUtenforVentetid: false,
                skalOppretteSoknad: false,
            },
        };
        state.timeout = {};
        ownProps.params = {
            sykmeldingId: '1',
        };
        /* eslint-disable max-len */
        ledetekster = {
            'send-til-arbeidsgiver.kvittering.tittel': 'Sykmeldingen er sendt!',
            'send-til-arbeidsgiver.kvittering.undertekst': '<p>Sykmeldingen sendes til arbeidsgiveren din via Altinn. Det vil kunne ta noe tid før meldingen ligger i din arbeidsgivers innboks.</p> <h3>Du er ikke helt ferdig!</h3><p>Skal du søke om sykepenger, må du fylle ut det siste arket du fikk (del D), slik som før. Betaler arbeidsgiveren din lønn under sykdom, skal du sende den dit. Hvis ikke, skal du sende den til <a href="https://www.nav.no/no/Bedrift/Innhold+til+Bedrift-forside/Nyttig+a+vite/Adresser+til+NAV+Arbeid+og+ytelser+for+krav+om+sykepenger">NAV Arbeid og ytelser</a> i ditt fylke. Er du usikker, spør arbeidsgiveren din.</p>',
            'bekreft-sykmelding.kvittering.tittel': 'Du har bekreftet sykmeldingen',
            'bekreft-sykmelding.kvittering.undertekst': '<h3>Du er ikke helt ferdig!</h3><p>Skal du søke om sykepenger, må du fylle ut det siste arket du fikk (del D) og sende den til <a href="https://www.nav.no/no/Bedrift/Innhold+til+Bedrift-forside/Nyttig+a+vite/Adresser+til+NAV+Arbeid+og+ytelser+for+krav+om+sykepenger">NAV Arbeid og ytelser</a> i ditt fylke.</p>',
            'sykmelding.kvittering.sok-senere.steg-1.tittel-3': 'Nå har du gjort første del',
            'sykmelding.kvittering.sok-senere.steg-1.tekst-3': '<p>Du har sendt beskjed om sykefraværet til arbeidsgiveren din</p>',
            'sykmelding.kvittering.sok-senere.steg-2.tittel-3': 'Om noen dager får du noen spørsmål',
            'sykmelding.kvittering.sok-senere.steg-2.tekst-3': '<p>Svarene bruker vi til å beregne sykepengene dine. Du må svare selv om arbeidsgiveren din betaler deg lønn mens du er syk. Det er fordi arbeidsgiveren kanskje skal ha tilbake penger fra NAV senere.</p><p>Du får melding fra oss om dette %DATOER%.</p><p>Skal du ha utbetalingen direkte fra NAV? <br />Minn gjerne arbeidsgiveren din på å sende inntektsopplysninger så tidlig som mulig. Da går saksbehandlingen fortere.</p><p>Fikk du sykmeldingen på papir hos legen? <br />Legg den bort. Det du gjør på nett erstatter papiret.</p><p>Skal du reise ut av Norge? <br /><a target="_blank" href="https://www.nav.no/no/Person/Arbeid/Sykmeldt%2C+arbeidsavklaringspenger+og+yrkesskade/Sykepenger/sykepenger-ved-utenlandsopphold">Se regler om sykepenger og opphold utenfor Norge.</a></p>',
            'sykmelding.kvittering.sok-na.steg-1.tittel-2': 'Da har du gjort første del',
            'sykmelding.kvittering.sok-na.steg-1.tekst-2': '<p>Du har sendt beskjed om sykefraværet til arbeidsgiveren din</p>',
            'sykmelding.kvittering.sok-na.steg-2.tittel-2': 'Nå skal du svare noen spørsmål',
            'sykmelding.kvittering.sok-na.steg-2.tekst-2': '<p>Svarene bruker vi til å beregne sykepengene dine. Du må svare selv om arbeidsgiveren din betaler deg lønn mens du er syk. Det er fordi arbeidsgiveren kanskje skal ha tilbake penger fra NAV senere.</p>',
            'sykmelding.kvittering.sok-na.papir.tekst': '<p><strong>Fikk du sykmeldingen på papir hos legen? </strong><br />Legg den bort. Det du gjør på nett erstatter papiret.</p>',
            'bekreft-sykmelding.skjermingskode-6.kvittering.undertekst': '<p>Tekst for skjermingskode 6</p>',
            'bekreft-sykmelding.arbeidstaker-uten-arbeidsgiver.kvittering.tittel': 'Du har bekreftet sykmeldingen',
            'bekreft-sykmelding.arbeidstaker-uten-arbeidsgiver.kvittering.undertekst': '<h3>Du er ikke helt ferdig!</h3><p>Skal du søke om sykepenger, må du fylle ut det siste arket du fikk (del D), slik som før. Betaler arbeidsgiveren din lønn under sykdom, skal du sende den dit. Hvis ikke, skal du sende den til <a href="https://www.nav.no/no/Bedrift/Innhold+til+Bedrift-forside/Nyttig+a+vite/Adresser+til+NAV+Arbeid+og+ytelser+for+krav+om+sykepenger">NAV Arbeid og ytelser</a> i ditt fylke. Er du usikker, spør arbeidsgiveren din. </p>',
            'bekreft-sykmelding.skal-opprettes-soknad.steg-1.tittel': 'Da har du bekreftet sykmeldingen',
            'bekreft-sykmelding.skal-opprettes-soknad.steg-2.tittel': 'Du må søke om sykepenger på papr',
            'bekreft-sykmelding.skal-opprettes-soknad.steg-2.tekst': '<p>Skal du søke om sykepenger, fyller du ut del D av papirsykmeldingen du fikk hos legen og <a href="https://www.nav.no/no/" target="_blank">inntektsopplysninger for selvstendig næringsdrivende.</a></p> <p><a href="https://www.nav.no/no/Bedrift/Innhold+til+Bedrift-forside/Nyttig+a+vite/Adresser+til+NAV+Arbeid+og+ytelser+for+krav+om+sykepenger--418649" target="_blank">Finn adressen du skal bruke.</a></p>',
            'bekreft-sykmelding.skal-ikke-opprettes-soknad.kvittering.tittel': 'Da har du bekreftet sykmeldingen',
            'bekreft-sykmelding.skal-ikke-opprettes-soknad.kvittering.undertekst': '<p>NAV dekker ikke sykepenger for de første 16 dagene. Dette fraværet er beregnet til 16 dager eller kortere. Du trenger derfor ikke å søke om sykepenger for dette sykefraværet. </p> <p>Les gjerne om <a href="https://www.nav.no/no/Person/Arbeid/Sykmeldt%2C+arbeidsavklaringspenger+og+yrkesskade/Sykepenger/Sykepenger+til+selvstendig+naringsdrivende+og+frilansere#chapter-1" target="_blank">sykepenger til selvstendig næringsdrivende og frilansere.</a></p>',
            'avbryt-sykmelding.kvittering.tittel': 'Sykmeldingen er avbrutt',
            'avbryt-sykmelding.kvittering.undertekst': '<p>Du kan ikke lenger sende sykmeldingen her fra nav.no.</p><p>Dette påvirker ikke dine muligheter for å levere den på papir.</p><p>Hvis du har avbrutt fordi du fant feil, bør du kontakte den som sykmeldte deg og få en ny.</p>',
        };
        /* eslint-disable max-len */
        setLedetekster(ledetekster);
    });

    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(1484524800000); // 16. januar 2017
    });

    afterEach(() => {
        clock.restore();
    });

    const getComponent = (_state, _ownProps) => {
        const store = mockStore(_state);
        return mount(<Provider store={store}>
            <SykmeldingKvitteringContainer {..._ownProps} />
        </Provider>);
    };

    const skalViseStandardSendtKvittering = (_state, _ownProps) => {
        const component = getComponent(_state, _ownProps);
        expect(component.text()).to.contain(ledetekster['send-til-arbeidsgiver.kvittering.tittel']);
        expect(component.html()).to.contain(ledetekster['send-til-arbeidsgiver.kvittering.undertekst']);
        expect(component.find(Standardkvittering)).to.have.length(1);
    };

    const skalViseStandardBekreftetKvittering = (_state, _ownProps) => {
        const component = getComponent(_state, _ownProps);
        expect(component.text()).to.contain(ledetekster['bekreft-sykmelding.kvittering.tittel']);
        expect(component.html()).to.contain(ledetekster['bekreft-sykmelding.kvittering.undertekst']);
        expect(component.find(Standardkvittering)).to.have.length(1);
    };

    describe('SENDT sykmelding', () => {
        it('Skal vise standard sendt-kvittering hvis det ikke finnes søknader for denne sykmeldingen', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.SENDT,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
            });
            state.sykepengesoknader.data = [];
            state.dineSykmeldinger.data = [sykmelding];
            skalViseStandardSendtKvittering(state, ownProps);
        });

        it('Skal vise standard sendt-kvittering hvis det finnes søknader som ikke tilhører denne sykmeldingen', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.SENDT,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
            });
            state.dineSykmeldinger.data = [sykmelding];
            state.sykepengesoknader.data = [nySoknad2];
            skalViseStandardSendtKvittering(state, ownProps);
        });

        it('Skal vise riktig kvittering hvis det finnes fremtidige søknader som tlhører denne sykmeldingen', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.SENDT,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
            });
            state.dineSykmeldinger.data = [sykmelding];
            state.sykepengesoknader.data = [fremtidigSoknad1];
            const component = getComponent(state, ownProps);
            expect(component.text()).to.contain(ledetekster['sykmelding.kvittering.sok-senere.steg-2.tittel-3']);
        });

        it('Skal vise riktig kvittering hvis det finnes nye søknader som tilhører denne sykmeldingen', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.SENDT,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
            });
            state.dineSykmeldinger.data = [sykmelding];
            state.sykepengesoknader.data = [nySoknad4];
            const component = getComponent(state, ownProps);
            expect(component.text()).to.contain(ledetekster['sykmelding.kvittering.sok-na.steg-1.tittel-2']);
            expect(component.html()).to.contain(ledetekster['sykmelding.kvittering.sok-na.steg-1.tekst-2']);
        });
    });

    describe('TIL_SENDING sykmelding', () => {
        it('Skal vise standard sendt-kvittering hvis det ikke finnes søknader for denne sykmeldingen', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.TIL_SENDING,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
            });
            state.sykepengesoknader.data = [];
            state.dineSykmeldinger.data = [sykmelding];
            skalViseStandardSendtKvittering(state, ownProps);
        });

        it('Skal vise standard sendt-kvittering hvis det finnes søknader som ikke tilhører denne sykmeldingen', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.TIL_SENDING,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
            });
            state.dineSykmeldinger.data = [sykmelding];
            state.sykepengesoknader.data = [nySoknad2];
            skalViseStandardSendtKvittering(state, ownProps);
        });

        it('Skal vise riktig kvittering hvis det finnes fremtidige søknader som tlhører denne sykmeldingen', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.TIL_SENDING,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
            });
            state.dineSykmeldinger.data = [sykmelding];
            state.sykepengesoknader.data = [fremtidigSoknad1];
            const component = getComponent(state, ownProps);
            expect(component.text()).to.contain(ledetekster['sykmelding.kvittering.sok-senere.steg-2.tittel-3']);
        });

        it('Skal vise riktig kvittering hvis det finnes nye søknader som tlhører denne sykmeldingen', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.TIL_SENDING,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
            });
            state.dineSykmeldinger.data = [sykmelding];
            state.sykepengesoknader.data = [nySoknad4];
            const component = getComponent(state, ownProps);
            expect(component.text()).to.contain(ledetekster['sykmelding.kvittering.sok-na.steg-1.tittel-2']);
            expect(component.html()).to.contain(ledetekster['sykmelding.kvittering.sok-na.steg-1.tekst-2']);
        });
    });

    describe('BEKREFTET sykmelding for arbeidstakere', () => {
        it('Skal vise riktig kvittering hvis arbeidssituasjon er ARBEIDSTAKER', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.BEKREFTET,
                valgtArbeidssituasjon: arbeidssituasjoner.ARBEIDSTAKER,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
            });
            state.sykepengesoknader.data = [];
            state.dineSykmeldinger.data = [sykmelding];
            const component = getComponent(state, ownProps);
            expect(component.text()).to.contain(ledetekster['bekreft-sykmelding.arbeidstaker-uten-arbeidsgiver.kvittering.tittel']);
            expect(component.html()).to.contain(ledetekster['bekreft-sykmelding.arbeidstaker-uten-arbeidsgiver.kvittering.undertekst']);
        });

        it('Skal vise riktig kvittering hvis arbeidssituasjon er ARBEIDSTAKER og bruker har strengt fortrolig adresse', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.BEKREFTET,
                valgtArbeidssituasjon: arbeidssituasjoner.ARBEIDSTAKER,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
            });
            state.brukerinfo.bruker.data.strengtFortroligAdresse = true;
            state.sykepengesoknader.data = [];
            state.dineSykmeldinger.data = [sykmelding];
            const component = getComponent(state, ownProps);
            expect(component.text()).to.contain(ledetekster['bekreft-sykmelding.arbeidstaker-uten-arbeidsgiver.kvittering.tittel']);
            expect(component.html()).to.contain(ledetekster['bekreft-sykmelding.skjermingskode-6.kvittering.undertekst']);
        });
    });

    describe('BEKREFTET sykmelding for frilansere', () => {
        const skalViseInfoOmAtBrukerKanSoke = (_state, _ownProps) => {
            const component = getComponent(_state, _ownProps);
            expect(component.text()).to.contain(ledetekster['bekreft-sykmelding.skal-opprettes-soknad.steg-1.tittel']);
            expect(component.text()).to.contain(ledetekster['bekreft-sykmelding.skal-opprettes-soknad.steg-2.tittel']);
            expect(component.html()).to.contain(ledetekster['bekreft-sykmelding.skal-opprettes-soknad.steg-2.tekst']);
            expect(component.find(FrilanserMedPapirsoknadKvittering)).to.have.length(1);
        };

        it('Skal vise standard bekreftet-kvittering om sykmeldingen er avventende', () => {
            state.sykepengesoknader.data = [];
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.BEKREFTET,
                valgtArbeidssituasjon: arbeidssituasjoner.FRILANSER,
                mulighetForArbeid: {
                    perioder: [{
                        avventende: 'Trenger en bedre stol',
                    }],
                },
            });
            state.sykmeldingMeta['1'] = {
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
            };
            state.dineSykmeldinger.data = [sykmelding];
            skalViseStandardBekreftetKvittering(state, ownProps);
        });

        it('Skal vise standard bekreftet-kvittering om sykmeldingen har reisetilskudd', () => {
            state.sykepengesoknader.data = [];
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.BEKREFTET,
                valgtArbeidssituasjon: arbeidssituasjoner.FRILANSER,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
                mulighetForArbeid: {
                    perioder: [{
                        reisetilskudd: true,
                    }],
                },
            });
            state.dineSykmeldinger.data = [sykmelding];
            skalViseStandardBekreftetKvittering(state, ownProps);
        });

        it('Skal vise standard bekreftet-kvittering om sykmeldingen har behandlingsdager', () => {
            state.sykepengesoknader.data = [];
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.BEKREFTET,
                valgtArbeidssituasjon: arbeidssituasjoner.FRILANSER,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
                mulighetForArbeid: {
                    perioder: [{
                        behandlingsdager: 4,
                    }],
                },
            });
            state.dineSykmeldinger.data = [sykmelding];
            skalViseStandardBekreftetKvittering(state, ownProps);
        });

        describe('Når sykmeldingen er utenfor ventetid', () => {
            it('Skal uansett vise info om at bruker kan søke om sykepenger', () => {
                state.sykepengesoknader.data = [];
                const sykmelding = getSykmelding({
                    id: '1',
                    status: sykmeldingstatuser.BEKREFTET,
                    valgtArbeidssituasjon: arbeidssituasjoner.FRILANSER,
                    erUtenforVentetid: true,
                    skalOppretteSoknad: false,
                    mulighetForArbeid: {
                        perioder: [{
                            fom: new Date('2018-02-02'),
                            tom: new Date('2018-02-20'),
                        }],
                    },
                });
                state.dineSykmeldinger.data = [sykmelding];
                state.sykmeldingMeta['1'] = {
                    erUtenforVentetid: true,
                    skalOppretteSoknad: false,
                };
                skalViseInfoOmAtBrukerKanSoke(state, ownProps);
            });

            it('Skal uansett vise info om at bruker kan søke om sykepenger', () => {
                state.sykepengesoknader.data = [];
                const sykmelding = getSykmelding({
                    id: '1',
                    status: sykmeldingstatuser.BEKREFTET,
                    valgtArbeidssituasjon: arbeidssituasjoner.FRILANSER,
                    mulighetForArbeid: {
                        perioder: [{
                            fom: new Date('2018-02-02'),
                            tom: new Date('2018-02-20'),
                        }],
                    },
                });
                state.dineSykmeldinger.data = [sykmelding];
                state.sykmeldingMeta['1'] = {
                    erUtenforVentetid: true,
                    skalOppretteSoknad: true,
                };
                skalViseInfoOmAtBrukerKanSoke(state, ownProps);
            });
        });

        describe('Når sykmeldingen er innenfor ventetid', () => {
            it('Skal vise info om at bruker ikke trenger å søke hvis skalOppretteSoknad === false', () => {
                state.sykepengesoknader.data = [];
                const sykmelding = getSykmelding({
                    id: '1',
                    status: sykmeldingstatuser.BEKREFTET,
                    valgtArbeidssituasjon: arbeidssituasjoner.FRILANSER,
                    mulighetForArbeid: {
                        perioder: [{
                            fom: new Date('2018-02-02'),
                            tom: new Date('2018-02-20'),
                        }],
                    },
                });
                state.dineSykmeldinger.data = [sykmelding];
                state.sykmeldingMeta['1'] = {
                    erUtenforVentetid: false,
                    skalOppretteSoknad: false,
                };
                const component = getComponent(state, ownProps);
                expect(component.text()).to.contain(ledetekster['bekreft-sykmelding.skal-ikke-opprettes-soknad.kvittering.tittel']);
                expect(component.html()).to.contain(ledetekster['bekreft-sykmelding.skal-ikke-opprettes-soknad.kvittering.undertekst']);
                expect(component.find(FrilanserMedPapirsoknadKvittering)).to.have.length(0);
                expect(component.find(FrilanserUtenSoknadKvittering)).to.have.length(1);
            });

            it('Skal vise info om at bruker kan søke hvis skalOppretteSoknad === true', () => {
                state.sykepengesoknader.data = [];
                const sykmelding = getSykmelding({
                    id: '1',
                    status: sykmeldingstatuser.BEKREFTET,
                    valgtArbeidssituasjon: arbeidssituasjoner.FRILANSER,
                    mulighetForArbeid: {
                        perioder: [{
                            fom: new Date('2018-02-02'),
                            tom: new Date('2018-02-20'),
                        }],
                    },
                });
                state.sykmeldingMeta['1'] = {
                    erUtenforVentetid: false,
                    skalOppretteSoknad: true,
                };
                state.dineSykmeldinger.data = [sykmelding];
                skalViseInfoOmAtBrukerKanSoke(state, ownProps);
            });
        });
    });

    describe('BEKREFTET sykmelding for annet', () => {
        it('Skal vise standard sendt-kvittering', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.BEKREFTET,
                valgtArbeidssituasjon: arbeidssituasjoner.ANNET,
                erUtenforVentetid: false,
            });
            state.sykepengesoknader.data = [];
            state.dineSykmeldinger.data = [sykmelding];
            skalViseStandardBekreftetKvittering(state, ownProps);
        });
    });

    describe('BEKREFTET sykmelding for arbeidsledig', () => {
        it('Skal vise standard sendt-kvittering', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.BEKREFTET,
                valgtArbeidssituasjon: arbeidssituasjoner.ARBEIDSLEDIG,
                erUtenforVentetid: false,
            });
            state.sykepengesoknader.data = [];
            state.dineSykmeldinger.data = [sykmelding];
            skalViseStandardBekreftetKvittering(state, ownProps);
        });
    });

    describe('AVBRUTT sykmelding', () => {
        it('Skal vise riktig kvittering', () => {
            const sykmelding = getSykmelding({
                id: '1',
                status: sykmeldingstatuser.AVBRUTT,
                erUtenforVentetid: true,
                skalOppretteSoknad: true,
            });
            state.sykepengesoknader.data = [];
            state.dineSykmeldinger.data = [sykmelding];
            const component = getComponent(state, ownProps);
            expect(component.text()).to.contain(ledetekster['avbryt-sykmelding.kvittering.tittel']);
            expect(component.html()).to.contain(ledetekster['avbryt-sykmelding.kvittering.undertekst']);
        });
    });

    describe('mapStateToProps', () => {
        it('Skal returnere fremtidige soknader', () => {
            const res = mapStateToProps(state, ownProps);
            expect(res.sykepengesoknader).to.deep.equal([fremtidigSoknad1]);
        });

        it('Skal returnere henter === true dersom sykmeldinger hentes', () => {
            state.dineSykmeldinger.henter = true;

            const res = mapStateToProps(state, ownProps);
            expect(res.henter).to.equal(true);
        });

        it('Skal returnere henter === true dersom ledetekster hentes', () => {
            state.ledetekster.henter = true;
            const res = mapStateToProps(state, ownProps);
            expect(res.henter).to.equal(true);
        });

        it('Skal returnere henter === true dersom sykepengesoknader hentes', () => {
            state.sykepengesoknader.henter = true;
            const res = mapStateToProps(state, ownProps);
            expect(res.henter).to.equal(true);
        });

        it('Skal returnere sykmelding === undefined dersom sykmeldingen ikke finnes', () => {
            ownProps.params = {
                sykmeldingId: 'Ukjent_ID',
            };
            const res = mapStateToProps(state, ownProps);
            expect(res.sykmelding).to.equal(undefined);
        });

        it('Skal returnere feil dersom det oppstår en feil med sykmeldinger', () => {
            state.dineSykmeldinger.hentingFeilet = true;
            const res = mapStateToProps(state, ownProps);
            expect(res.hentingFeilet).to.equal(true);
        });

        it('Skal returnere feil dersom det oppstår en feil med ledetekster', () => {
            state.ledetekster.hentingFeilet = true;
            const res = mapStateToProps(state, ownProps);
            expect(res.hentingFeilet).to.equal(true);
        });
    });
});

