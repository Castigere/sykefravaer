import { OPPHOLD_UTLAND, SELVSTENDIGE_OG_FRILANSERE } from '../../enums/soknadtyper';
import { getSykepengesoknadSelvstendigSkjemanavn, OPPHOLD_UTLAND_SKJEMA } from '../../enums/skjemanavn';

export const getSkjemanavnFraSoknad = (soknad) => {
    switch (soknad.soknadstype) {
        case OPPHOLD_UTLAND: {
            return OPPHOLD_UTLAND_SKJEMA;
        }
        case SELVSTENDIGE_OG_FRILANSERE: {
            return getSykepengesoknadSelvstendigSkjemanavn(soknad.id);
        }
        default: {
            return null;
        }
    }
};