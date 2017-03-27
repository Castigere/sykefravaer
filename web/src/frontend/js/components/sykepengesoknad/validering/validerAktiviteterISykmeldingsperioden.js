import validerFoerDuBegynner from './validerFoerDuBegynner';
import validerFravaerOgFriskmelding from './validerFravaerOgFriskmelding';
import { ANNET } from '../AktiviteterISykmeldingsperioden/AndreInntektskilder';
import { fraInputdatoTilJSDato } from '../../../utils';
import { senesteTom } from '../../../utils/periodeUtils';
import { toDatePrettyPrint } from 'digisyfo-npm';

const parseString = (str) => {
    if (str) {
        return parseFloat(str.replace(',', '.'));
    }
    return null;
};

export const antallFeil = 'Vennligst oppgi antall';
export const normaltAntallFeil = 'Vennligst oppgi normalt antall';
export const ikkeJobbetMerEnnGraderingProsentFeil = 'Prosenten du har oppgitt er lavere enn sykmeldingsgraden. Husk å oppgi hvor mye du har jobbet totalt';
export const ikkeJobbetMerEnnGraderingTimerFeil = 'Antall timer du har oppgitt er lavere enn sykmeldingen tilsier. Husk å oppgi hvor mye du har jobbet totalt';
export const overHundreFeil = 'Du må oppgi et tall fra 1 til 100';
export const jobbetMerEnnPlanlagtFeil = 'Vennligst oppgi om du har jobbet mer enn planlagt';

const validerAktiviteter = (values, aktiviteter) => {

    const feil = aktiviteter.map((aktivitet, index) => {
        if (!values.aktiviteter || !values.aktiviteter[index]) {
            return {
                jobbetMerEnnPlanlagt: jobbetMerEnnPlanlagtFeil,
            };
        } else if (values.aktiviteter[index].jobbetMerEnnPlanlagt === false) {
            return {};
        }
        const jobbetMerEnnPlanlagt = values.aktiviteter[index].jobbetMerEnnPlanlagt !== undefined ? undefined : jobbetMerEnnPlanlagtFeil;

        const avvik = (() => {
            const res = {};

            if (values && values.aktiviteter[index] && values.aktiviteter[index].jobbetMerEnnPlanlagt) {
                if (values.aktiviteter[index].avvik) {
                    if (values.aktiviteter[index].avvik.enhet === 'prosent') {
                        if (values.aktiviteter[index].avvik.arbeidsgrad > 100) {
                            res.arbeidsgrad = overHundreFeil;
                        }
                        if (values.aktiviteter[index].avvik.arbeidsgrad <= (100 - values.aktiviteter[index].grad)) {
                            res.arbeidsgrad = ikkeJobbetMerEnnGraderingProsentFeil;
                        }
                        if (!values.aktiviteter[index].avvik.arbeidsgrad || values.aktiviteter[index].avvik.arbeidsgrad === '') {
                            res.arbeidsgrad = antallFeil;
                        }
                    } else if (values.aktiviteter[index].avvik.enhet === 'timer') {
                        if (values.aktiviteter[index].avvik.arbeidstimerNormalUke && parseString(values.aktiviteter[index].avvik.arbeidstimerNormalUke) > 0) {
                            if ((parseString(values.aktiviteter[index].avvik.timer) / parseString(values.aktiviteter[index].avvik.arbeidstimerNormalUke)) * 100
                                <= (100 - values.aktiviteter[index].grad)) {
                                res.timer = ikkeJobbetMerEnnGraderingTimerFeil;
                            }
                            if (parseString(values.aktiviteter[index].avvik.timer) > 100) {
                                res.timer = overHundreFeil
                            }
                        }
                        if (!values.aktiviteter[index].avvik.timer || values.aktiviteter[index].avvik.timer === '') {
                            res.timer = antallFeil;
                        }
                    }
                    // Nor
                    if (!values.aktiviteter[index].avvik.arbeidstimerNormalUke || values.aktiviteter[index].avvik.arbeidstimerNormalUke === '') {
                        res.arbeidstimerNormalUke = normaltAntallFeil;
                    } else if (values.aktiviteter[index].avvik.arbeidstimerNormalUke > 100) {
                        res.arbeidstimerNormalUke = overHundreFeil;
                    }
                } else {
                    res.arbeidsgrad = antallFeil;
                    res.arbeidstimerNormalUke = normaltAntallFeil;
                }
            }
            return res;
        })();

        const f = {};
        if (!values.aktiviteter[index].jobbetMerEnnPlanlagt) {
            f.jobbetMerEnnPlanlagt = jobbetMerEnnPlanlagt;
        }
        if (Object.keys(avvik).length > 0) {
            f.avvik = avvik;
        }
        return f;
    });

    const faktiskeFeil = feil.filter((f) => {
        return Object.keys(f).length > 0;
    });

    if (faktiskeFeil.length > 0) {
        return feil;
    }
    return undefined;
};

