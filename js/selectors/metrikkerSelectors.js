import { SOKNAD_SENDT, SYKEPENGESOKNAD_SENDT, SYKMELDING_BEKREFTET, SYKMELDING_SENDT } from '../actions/actiontyper';
import { beregnVarighet } from '../utils/metrikkerUtils';
import { TID_INNSENDING_SYKEPENGESOKNAD_ARBEIDSTAKER, TID_INNSENDING_SYKEPENGESOKNAD_SELVSTENDIG, TID_INNSENDING_SYKMELDING } from '../enums/metrikkerEnums';
import { SELVSTENDIGE_OG_FRILANSERE } from '../enums/soknadtyper';

export const hentEvents = (state, ressursId) => {
    return [...state.metrikker.data]
        .filter((e) => {
            return e.ressursId === ressursId;
        })
        .sort((a, b) => {
            return a.tid > b.tid;
        });
};

export const hentEvent = (state, kriterier) => {
    return hentEvents(state, kriterier.ressursId)
        .filter((s) => {
            return s.type === kriterier.type;
        })
        .reverse()[0];
};

export const hentMetrikk = (state, action) => {
    const hentMetrikktype = (type) => {
        return `SYKEFRAVAER_METRIKK__${type}`;
    };

    switch (action.type) {
        case SYKMELDING_BEKREFTET:
        case SYKMELDING_SENDT: {
            const tid = beregnVarighet(state, {
                ressursId: action.sykmeldingId,
                type: TID_INNSENDING_SYKMELDING,
            });
            return {
                type: hentMetrikktype(SYKMELDING_SENDT),
                data: {
                    tid,
                },
            };
        }
        case SOKNAD_SENDT: {
            if (action.soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE) {
                const tid = beregnVarighet(state, {
                    ressursId: action.soknad.id,
                    type: TID_INNSENDING_SYKEPENGESOKNAD_SELVSTENDIG,
                });
                return {
                    type: hentMetrikktype(`${SYKEPENGESOKNAD_SENDT}_SELVSTENDIG/FRILANSER`),
                    data: {
                        tid,
                    },
                };
            }
            return null;
        }
        case SYKEPENGESOKNAD_SENDT: {
            const tid = beregnVarighet(state, {
                ressursId: action.sykepengesoknad.id,
                type: TID_INNSENDING_SYKEPENGESOKNAD_ARBEIDSTAKER,
            });
            return {
                type: hentMetrikktype(`${SYKEPENGESOKNAD_SENDT}_ARBEIDSTAKER`),
                data: {
                    tid,
                },
            };
        }
        default: {
            return null;
        }
    }
};