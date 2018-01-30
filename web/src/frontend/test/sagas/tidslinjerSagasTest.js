import { expect } from 'chai';
import { hentTidslinjer } from '../../js/sagas/tidslinjerSagas.js';
import { get } from 'digisyfo-npm';
import { put, call } from 'redux-saga/effects';
import * as actiontyper from '../../js/actions/actiontyper';

describe("tidslinjerSagas", () => {

    beforeEach(() => {
        window.APP_SETTINGS = {
            REST_ROOT: "http://tjenester.nav.no/syforest"
        }
    });

    const generator = hentTidslinjer({
        type: actiontyper.HENT_TIDSLINJER_FORESPURT,
        apneHendelseIder: ['3'],
        arbeidssituasjon: 'MED_ARBEIDSGIVER'
    });

    it("Skal dispatche HENTER_TIDSLINJER", () => {
        const nextPut = put({type: actiontyper.HENTER_TIDSLINJER});
        expect(generator.next().value).to.deep.equal(nextPut);
    });

    it("Skal dernest hente tidslinjer", () => {
        const nextCall = call(get, "http://tjenester.nav.no/syforest/tidslinje?type=MED_ARBEIDSGIVER");
        expect(generator.next().value).to.deep.equal(nextCall);
    });

    it("Skal dernest sette dine tidslinjer", () => {
        const nextPut = put({
            type: actiontyper.SET_TIDSLINJER,
            tidslinjer: "data",
            arbeidssituasjon: 'MED_ARBEIDSGIVER'
        })
        expect(generator.next("data").value).to.deep.equal(nextPut);
    });

    it("Skal dernest åpne hendelser dersom action.apneHendelseIder.length > 0", () => {
        const nextPut = put({ type: 'ÅPNE_HENDELSER', hendelseIder: [ '3' ] });
        expect(generator.next().value).to.deep.equal(nextPut)
    })

});