const getAntallAvkryssedeInntektstkilder = (inntektskilder = []) => {
    const avkryssede = [];
    for (const inntektskilde in inntektskilder) {
        if (inntektskilder[inntektskilde].avkrysset) {
            avkryssede.push(inntektskilde);
        }
    }
    return avkryssede.length;
};

const validate = (values, props) => {
    const feilmeldinger = {};
    if (Object.keys(validerFoerDuBegynner(values, props)).length > 0 || Object.keys(validerFravaerOgFriskmelding(values, props)).length) {
        props.sendTilFoerDuBegynner(props.sykepengesoknad);
    }

    const perioder = props.sykepengesoknad.aktiviteter.map((aktivitet) => {
        return aktivitet.periode;
    });
    const tomDato = senesteTom(perioder);

    if (values.harAndreInntektskilder === undefined) {
        feilmeldinger.harAndreInntektskilder = 'Du må svare på om du har andre inntektskilder';
    } else if (values.harAndreInntektskilder) {
        if (getAntallAvkryssedeInntektstkilder(values.andreInntektskilder) === 0) {
            feilmeldinger.andreInntektskilder = {
                _error: 'Vennligst oppgi hvilke andre inntektskilder du har',
            };
        } else {
            const andreInntektskilderFeilmeldinger = {};
            for (const inntektskilde in values.andreInntektskilder) {
                if (inntektskilde !== ANNET && values.andreInntektskilder[inntektskilde].avkrysset && values.andreInntektskilder[inntektskilde].sykmeldt === undefined) {
                    andreInntektskilderFeilmeldinger[inntektskilde] = {
                        sykmeldt: 'Vennligst svar på om du er sykmeldt',
                    };
                }
            }
            if (Object.keys(andreInntektskilderFeilmeldinger).length > 0) {
                feilmeldinger.andreInntektskilder = andreInntektskilderFeilmeldinger;
            }
        }
    }
    const utdanningsfeilmelding = {};
    if (values.utdanning === undefined || values.utdanning.underUtdanningISykmeldingsperioden === undefined) {
        utdanningsfeilmelding.underUtdanningISykmeldingsperioden = 'Vennligst svar på om du har vært under utdanning';
    } else if (values.utdanning.underUtdanningISykmeldingsperioden === true) {
        if (!values.utdanning.utdanningStartdato) {
            utdanningsfeilmelding.utdanningStartdato = 'Vennligst oppgi når du startet på utdanningen';
        }
        if (values.utdanning.erUtdanningFulltidsstudium === undefined) {
            utdanningsfeilmelding.erUtdanningFulltidsstudium = 'Vennligst svar på om utdanningen er et fulltidsstudium';
        }
        if (values.utdanning.utdanningStartdato && fraInputdatoTilJSDato(values.utdanning.utdanningStartdato) > tomDato) {
            utdanningsfeilmelding.utdanningStartdato = `Datoen kan ikke være etter sykmeldingsperioden gikk ut den ${toDatePrettyPrint(tomDato)}`;
        }
    }

    if (Object.keys(utdanningsfeilmelding).length > 0) {
        feilmeldinger.utdanning = utdanningsfeilmelding;
    }

    const aktivitetFeil = validerAktiviteter(values, props.sykepengesoknad.aktiviteter);
    if (aktivitetFeil) {
        feilmeldinger.aktiviteter = aktivitetFeil;
    }
    return feilmeldinger;
};

export default validate;
