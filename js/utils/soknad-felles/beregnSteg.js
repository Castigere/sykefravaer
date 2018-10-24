export const FOER_DU_BEGYNNER = 'FOER_DU_BEGYNNER';
export const FRAVAER_OG_FRISKMELDING = 'FRAVAER_OG_FRISKMELDING';
export const AKTIVITETER_I_SYKMELDINGSPERIODEN = 'AKTIVITETER_I_SYKMELDINGSPERIODEN';
export const OPPSUMMERING = 'OPPSUMMERING';
export const KVITTERING = 'KVITTERING';

const beregnSteg = (sti) => {
    if (sti.indexOf('oppsummering') > -1) {
        return OPPSUMMERING;
    }
    if (sti.indexOf('kvittering') > -1) {
        return KVITTERING;
    }
    if (sti.indexOf('fravaer-og-friskmelding') > -1) {
        return FRAVAER_OG_FRISKMELDING;
    }
    if (sti.indexOf('aktiviteter-i-sykmeldingsperioden') > -1) {
        return AKTIVITETER_I_SYKMELDINGSPERIODEN;
    }
    return FOER_DU_BEGYNNER;
};

export default beregnSteg;
