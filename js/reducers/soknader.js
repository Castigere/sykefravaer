import {
    BEKREFT_SYKMELDING_ANGRET,
    AVBRYT_SOKNAD_FEILET,
    AVBRYTER_SOKNAD,
    HENT_SOKNADER_FEILET,
    HENTER_SOKNADER,
    OPPDATER_SOKNAD_FEILET,
    OPPRETT_SYKEPENGESOKNADUTLAND_FEILET,
    OPPRETTER_SYKEPENGESOKNADUTLAND,
    OPPRETTER_UTKAST_TIL_KORRIGERING,
    UTKAST_TIL_KORRIGERING_OPPRETTET,
    OPPRETT_UTKAST_TIL_KORRIGERING_FEILET,
    SEND_SOKNAD_FEILET,
    SENDER_SOKNAD,
    SOKNAD_OPPDATERT,
    SOKNAD_SENDT,
    SOKNADER_HENTET,
    SYKEPENGESOKNADUTLAND_OPPRETTET,
    SOKNAD_AVBRUTT,
    GJENAPNER_SOKNAD,
    GJENAPNE_SOKNAD_FEILET,
    SOKNAD_GJENAPNET,
} from '../actions/actiontyper';
import { DATO, PERIODER, PROSENT, TIMER } from '../enums/svartyper';
import { SENDT, NY, AVBRUTT } from '../enums/soknadstatuser';
import { OPPHOLD_UTLAND } from '../enums/soknadtyper';

const initiellState = {
    data: [],
    henter: false,
    hentingFeilet: false,
    hentet: false,
    sender: false,
    sendingFeilet: false,
    oppretterSoknad: false,
    opprettFeilet: false,
    avbryter: false,
    avbrytSoknadFeilet: false,
};

const getMinMax = (sporsmal) => {
    switch (sporsmal.svartype) {
        case PERIODER:
        case DATO: {
            return {
                min: sporsmal.min ? new Date(sporsmal.min) : sporsmal.min,
                max: sporsmal.max ? new Date(sporsmal.max) : sporsmal.max,
            };
        }
        case TIMER:
        case PROSENT: {
            return {
                min: parseInt(sporsmal.min, 10),
                max: parseInt(sporsmal.max, 10),
            };
        }
        default: {
            return {};
        }
    }
};

const parseSporsmal = (sporsmal) => {
    const minMax = getMinMax(sporsmal);
    return {
        ...sporsmal,
        ...minMax,
        undersporsmal: [...sporsmal.undersporsmal].map(parseSporsmal),
    };
};

export const parseSoknad = (soknad) => {
    return {
        ...soknad,
        fom: new Date(soknad.fom),
        tom: new Date(soknad.tom),
        opprettetDato: new Date(soknad.opprettetDato),
        innsendtDato: soknad.innsendtDato ? new Date(soknad.innsendtDato) : undefined,
        sporsmal: [...soknad.sporsmal].map(parseSporsmal),
    };
};

export default (state = initiellState, action = {}) => {
    switch (action.type) {
        case SOKNADER_HENTET: {
            return {
                data: action.soknader.map(parseSoknad),
                hentet: true,
                henter: false,
                hentingFeilet: false,
            };
        }
        case HENT_SOKNADER_FEILET: {
            return {
                data: [],
                hentet: true,
                henter: false,
                hentingFeilet: true,
            };
        }
        case HENTER_SOKNADER: {
            return {
                data: [],
                hentet: false,
                henter: true,
                hentingFeilet: false,
            };
        }
        case SENDER_SOKNAD: {
            return {
                ...state,
                sender: true,
                sendingFeilet: false,
            };
        }
        case SOKNAD_SENDT: {
            return {
                ...state,
                sender: false,
                sendingFeilet: false,
            };
        }
        case SEND_SOKNAD_FEILET: {
            return {
                ...state,
                sender: false,
                sendingFeilet: true,
            };
        }
        case OPPRETTER_SYKEPENGESOKNADUTLAND: {
            return {
                ...state,
                oppretterSoknad: true,
                opprettFeilet: false,
            };
        }
        case SYKEPENGESOKNADUTLAND_OPPRETTET: {
            return {
                ...state,
                oppretterSoknad: false,
                opprettFeilet: false,
                data: [...state.data, parseSoknad(action.soknad)],
            };
        }
        case OPPRETT_SYKEPENGESOKNADUTLAND_FEILET: {
            return {
                ...state,
                oppretterSoknad: false,
                opprettFeilet: true,
            };
        }
        case AVBRYTER_SOKNAD: {
            return {
                ...state,
                avbryter: true,
                avbrytSoknadFeilet: false,
            };
        }
        case SOKNAD_AVBRUTT: {
            const data = action.soknad.soknadstype === OPPHOLD_UTLAND
                ? [...state.data.filter((s) => {
                    return s.id !== action.soknad.id;
                })]
                : state.data.map((s) => {
                    return s.id === action.soknad.id
                        ? {
                            ...s,
                            status: AVBRUTT,
                            avbruttDato: new Date(),
                        }
                        : s;
                });
            return {
                ...state,
                data,
                avbryter: false,
                avbrytSoknadFeilet: false,
            };
        }
        case AVBRYT_SOKNAD_FEILET: {
            return {
                ...state,
                avbryter: false,
                avbrytSoknadFeilet: true,
            };
        }
        case OPPDATER_SOKNAD_FEILET: {
            return {
                ...state,
                oppdaterFeilet: true,
            };
        }
        case SOKNAD_OPPDATERT: {
            return {
                ...state,
                oppdaterFeilet: false,
                data: state.data.map((s) => {
                    return s.id === action.soknad.id
                        ? parseSoknad(action.soknad)
                        : s;
                }),
            };
        }
        case BEKREFT_SYKMELDING_ANGRET: {
            return {
                ...state,
                data: state.data.filter((s) => {
                    return s.sykmeldingId === action.sykmeldingId
                        ? s.status === SENDT
                        : true;
                }),
            };
        }
        case GJENAPNER_SOKNAD: {
            return {
                ...state,
                gjenapner: true,
                gjenapneFeilet: false,
            };
        }
        case GJENAPNE_SOKNAD_FEILET: {
            return {
                ...state,
                gjenapner: false,
                gjenapneFeilet: true,
            };
        }
        case SOKNAD_GJENAPNET: {
            return {
                ...state,
                gjenapneFeilet: false,
                gjenapner: false,
                data: state.data.map((s) => {
                    if (s.id === action.soknad.id) {
                        return {
                            ...s,
                            status: NY,
                            avbruttDato: null,
                        };
                    }
                    return s;
                }),
            };
        }
        case OPPRETTER_UTKAST_TIL_KORRIGERING: {
            return {
                ...state,
                endrer: true,
            };
        }
        case OPPRETT_UTKAST_TIL_KORRIGERING_FEILET: {
            return {
                ...state,
                endrer: false,
                endringFeilet: true,
            };
        }
        case UTKAST_TIL_KORRIGERING_OPPRETTET: {
            const harUtkast = state.data.map((soknad) => {
                return soknad.id;
            }).includes(action.utkast.id);

            return {
                ...state,
                data: harUtkast ? state.data : [...state.data, parseSoknad(action.utkast)],
                endrer: false,
                endringFeilet: false,
            };
        }
        default: {
            return state;
        }
    }
};