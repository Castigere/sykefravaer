import {
    erGyldigDatoformat,
    tilLesbarDatoMedArstall,
    tilLesbarPeriodeMedArstall,
} from 'digisyfo-npm';

export {
    tilLesbarDatoMedArstall,
    tilLesbarPeriodeMedArstall,
};

export const ukedager = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];

export const datoMedKlokkeslett = (dato) => {
    if (dato === undefined || dato === null) {
        return '';
    }

    const days = parseInt(dato.substring(8, 10), 10) < 10 ? dato.substring(9, 10) : dato.substring(8, 10);
    const months = parseInt(dato.substring(5, 7), 10) < 10 ? dato.substring(6, 7) : dato.substring(5, 7);
    const time = dato.substring(11, 16);

    /* 16/2 klokken 14:15 */
    return `${days}/${months} klokken ${time}`;
};

export const newDate = () => {
    const now = new Date();
    return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getHours(), now.getUTCMinutes(), now.getUTCSeconds());
};

export const erGyldigDato = (dato) => {
    // eslint-disable-next-line
    const re = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    if (!re.test(dato)) {
        return false;
    }
    return erGyldigDatoformat(dato);
};

export const ANTALL_MS_DAG = 1000 * 60 * 60 * 24;

export const hentDagerMellomDatoer = (startDato, sluttDato) => {
    return Math.round(Math.abs((sluttDato.getTime() - startDato.getTime()) / (ANTALL_MS_DAG)));
};

export const leggTilDagerPaaDato = (dato, dager) => {
    const nyDato = new Date(dato);
    nyDato.setTime(nyDato.getTime() + (dager * ANTALL_MS_DAG));
    return new Date(nyDato);
};

export const capitalizeForsteBokstav = (ord) => {
    return ord.charAt(0).toUpperCase() + ord.slice(1);
};

export const tilLesbarDatoMedArstallOgUkedag = (datoArg) => {
    return datoArg
        ? `${capitalizeForsteBokstav(ukedager[new Date(datoArg).getDay()])} ${tilLesbarDatoMedArstall(datoArg)}`
        : null;
};
