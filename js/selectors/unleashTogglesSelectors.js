/*

Liste av funksjoner her, f.eks:

export const toggleSelvstendigSoknad = (state) => {
    return !state.unleashToggles.hentingFeilet
        && state.unleashToggles.data[SELVSTENDIG_FRILANSER_SOKNAD_TOGGLE] === true;
};

*/

import { SELVSTENDIG_KORRIGER, SYKMELDING_ARBEIDSSITUASJON, NY_ARBEIDSTAKERSOKNAD, FO_DATO_39_UKER } from '../enums/unleashToggles';

export const toggleKorrigerSelvstendigSoknad = (state) => {
    return !state.unleashToggles.hentingFeilet
        && state.unleashToggles.data[SELVSTENDIG_KORRIGER] === true;
};

export const toggleSykmeldingEndreArbeidssituasjon = (state) => {
    return !state.unleashToggles.hentingFeilet
        && state.unleashToggles.data[SYKMELDING_ARBEIDSSITUASJON] === true;
};

export const toggleNyArbeidstakerSoknad = (state) => {
    return !state.unleashToggles.hentingFeilet
        && state.unleashToggles.data[NY_ARBEIDSTAKERSOKNAD] === true;
};

export const toggleFO39uker = (state) => {
    return !state.unleashToggles.hentingFeilet
        && state.unleashToggles.data[FO_DATO_39_UKER] === true;
};
