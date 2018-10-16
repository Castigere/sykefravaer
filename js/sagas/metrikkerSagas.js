import { fork, select, takeEvery } from 'redux-saga/effects';
import { log } from 'digisyfo-npm';
import { SOKNAD_SENDT, SYKEPENGESOKNAD_SENDT, SYKMELDING_BEKREFTET, SYKMELDING_SENDT } from '../actions/actiontyper';
import { hentMetrikk } from '../selectors/metrikkerSelectors';

const pushToDataLayer = (metrikk) => {
    /* eslint-disable */
    window.dataLayer.push({
        'event': metrikk.type,
        'value': metrikk.data.tid,
        'data': JSON.stringify(metrikk.data),
    });
    /* eslint-enable */
};

export function* lagreMetrikk(action) {
    try {
        const metrikk = yield select(hentMetrikk, action);
        log(metrikk);
        pushToDataLayer(metrikk);
    } catch (e) {
        log(e);
    }
}

function* watch() {
    yield takeEvery([
        SYKMELDING_SENDT,
        SYKMELDING_BEKREFTET,
        SYKEPENGESOKNAD_SENDT,
        SOKNAD_SENDT,
    ], lagreMetrikk);
}

export default function* metrikkerSagas() {
    yield fork(watch);
}