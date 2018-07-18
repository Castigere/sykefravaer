import { getLedetekst } from 'digisyfo-npm';
import { formaterEnkeltverdi } from '../../components/soknad-felles/fieldUtils';
import { CHECKED } from '../../enums/svarEnums';
import { CHECKBOX_GRUPPE, PERIODER, FRITEKST, IKKE_RELEVANT } from '../../enums/svartyper';
import { validerPerioder } from '../../components/sykepengesoknad-arbeidstaker/validering/valideringUtils';

const hentSporsmalMedStilteUndersporsmal = (sporsmalsliste, values) => {
    return sporsmalsliste
        .filter((sporsmal) => {
            return values[sporsmal.tag] !== undefined;
        })
        .filter((sporsmal) => {
            const verdi = formaterEnkeltverdi(values[sporsmal.tag]);
            const formatertVerdi = verdi === true ? CHECKED : verdi;
            return (sporsmal.svar && formatertVerdi === sporsmal.kriterieForVisningAvUndersporsmal);
        });
};

export const beregnFeilmeldingnokkelFraTag = (tag) => {
    return `soknad.feilmelding.${tag.toLowerCase()}`;
};

export const beregnFeilmeldingstekstFraTag = (tag) => {
    const nokkel = beregnFeilmeldingnokkelFraTag(tag);
    return getLedetekst(nokkel);
};

const verdiErTom = (verdi) => {
    return (verdi || verdi === '') && verdi.trim && verdi.trim() === '';
};

const validerUndersporsmalsliste = (sporsmalsliste = [], values = {}, feilmeldingerParam = {}) => {
    let feilmeldinger = { ...feilmeldingerParam };
    const sporsmalMedStilteUndersporsmal = hentSporsmalMedStilteUndersporsmal(sporsmalsliste, values);

    sporsmalMedStilteUndersporsmal
        .forEach((sporsmalMedUndersporsmal) => {
            const undersporsmalsliste = sporsmalMedUndersporsmal.undersporsmal;
            undersporsmalsliste.forEach((undersporsmal) => {
                switch (undersporsmal.svartype) {
                    case CHECKBOX_GRUPPE: {
                        const avkryssedeCheckboxer = undersporsmal.undersporsmal
                            .map((checkboxSporsmal) => {
                                const verdi = values[checkboxSporsmal.tag];
                                return formaterEnkeltverdi(verdi);
                            })
                            .filter((verdi) => {
                                return verdi === true;
                            });

                        if (avkryssedeCheckboxer.length === 0) {
                            feilmeldinger[undersporsmal.tag] = {
                                _error: beregnFeilmeldingstekstFraTag(undersporsmal.tag),
                            };
                        } else {
                            feilmeldinger = validerUndersporsmalsliste(undersporsmal.undersporsmal, values, feilmeldinger);
                        }
                        break;
                    }
                    case PERIODER: {
                        const periodeFeilmeldinger = validerPerioder(values[undersporsmal.tag]);
                        if (periodeFeilmeldinger) {
                            feilmeldinger[undersporsmal.tag] = periodeFeilmeldinger;
                        }
                        break;
                    }
                    default: {
                        const verdi = formaterEnkeltverdi(values[undersporsmal.tag]);
                        if (verdiErTom(verdi)) {
                            feilmeldinger[undersporsmal.tag] = beregnFeilmeldingstekstFraTag(undersporsmal.tag);
                        }
                        break;
                    }
                }
            });
        });

    return feilmeldinger;
};

export default (sporsmal = [], values = {}) => {
    const feilmeldinger = {};
    sporsmal
        .filter((s) => {
            const verdi = formaterEnkeltverdi(values[s.tag]);
            return ((values[s.tag] === undefined
                    || verdi === false
                    || (s.svartype === FRITEKST && verdiErTom(verdi))
                    || (s.svartype === PERIODER))
                        && s.svartype !== IKKE_RELEVANT
            );
        })
        .forEach((s) => {
            if (s.svartype === PERIODER) {
                const periodeFeilmeldinger = validerPerioder(values[s.tag]);
                if (periodeFeilmeldinger) {
                    feilmeldinger[s.tag] = periodeFeilmeldinger;
                }
            } else {
                feilmeldinger[s.tag] = beregnFeilmeldingstekstFraTag(s.tag);
            }
        });
    return validerUndersporsmalsliste(sporsmal, values, feilmeldinger);
};