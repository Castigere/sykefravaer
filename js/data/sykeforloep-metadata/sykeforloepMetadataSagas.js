import { call, put, fork, takeEvery, select, all } from 'redux-saga/effects';
import { get, log } from '@navikt/digisyfo-npm';
import * as actions from '../sykeforloep/sykeforloep_actions';
import {
    HENT_SYKEFORLOEP_METADATA_FORESPURT,
    SYKMELDING_AVBRUTT,
    SYKMELDING_BEKREFTET,
    SYKMELDING_SENDT,
} from '../actiontyper';
import { skalHenteSykeforloepMetadata } from './sykeforloepMetadataSelectors';

export function* oppdaterSykeforloepMetadata() {
    yield put(actions.henterSykeforloepMetadata());
    try {
        const data = yield call(get, `${process.env.REACT_APP_SYFOREST_ROOT}/sykeforloep/metadata`);
        yield put(actions.sykeforloepMetadataHentet(data));
    } catch (e) {
        log(e);
        yield put(actions.hentSykeforloepMetadataFeilet());
    }
}

export function* hentSykeforloepMetadataHvisIkkeHentet() {
    const skalHente = yield select(skalHenteSykeforloepMetadata);
    if (skalHente) {
        yield oppdaterSykeforloepMetadata();
    }
}

function* watchOppdaterSykeforloepMetadata() {
    yield takeEvery([
        SYKMELDING_SENDT,
        SYKMELDING_BEKREFTET,
        SYKMELDING_AVBRUTT,
    ], oppdaterSykeforloepMetadata);
}

function* watchHentSykeforloepMetadata() {
    yield takeEvery(HENT_SYKEFORLOEP_METADATA_FORESPURT, hentSykeforloepMetadataHvisIkkeHentet);
}

export default function* sykeforloepMetadataSagas() {
    yield all([
        fork(watchOppdaterSykeforloepMetadata),
        fork(watchHentSykeforloepMetadata),
    ]);
}