import { expect } from 'chai';
import { hentBrukerinfo, sjekkInnlogging } from '../../js/sagas/brukerinfoSagas';
import { get, getAjax } from 'digisyfo-npm';
import { put, call } from 'redux-saga/effects';
import * as actiontyper from '../../js/actions/actiontyper';

describe("brukerinfoSagas", () => {

    window.APP_SETTINGS = {
        REST_ROOT: "http://tjenester.nav.no/syforest"
    }

    describe("hentBrukerinfo", () => {
        const generator = hentBrukerinfo();

        it("Skal dispatche HENTER_BRUKERINFO", () => {
            const nextPut = put({
                type: actiontyper.HENTER_BRUKERINFO
            });
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it("Skal dernest hente brukerinfo", () => {
            const nextCall = call(get, "http://tjenester.nav.no/syforest/informasjon/bruker");
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it("Skal dernest sette brukerinfo", () => {
            const nextPut = put({
                type: actiontyper.SET_BRUKERINFO,
                data: {
                    navn: "Ole Olsen"
                }
            })
            expect(generator.next({
                navn: "Ole Olsen"
            }).value).to.deep.equal(nextPut);
        });

    });

    describe("sjekkInnlogging", () => {
        const generator = sjekkInnlogging();

        it("Skal dispatche SJEKKER_INNLOGGING", () => {
            const nextPut = put({
                type: actiontyper.SJEKKER_INNLOGGING
            });
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it("Skal dernest sjekke om brukeren er innlogget", () => {
            const nextCall = call(getAjax, "/sykefravaer/");
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it("Skal dernest sette status for innlogging", () => {
            const nextPut = put({
                type: actiontyper.BRUKER_ER_INNLOGGET,
            });
            expect(generator.next().value).to.deep.equal(nextPut);
        });
    });
});