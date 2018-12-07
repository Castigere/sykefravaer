import { combineReducers } from 'redux';
import * as actiontyper from '../actions/actiontyper';
import { createReducer } from './createReducer';

const { BRUKERINFO_HENTET,
    HENT_BRUKERINFO_FEILET,
    HENT_OPPFOLGING_FEILET,
    HENTER_BRUKERINFO,
    HENTER_OPPFOLGING,
    OPPFOLGING_HENTET,
    HENT_SYKMELDTINFODATA_FEILET,
    HENTER_SYKMELDTINFODATA,
    SYKMELDTINFODATA_HENTET,
    HENT_LOGIN_INFO_FEILET,
    HENTER_LOGIN_INFO,
    LOGIN_INFO_HENTET,
} = actiontyper;

function innstillinger(state = {}, action = {}) {
    switch (action.type) {
        case actiontyper.SET_TIDSLINJE_ARBEIDSSITUASJON: {
            return {
                ...state,
                arbeidssituasjon: action.arbeidssituasjon,
            };
        }
        default: {
            return state;
        }
    }
}

function innlogging(
    state = {
        erInnlogget: true,
        henter: false,
        hentingFeilet: false,
    },
    action = {}) {
    switch (action.type) {
        case actiontyper.BRUKER_ER_UTLOGGET: {
            return {
                erInnlogget: false,
                henter: false,
                hentingFeilet: false,
            };
        }
        case actiontyper.BRUKER_ER_INNLOGGET: {
            return {
                ...state,
                erInnlogget: true,
                henter: false,
                hentingFeilet: false,
            };
        }
        case actiontyper.SJEKKER_INNLOGGING: {
            return {
                ...state,
                henter: true,
                hentingFeilet: false,
            };
        }
        case actiontyper.SJEKK_INNLOGGING_FEILET: {
            return {
                erInnlogget: false,
                hentingFeilet: true,
                henter: false,
            };
        }
        default: {
            return state;
        }
    }
}

const bruker = createReducer(HENT_BRUKERINFO_FEILET, HENTER_BRUKERINFO, BRUKERINFO_HENTET);
const oppfolging = createReducer(HENT_OPPFOLGING_FEILET, HENTER_OPPFOLGING, OPPFOLGING_HENTET);
const sykmeldtinfodata = createReducer(HENT_SYKMELDTINFODATA_FEILET, HENTER_SYKMELDTINFODATA, SYKMELDTINFODATA_HENTET);
const loginInfo = createReducer(HENT_LOGIN_INFO_FEILET, HENTER_LOGIN_INFO, LOGIN_INFO_HENTET);

const brukerinfo = combineReducers({
    bruker,
    innstillinger,
    innlogging,
    oppfolging,
    sykmeldtinfodata,
    loginInfo,
});

export default brukerinfo;
