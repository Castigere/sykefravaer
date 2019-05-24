import { call, put, fork, takeEvery } from 'redux-saga/effects';
import { post, log } from '@navikt/digisyfo-npm';
import * as actions from './aktivitetskravActions';
import * as actiontyper from '../../../data/actiontyper';

export function* bekreftAktivitetskrav() {
    yield put(actions.bekrefterAktivitetskrav());
    try {
        const url = `${process.env.REACT_APP_SYFOREST_ROOT}/sykefravaersoppfoelging/actions/bekreft-aktivitetskrav`;
        yield call(post, url);
        yield put(actions.aktivitetskravBekreftet());
    } catch (e) {
        log(e);
        yield put(actions.bekreftAktivitetskravFeilet());
    }
}

function* watchBekreftAktivitetskrav() {
    yield takeEvery(actiontyper.BEKREFT_AKTIVITETSKRAV_FORESPURT, bekreftAktivitetskrav);
}

export default function* aktivitetskravSagas() {
    yield fork(watchBekreftAktivitetskrav);
}
