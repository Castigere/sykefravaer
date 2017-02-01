import { fraInputdatoTilJSDato } from '../../utils';

const parsePerioder = (perioder) => {
    return perioder.map((periode) => {
        return {
            fom: fraInputdatoTilJSDato(periode.fom),
            tom: fraInputdatoTilJSDato(periode.tom),
        };
    });
};

const parseInntektskilder = (inntektskilder) => {
    if (Array.isArray(inntektskilder)) {
        return inntektskilder;
    }
    const a = [];
    for (const annenInntektskildeType in inntektskilder) {
        if (inntektskilder[annenInntektskildeType].avkrysset) {
            a.push({
                annenInntektskildeType,
                sykmeldt: inntektskilder[annenInntektskildeType].sykmeldt === true,
            });
        }
    }
    return a;
};

const getUtenlandsopphold = (utenlandsopphold) => {
    return {
        soektOmSykepengerIPerioden: utenlandsopphold.soektOmSykepengerIPerioden,
        perioder: parsePerioder(utenlandsopphold.perioder),
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

const getAktiviteter = (aktiviteter) => {
    return aktiviteter.map((aktivitet) => {
        const _aktivitet = aktivitet;
        if (!_aktivitet.jobbetMerEnnPlanlagt) {
            _aktivitet.avvik = null;
        } else {
            delete _aktivitet.avvik.enhet;
        }
        delete _aktivitet.jobbetMerEnnPlanlagt;
        return _aktivitet;
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
];

const mapSkjemasoknadToBackendsoknad = (soknad) => {
    const harHattPermisjon = soknad.harHattFeriePermisjonEllerUtenlandsopphold && soknad.harHattPermisjon;
    const harHattFerie = soknad.harHattFeriePermisjonEllerUtenlandsopphold && soknad.harHattFerie;
    const harHattUtenlandsopphold = soknad.harHattFeriePermisjonEllerUtenlandsopphold && soknad.harHattUtenlandsopphold;

    const permisjon = harHattPermisjon ? soknad.permisjon : [];
    const ferie = harHattFerie ? soknad.ferie : [];
    const utenlandsopphold = harHattUtenlandsopphold ? getUtenlandsopphold(soknad.utenlandsopphold) : null;

    const backendSoknad = Object.assign({}, soknad, {
        permisjon: parsePerioder(permisjon),
        ferie: parsePerioder(ferie),
        utenlandsopphold,
        andreInntektskilder: parseInntektskilder(soknad.andreInntektskilder),
        gjenopptattArbeidFulltUtDato: soknad.harGjenopptattArbeidFulltUt ? fraInputdatoTilJSDato(soknad.gjenopptattArbeidFulltUtDato) : null,
        egenmeldingsperioder: soknad.bruktEgenmeldingsdagerFoerLegemeldtFravaer ? parsePerioder(soknad.egenmeldingsperioder) : [],
        aktiviteter: getAktiviteter(soknad.aktiviteter),
        utdanning: getUtdanning(soknad.utdanning),
    });

    frontendProps.forEach((prop) => {
        delete backendSoknad[prop];
    });
    return backendSoknad;
};

export default mapSkjemasoknadToBackendsoknad;
