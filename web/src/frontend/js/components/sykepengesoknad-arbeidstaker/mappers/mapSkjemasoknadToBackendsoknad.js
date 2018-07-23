import { fraInputdatoTilJSDato } from 'digisyfo-npm';
import { visSoktOmSykepengerUtenlandsoppholdsporsmal } from '../FravaerOgFriskmelding/SoktOmSykepengerIUtenlandsopphold';
import { getStillingsprosent } from '../AktiviteterISykmeldingsperioden/DetteTilsvarer';

const parsePerioder = (perioder) => {
    return perioder.map((periode) => {
        return {
            fom: fraInputdatoTilJSDato(periode.fom),
            tom: fraInputdatoTilJSDato(periode.tom),
        };
    });
};

const parseInntektskilder = (inntektskilder) => {
    return inntektskilder.filter((i) => {
        return i.avkrysset;
    }).map((i) => {
        return {
            annenInntektskildeType: i.annenInntektskildeType,
            sykmeldt: i.sykmeldt,
        };
    });
};

const getUtenlandsopphold = (soknad) => {
    const utenlandsopphold = soknad.utenlandsopphold;
    const perioder = parsePerioder(utenlandsopphold.perioder);

    return visSoktOmSykepengerUtenlandsoppholdsporsmal(soknad)
        ? {
            soektOmSykepengerIPerioden: utenlandsopphold.soektOmSykepengerIPerioden,
            perioder,
        }
        : {
            perioder,
        };
};

const getUtdanning = (utdanning) => {
    if (utdanning.underUtdanningISykmeldingsperioden) {
        return {
            utdanningStartdato: fraInputdatoTilJSDato(utdanning.utdanningStartdato),
            erUtdanningFulltidsstudium: utdanning.erUtdanningFulltidsstudium,
        };
    }
    return null;
};

const tilInt = (streng) => {
    if (!streng) {
        return undefined;
    }
    if (typeof streng === 'number') {
        return streng;
    }
    return parseFloat(streng.replace(',', '.'));
};

const getAktiviteter = (aktiviteter, ferieOgPermisjonPerioder) => {
    return aktiviteter.map((aktivitet) => {
        const _a = {
            periode: aktivitet.periode,
            grad: aktivitet.grad,
            id: aktivitet.id,
        };
        if (aktivitet.jobbetMerEnnPlanlagt) {
            _a.avvik = {
                arbeidstimerNormalUke: tilInt(aktivitet.avvik.arbeidstimerNormalUke),
            };
            if (aktivitet.avvik.enhet === 'timer') {
                const stillingsprosent = getStillingsprosent(
                    aktivitet.avvik.timer,
                    aktivitet.avvik.arbeidstimerNormalUke,
                    aktivitet.periode,
                    ferieOgPermisjonPerioder);
                _a.avvik.timer = tilInt(aktivitet.avvik.timer);
                _a.avvik.beregnetArbeidsgrad = stillingsprosent;
            } else {
                _a.avvik.arbeidsgrad = tilInt(aktivitet.avvik.arbeidsgrad);
            }
        } else {
            _a.avvik = null;
        }
        return _a;
    });
};

const frontendProps = [
    'bruktEgenmeldingsdagerFoerLegemeldtFravaer',
    'harGjenopptattArbeidFulltUt',
    'harHattFeriePermisjonEllerUtenlandsopphold',
    'harHattFerie',
    'harHattPermisjon',
    'harHattUtenlandsopphold',
    'utenlandsoppholdSoktOmSykepenger',
    'harAndreInntektskilder',
    'oppfoelgingsdato',
    '_erPreutfylt',
    '_erOppdelt',
];

const mapSkjemasoknadToBackendsoknad = (soknad, alternativer = {}) => {
    const harHattPermisjon = soknad.harHattFeriePermisjonEllerUtenlandsopphold && soknad.harHattPermisjon;
    const harHattFerie = soknad.harHattFeriePermisjonEllerUtenlandsopphold && soknad.harHattFerie;
    const harHattUtenlandsopphold = soknad.harHattFeriePermisjonEllerUtenlandsopphold && soknad.harHattUtenlandsopphold;

    const permisjon = harHattPermisjon ? soknad.permisjon : [];
    const ferie = harHattFerie ? soknad.ferie : [];
    const utenlandsopphold = harHattUtenlandsopphold ? getUtenlandsopphold(soknad) : null;
    const permisjonperioder = parsePerioder(permisjon);
    const ferieperioder = parsePerioder(ferie);
    const ferieOgPermisjonPerioder = [...ferieperioder, ...permisjonperioder];

    const backendSoknad = {
        ...soknad,
        permisjon: permisjonperioder,
        ferie: ferieperioder,
        utenlandsopphold,
        andreInntektskilder: parseInntektskilder(soknad.andreInntektskilder),
        gjenopptattArbeidFulltUtDato: soknad.harGjenopptattArbeidFulltUt ? fraInputdatoTilJSDato(soknad.gjenopptattArbeidFulltUtDato) : null,
        egenmeldingsperioder: soknad.bruktEgenmeldingsdagerFoerLegemeldtFravaer ? parsePerioder(soknad.egenmeldingsperioder) : [],
        aktiviteter: getAktiviteter(soknad.aktiviteter, ferieOgPermisjonPerioder),
        utdanning: getUtdanning(soknad.utdanning),
    };

    if (!alternativer.visForskutteringssporsmal) {
        delete backendSoknad.arbeidsgiverForskutterer;
    }

    frontendProps.forEach((prop) => {
        delete backendSoknad[prop];
    });
    return backendSoknad;
};

export default mapSkjemasoknadToBackendsoknad;
