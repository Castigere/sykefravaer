import chai from 'chai';
import { setLedetekster } from '@navikt/digisyfo-npm';
import validerFravaerOgFriskmelding from './validerFravaerOgFriskmelding';

const expect = chai.expect;

describe('validerFravaerOgFriskmelding', () => {
    beforeEach(() => {
        setLedetekster({
            'soknad.feilmelding.hvor_mye_prosent_verdi': 'Du må svare på hvor mye du jobbet totalt',
            'soknad.feilmelding.tall-min-max': 'Vennligst fyll ut et tall mellom %MIN% og %MAX%',
        });
    });

    it('Skal sjekke at underspørsmål av svartypen TALL har en verdi', () => {
        const values = {
            ANSVARSERKLARING: { svarverdier: [{ verdi: 'CHECKED' }] },
            EGENMELDINGER: { svarverdier: [{ verdi: 'NEI' }] },
            EGENMELDINGER_NAR: [{}],
            TILBAKE_I_ARBEID: { svarverdier: [{ verdi: 'NEI' }] },
            JOBBET_DU_100_PROSENT_0: { svarverdier: [{ verdi: 'JA' }] },
            HVOR_MANGE_TIMER_PER_UKE_0: { svarverdier: [{ verdi: '66' }] },
            HVOR_MYE_HAR_DU_JOBBET_0: { svarverdier: [{ verdi: 'prosent' }] },
            HVOR_MYE_PROSENT_0: { svarverdier: [{ verdi: 'CHECKED' }] },
            FERIE_NAR: [{}],
            PERMISJON_NAR: [{}],
            UTLAND_NAR: [{}],
            BETALER_ARBEIDSGIVER: null,
        };
        const props = {
            soknad: {
                id: '05cf3a4a-16b1-4cd7-8096-de03964f5295',
                aktorId: '1328256131648',
                sykmeldingId: '460e8015-0a06-43e9-b53d-8870fe3dd18c',
                soknadstype: 'ARBEIDSTAKERE',
                status: 'NY',
                fom: '2019-02-03T00:00:00.000Z',
                tom: '2019-02-11T00:00:00.000Z',
                opprettetDato: '2019-02-12T00:00:00.000Z',
                innsendtDato: null,
                sendtTilNAVDato: null,
                sendtTilArbeidsgiverDato: null,
                avbruttDato: null,
                startSykeforlop: '2019-02-03',
                sykmeldingUtskrevet: '2019-02-03',
                arbeidsgiver: { navn: 'TESTBEDRIFT AS', orgnummer: '974600951' },
                korrigerer: null,
                korrigertAv: null,
                arbeidssituasjon: 'ARBEIDSTAKER',
                soknadPerioder: [{ fom: '2019-02-03', tom: '2019-02-11', grad: 100 }],
                sporsmal: [{
                    id: '2694',
                    tag: 'JOBBET_DU_100_PROSENT_0',
                    sporsmalstekst: 'I perioden 3. - 11. februar 2019 var du 100 % sykmeldt fra TESTBEDRIFT AS. Jobbet du noe i denne perioden?',
                    undertekst: null,
                    svartype: 'JA_NEI',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: 'JA',
                    svar: [{ verdi: 'JA' }],
                    undersporsmal: [{
                        id: '79248',
                        tag: 'HVOR_MANGE_TIMER_PER_UKE_0',
                        sporsmalstekst: 'Hvor mange timer jobbet du per uke før du ble sykmeldt?',
                        undertekst: 'timer per uke',
                        svartype: 'TALL',
                        min: 1,
                        max: 150,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [{ verdi: '66' }],
                        undersporsmal: [],
                    }, {
                        id: '21272',
                        tag: 'HVOR_MYE_HAR_DU_JOBBET_0',
                        sporsmalstekst: 'Hvor mye jobbet du totalt 3. - 11. februar 2019 hos TESTBEDRIFT AS?',
                        undertekst: null,
                        svartype: 'RADIO_GRUPPE_TIMER_PROSENT',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [{
                            id: '86611',
                            tag: 'HVOR_MYE_PROSENT_0',
                            sporsmalstekst: 'prosent',
                            undertekst: null,
                            svartype: 'RADIO',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [{ verdi: 'CHECKED' }],
                            undersporsmal: [{
                                id: '29369',
                                tag: 'HVOR_MYE_PROSENT_VERDI_0',
                                sporsmalstekst: null,
                                undertekst: 'prosent',
                                svartype: 'TALL',
                                min: 1,
                                max: 99,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }, {
                            id: '82845',
                            tag: 'HVOR_MYE_TIMER_0',
                            sporsmalstekst: 'timer',
                            undertekst: null,
                            svartype: 'RADIO',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '50523',
                                tag: 'HVOR_MYE_TIMER_VERDI_0',
                                sporsmalstekst: null,
                                undertekst: 'timer totalt',
                                svartype: 'TALL',
                                min: 1,
                                max: 193,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }],
                    }],
                }],
            },
        };
        const feilmeldinger = validerFravaerOgFriskmelding(values, props);
        expect(feilmeldinger.HVOR_MYE_PROSENT_VERDI_0).to.equal('Du må svare på hvor mye du jobbet totalt');
    });

    it('Skal sjekke at underspørsmål av svartypen TALL har en verdi som er innenfor min/max', () => {
        const values = {
            ANSVARSERKLARING: { svarverdier: [{ verdi: 'CHECKED' }] },
            EGENMELDINGER: { svarverdier: [{ verdi: 'NEI' }] },
            EGENMELDINGER_NAR: [{}],
            TILBAKE_I_ARBEID: { svarverdier: [{ verdi: 'NEI' }] },
            JOBBET_DU_100_PROSENT_0: { svarverdier: [{ verdi: 'JA' }] },
            HVOR_MANGE_TIMER_PER_UKE_0: { svarverdier: [{ verdi: '66' }] },
            HVOR_MYE_HAR_DU_JOBBET_0: { svarverdier: [{ verdi: 'prosent' }] },
            HVOR_MYE_PROSENT_0: { svarverdier: [{ verdi: 'CHECKED' }] },
            HVOR_MYE_PROSENT_VERDI_0: { svarverdier: [{ verdi: '500,5' }] },
            FERIE_NAR: [{}],
            PERMISJON_NAR: [{}],
            UTLAND_NAR: [{}],
            BETALER_ARBEIDSGIVER: null,
        };
        const props = {
            soknad: {
                id: '05cf3a4a-16b1-4cd7-8096-de03964f5295',
                aktorId: '1328256131648',
                sykmeldingId: '460e8015-0a06-43e9-b53d-8870fe3dd18c',
                soknadstype: 'ARBEIDSTAKERE',
                status: 'NY',
                fom: '2019-02-03T00:00:00.000Z',
                tom: '2019-02-11T00:00:00.000Z',
                opprettetDato: '2019-02-12T00:00:00.000Z',
                innsendtDato: null,
                sendtTilNAVDato: null,
                sendtTilArbeidsgiverDato: null,
                avbruttDato: null,
                startSykeforlop: '2019-02-03',
                sykmeldingUtskrevet: '2019-02-03',
                arbeidsgiver: { navn: 'TESTBEDRIFT AS', orgnummer: '974600951' },
                korrigerer: null,
                korrigertAv: null,
                arbeidssituasjon: 'ARBEIDSTAKER',
                soknadPerioder: [{ fom: '2019-02-03', tom: '2019-02-11', grad: 100 }],
                sporsmal: [{
                    id: '2694',
                    tag: 'JOBBET_DU_100_PROSENT_0',
                    sporsmalstekst: 'I perioden 3. - 11. februar 2019 var du 100 % sykmeldt fra TESTBEDRIFT AS. Jobbet du noe i denne perioden?',
                    undertekst: null,
                    svartype: 'JA_NEI',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: 'JA',
                    svar: [{ verdi: 'JA' }],
                    undersporsmal: [{
                        id: '79248',
                        tag: 'HVOR_MANGE_TIMER_PER_UKE_0',
                        sporsmalstekst: 'Hvor mange timer jobbet du per uke før du ble sykmeldt?',
                        undertekst: 'timer per uke',
                        svartype: 'TALL',
                        min: 1,
                        max: 150,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [{ verdi: '37,5' }],
                        undersporsmal: [],
                    }, {
                        id: '21272',
                        tag: 'HVOR_MYE_HAR_DU_JOBBET_0',
                        sporsmalstekst: 'Hvor mye jobbet du totalt 3. - 11. februar 2019 hos TESTBEDRIFT AS?',
                        undertekst: null,
                        svartype: 'RADIO_GRUPPE_TIMER_PROSENT',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [{
                            id: '86611',
                            tag: 'HVOR_MYE_PROSENT_0',
                            sporsmalstekst: 'prosent',
                            undertekst: null,
                            svartype: 'RADIO',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [{ verdi: 'CHECKED' }],
                            undersporsmal: [{
                                id: '29369',
                                tag: 'HVOR_MYE_PROSENT_VERDI_0',
                                sporsmalstekst: null,
                                undertekst: 'prosent',
                                svartype: 'TALL',
                                min: 1,
                                max: 99,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }, {
                            id: '82845',
                            tag: 'HVOR_MYE_TIMER_0',
                            sporsmalstekst: 'timer',
                            undertekst: null,
                            svartype: 'RADIO',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '50523',
                                tag: 'HVOR_MYE_TIMER_VERDI_0',
                                sporsmalstekst: null,
                                undertekst: 'timer totalt',
                                svartype: 'TALL',
                                min: 1,
                                max: 193,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }],
                    }],
                }],
            },
        };
        const feilmeldinger = validerFravaerOgFriskmelding(values, props);
        expect(feilmeldinger.HVOR_MYE_PROSENT_VERDI_0).to.equal('Vennligst fyll ut et tall mellom 1 og 99');
    });
});
