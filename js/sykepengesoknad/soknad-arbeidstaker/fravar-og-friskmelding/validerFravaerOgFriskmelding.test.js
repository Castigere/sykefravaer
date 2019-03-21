import chai from 'chai';
import { setLedetekster } from '@navikt/digisyfo-npm';
import validerFravaerOgFriskmelding from './validerFravaerOgFriskmelding';

const expect = chai.expect;

describe.only('validerFravaerOgFriskmelding', () => {
    it.only('Skal validere', () => {
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
                }, {
                    id: '45961',
                    tag: 'FERIE_PERMISJON_UTLAND',
                    sporsmalstekst: 'Har du hatt ferie, permisjon eller oppholdt deg utenfor Norge i perioden 3. - 11. februar 2019?',
                    undertekst: null,
                    svartype: 'JA_NEI',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: true,
                    kriterieForVisningAvUndersporsmal: 'JA',
                    svar: [],
                    undersporsmal: [{
                        id: '93240',
                        tag: 'FERIE_PERMISJON_UTLAND_HVA',
                        sporsmalstekst: 'Kryss av alt som gjelder deg:',
                        undertekst: null,
                        svartype: 'CHECKBOX_GRUPPE',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: true,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [{
                            id: '87460',
                            tag: 'FERIE',
                            sporsmalstekst: 'Jeg tok ut ferie',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: true,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '82215',
                                tag: 'FERIE_NAR',
                                sporsmalstekst: null,
                                undertekst: null,
                                svartype: 'PERIODER',
                                min: '2019-02-03T00:00:00.000Z',
                                max: '2019-02-11T00:00:00.000Z',
                                pavirkerAndreSporsmal: true,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }, {
                            id: '57731',
                            tag: 'PERMISJON',
                            sporsmalstekst: 'Jeg hadde permisjon',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '10653',
                                tag: 'PERMISJON_NAR',
                                sporsmalstekst: null,
                                undertekst: null,
                                svartype: 'PERIODER',
                                min: '2019-02-03T00:00:00.000Z',
                                max: '2019-02-11T00:00:00.000Z',
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }, {
                            id: '98860',
                            tag: 'UTLAND',
                            sporsmalstekst: 'Jeg var utenfor Norge',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: true,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '73668',
                                tag: 'UTLAND_NAR',
                                sporsmalstekst: null,
                                undertekst: null,
                                svartype: 'PERIODER',
                                min: '2019-02-03T00:00:00.000Z',
                                max: '2019-02-11T00:00:00.000Z',
                                pavirkerAndreSporsmal: true,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }, {
                                id: '98098',
                                tag: 'UTLANDSOPPHOLD_SOKT_SYKEPENGER',
                                sporsmalstekst: 'Har du søkt om å beholde sykepenger under dette oppholdet utenfor Norge?',
                                undertekst: null,
                                svartype: 'JA_NEI',
                                min: null,
                                max: null,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }],
                    }],
                }, {
                    id: '39097',
                    tag: 'ANDRE_INNTEKTSKILDER',
                    sporsmalstekst: 'Har du andre inntektskilder, eller jobber du for andre enn TESTBEDRIFT AS?',
                    undertekst: null,
                    svartype: 'JA_NEI',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: 'JA',
                    svar: [],
                    undersporsmal: [{
                        id: '73886',
                        tag: 'HVILKE_ANDRE_INNTEKTSKILDER',
                        sporsmalstekst: 'Hvilke andre inntektskilder har du?',
                        undertekst: 'Du trenger ikke oppgi andre ytelser fra NAV',
                        svartype: 'CHECKBOX_GRUPPE',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [{
                            id: '15649',
                            tag: 'INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD',
                            sporsmalstekst: 'Andre arbeidsforhold',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '75118',
                                tag: 'INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD_ER_DU_SYKMELDT',
                                sporsmalstekst: 'Er du sykmeldt fra dette?',
                                undertekst: null,
                                svartype: 'JA_NEI',
                                min: null,
                                max: null,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }, {
                            id: '53881',
                            tag: 'INNTEKTSKILDE_SELVSTENDIG',
                            sporsmalstekst: 'Selvstendig næringsdrivende',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '53627',
                                tag: 'INNTEKTSKILDE_SELVSTENDIG_ER_DU_SYKMELDT',
                                sporsmalstekst: 'Er du sykmeldt fra dette?',
                                undertekst: null,
                                svartype: 'JA_NEI',
                                min: null,
                                max: null,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }, {
                            id: '44506',
                            tag: 'INNTEKTSKILDE_SELVSTENDIG_DAGMAMMA',
                            sporsmalstekst: 'Selvstendig næringsdrivende dagmamma',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '69162',
                                tag: 'INNTEKTSKILDE_SELVSTENDIG_DAGMAMMA_ER_DU_SYKMELDT',
                                sporsmalstekst: 'Er du sykmeldt fra dette?',
                                undertekst: null,
                                svartype: 'JA_NEI',
                                min: null,
                                max: null,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }, {
                            id: '70948',
                            tag: 'INNTEKTSKILDE_JORDBRUKER',
                            sporsmalstekst: 'Jordbruker / Fisker / Reindriftsutøver',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '38333',
                                tag: 'INNTEKTSKILDE_JORDBRUKER_ER_DU_SYKMELDT',
                                sporsmalstekst: 'Er du sykmeldt fra dette?',
                                undertekst: null,
                                svartype: 'JA_NEI',
                                min: null,
                                max: null,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }, {
                            id: '57373',
                            tag: 'INNTEKTSKILDE_FRILANSER',
                            sporsmalstekst: 'Frilanser',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: 'CHECKED',
                            svar: [],
                            undersporsmal: [{
                                id: '51810',
                                tag: 'INNTEKTSKILDE_FRILANSER_ER_DU_SYKMELDT',
                                sporsmalstekst: 'Er du sykmeldt fra dette?',
                                undertekst: null,
                                svartype: 'JA_NEI',
                                min: null,
                                max: null,
                                pavirkerAndreSporsmal: false,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            }],
                        }, {
                            id: '95686',
                            tag: 'INNTEKTSKILDE_ANNET',
                            sporsmalstekst: 'Annet',
                            undertekst: null,
                            svartype: 'CHECKBOX',
                            min: null,
                            max: null,
                            pavirkerAndreSporsmal: false,
                            kriterieForVisningAvUndersporsmal: null,
                            svar: [],
                            undersporsmal: [],
                        }],
                    }],
                }, {
                    id: '86660',
                    tag: 'UTDANNING',
                    sporsmalstekst: 'Har du vært under utdanning i løpet av perioden 3. - 11. februar 2019?',
                    undertekst: null,
                    svartype: 'JA_NEI',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: 'JA',
                    svar: [],
                    undersporsmal: [{
                        id: '15958',
                        tag: 'UTDANNING_START',
                        sporsmalstekst: 'Når startet du på utdanningen?',
                        undertekst: null,
                        svartype: 'DATO',
                        min: null,
                        max: '2019-02-11T00:00:00.000Z',
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    }, {
                        id: '80689',
                        tag: 'FULLTIDSSTUDIUM',
                        sporsmalstekst: 'Er utdanningen et fulltidsstudium?',
                        undertekst: null,
                        svartype: 'JA_NEI',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    }],
                }, {
                    id: '3420',
                    tag: 'VAER_KLAR_OVER_AT',
                    sporsmalstekst: 'Vær klar over at:',
                    undertekst: '<ul><li>rett til sykepenger forutsetter at du er borte fra arbeid på grunn av egen sykdom. Sosiale eller økonomiske problemer gir ikke rett til sykepenger</li><li>du kan miste retten til sykepenger hvis du uten rimelig grunn nekter å opplyse om egen funksjonsevne eller nekter å ta imot tilbud om behandling og/eller tilrettelegging</li><li>sykepenger utbetales i maksimum 52 uker, også for gradert (delvis) sykmelding</li><li>fristen for å søke sykepenger er som hovedregel 3 måneder</li></ul>',
                    svartype: 'IKKE_RELEVANT',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [],
                    undersporsmal: [],
                }, {
                    id: '55470',
                    tag: 'BEKREFT_OPPLYSNINGER',
                    sporsmalstekst: 'Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.',
                    undertekst: null,
                    svartype: 'CHECKBOX_PANEL',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [],
                    undersporsmal: [],
                }, {
                    id: '74668',
                    tag: 'BETALER_ARBEIDSGIVER',
                    sporsmalstekst: 'Betaler arbeidsgiveren lønnen din når du er syk?',
                    undertekst: null,
                    svartype: 'RADIO_GRUPPE',
                    min: null,
                    max: null,
                    pavirkerAndreSporsmal: false,
                    kriterieForVisningAvUndersporsmal: null,
                    svar: [],
                    undersporsmal: [{
                        id: '64781',
                        tag: 'BETALER_ARBEIDSGIVER_JA',
                        sporsmalstekst: 'Ja',
                        undertekst: 'Arbeidsgiveren din mottar kopi av søknaden du sender til NAV.',
                        svartype: 'RADIO',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    }, {
                        id: '59504',
                        tag: 'BETALER_ARBEIDSGIVER_NEI',
                        sporsmalstekst: 'Nei',
                        undertekst: 'Søknaden sendes til NAV. Arbeidsgiveren din får ikke kopi.',
                        svartype: 'RADIO',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    }, {
                        id: '71005',
                        tag: 'BETALER_ARBEIDSGIVER_VET_IKKE',
                        sporsmalstekst: 'Vet ikke',
                        undertekst: 'Siden du ikke vet svaret på dette spørsmålet, vil arbeidsgiveren din motta en kopi av søknaden du sender til NAV.',
                        svartype: 'RADIO',
                        min: null,
                        max: null,
                        pavirkerAndreSporsmal: false,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    }],
                }],
            },
        };
        const feilmeldinger = validerFravaerOgFriskmelding(values, props);
        console.log(feilmeldinger)
    });
});