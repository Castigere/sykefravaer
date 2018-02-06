import { expect } from 'chai';
import { hentVedlikehold } from '../../js/sagas/vedlikeholdSagas';
import { get } from 'digisyfo-npm';
import { put, call } from 'redux-saga/effects';
import * as actiontyper from '../../js/actions/actiontyper';
import * as actions from '../../js/actions/vedlikehold_actions'

describe("vedlikeholdSagas", () => {
    beforeEach(() => {
        window.APP_SETTINGS = {
            REST_ROOT: "http://tjenester.nav.no/syforest"
        }
    });

    describe("hentVedlikehold", () => {
        const generator = hentVedlikehold();

        it("Skal dispatche HENTER_VEDLIKEHOLD", () => {
            const nextPut = put({
                type: actiontyper.HENTER_VEDLIKEHOLD,
            });
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it("Skal dernest hente vedlikehold", () => {
            const nextCall = call(get, "http://tjenester.nav.no/syforest/informasjon/vedlikehold");
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it("Skal dernest sette vedlikehold paa state", () => {
            const nextPut = put(actions.vedlikeholdHentet(true));
            expect(generator.next(true).value).to.deep.equal(nextPut);
        });
    });
});