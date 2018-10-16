import { UNCHECKED, CHECKED } from '../../enums/svarEnums';

export const genererParseForEnkeltverdi = (sporsmalsid) => {
    return (verdi) => {
        return verdi || verdi === ''
            ? {
                sporsmalsid,
                svarverdier: [{
                    verdi,
                }],
            }
            : undefined;
    };
};

export const genererParseForCheckbox = (sporsmalsId) => {
    const parse = genererParseForEnkeltverdi(sporsmalsId);
    return (value) => {
        const checkedVerdi = value ? CHECKED : UNCHECKED;
        return parse(checkedVerdi);
    };
};

export const formaterEnkeltverdi = (value) => {
    try {
        const verdi = value.svarverdier[0].verdi;
        return (verdi === CHECKED || verdi === UNCHECKED)
            ? verdi === CHECKED
            : verdi;
    } catch (e) {
        return '';
    }
};

export const fjernIndexFraTag = (tag) => {
    const separator = '_';
    const tagdeler = tag.split(separator);
    if (!isNaN(parseInt(tagdeler[tagdeler.length - 1], 10))) {
        tagdeler.splice(-1, 1);
        return tagdeler.join(separator);
    }
    return tag;
};