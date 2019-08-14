import {
    call, put, fork, takeEvery, all, select, delay,
} from 'redux-saga/effects';
import { log } from '@navikt/digisyfo-npm';
import { browserHistory } from 'react-router';
import {
    BEKREFT_LEST_SM_SYKMELDING_FORESPURT,
    HENT_SM_SYKMELDINGER_FORESPURT,
    bekrefterLestSmSykmelding,
    henterSmSykmeldinger,
    hentSmSykmeldingerFeilet,
    smSykmeldingBekreftLestFeilet,
    smSykmeldingerHentet,
    smSykmeldingBekreftetLest,
    bekreftSmSykmeldingKvitteringVistLengeNok,
} from './smSykmeldingerActions';
import { skalBekrefteSmSykmeldingSelector, skalHenteSmSykmeldingerSelector } from './smSykmeldingerSelectors';
import { get, post } from '../../../data/gateway-api';
import { toggleNyttSykmeldingsmottak, unleashtogglesHentetSelector } from '../../../data/unleash-toggles/unleashTogglesSelectors';
import { HENTET_UNLEASH_TOGGLES } from '../../../data/unleash-toggles/unleashToggles_actions';

export const hentSykmeldingsregisterUrl = () => {
    const url = window
    && window.location
    && window.location.href
        ? window.location.href
        : '';
    if (url.indexOf('tjenester.nav') > -1) {
        // Prod
        return 'https://syfosmregisterproxy.nav.no';
    } if (url.indexOf('localhost') > -1 || url.indexOf('herokuapp') > -1) {
        // Lokalt
        return '/syfosmregister';
    }
    // Preprod
    return 'https://syfosmregisterproxy-q.nav.no';
};

export function* oppdaterSmSykmeldinger() {
    const toggle = yield select(toggleNyttSykmeldingsmottak);
    const toggleHentet = yield select(unleashtogglesHentetSelector);
    if (toggle && toggleHentet) {
        yield put(henterSmSykmeldinger());
        try {
            const data = yield call(get, `${hentSykmeldingsregisterUrl()}/v1/sykmeldinger`);
            yield put(smSykmeldingerHentet(data));
        } catch (e) {
            log(e);
            yield put(hentSmSykmeldingerFeilet());
        }
    } else if (toggleHentet) {
        yield put(smSykmeldingerHentet([]));
    }
}

export function* hentSmSykmeldingerHvisIkkeHentet() {
    const skalHente = yield select(skalHenteSmSykmeldingerSelector);
    if (skalHente) {
        yield oppdaterSmSykmeldinger();
    }
}

export function* bekreftSmSykmeldingLestSaga(action) {
    const toggle = yield select(toggleNyttSykmeldingsmottak);
    const skalBekrefte = yield select(skalBekrefteSmSykmeldingSelector);
    if (toggle && skalBekrefte) {
        yield put(bekrefterLestSmSykmelding());
        try {
            yield call(post, `${hentSykmeldingsregisterUrl()}/v1/sykmeldinger/${action.smSykmelding.id}/bekreft`);
            yield put(smSykmeldingBekreftetLest(action.smSykmelding));
            browserHistory.push('/sykefravaer');
            yield delay(10000);
            yield put(bekreftSmSykmeldingKvitteringVistLengeNok());
        } catch (e) {
            log(e);
            yield put(smSykmeldingBekreftLestFeilet());
        }
    }
}

function* watchHentSmSykmeldinger() {
    yield takeEvery([
        HENT_SM_SYKMELDINGER_FORESPURT,
        HENTET_UNLEASH_TOGGLES,
    ], hentSmSykmeldingerHvisIkkeHentet);
}

function* watchBekreftSmSykmeldinger() {
    yield takeEvery([
        BEKREFT_LEST_SM_SYKMELDING_FORESPURT,
    ], bekreftSmSykmeldingLestSaga);
}

export default function* smSykmeldingerSagas() {
    yield all([
        fork(watchHentSmSykmeldinger),
        fork(watchBekreftSmSykmeldinger),
    ]);
}
