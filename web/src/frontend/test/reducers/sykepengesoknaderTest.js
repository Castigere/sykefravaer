import {List, Map, fromJS} from 'immutable';
import deepFreeze from 'deep-freeze';
import {expect} from 'chai';
import * as actiontyper from '../../js/actions/actiontyper';
import { parseDatofelter } from '../../js/reducers/sykepengesoknader';

import sykepengesoknader from '../../js/reducers/sykepengesoknader';

describe('sykepengesoknad', () => {

    describe('henter', () => {

        let initialState = deepFreeze({
            data: [],
            henter: false,
            hentingFeilet: false,
            sender: false,
            sendingFeilet: false,
        });

        it('håndterer SYKEPENGESOKNADER_HENTET', () => {
            const action = {
                type: actiontyper.SYKEPENGESOKNADER_HENTET,
                sykepengesoknader: [getSoknad()],
            };
            const nextState = sykepengesoknader(initialState, action);

            expect(nextState).to.deep.equal({
                data: [getParsetSoknad()],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
        });

        it("håndterer HENTER_SYKEPENGESOKNADER", () => {
            const action = {
                type: actiontyper.HENTER_SYKEPENGESOKNADER
            };
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [],
                henter: true,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
        });

        it("håndterer HENT_SYKEPENGESOKNADER_FEILET", () => {
            const soknad = {
                id: '1',
            };

            initialState = deepFreeze({
                data: [soknad],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });

            const action = {
                type: actiontyper.HENT_SYKEPENGESOKNADER_FEILET
            };
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [soknad],
                henter: false,
                hentingFeilet: true,
                sender: false,
                sendingFeilet: false,
            });
        });
    });

    describe("innsending", () => {

        const soknad = {
            id: '1',
        };

        let initialState = deepFreeze({
            data: [soknad],
            henter: false,
            hentingFeilet: false,
            sender: false,
            sendingFeilet: false,
        });

        it("håndterer SENDER_SYKEPENGESOKNAD", () => {
            const action = {
                type: actiontyper.SENDER_SYKEPENGESOKNAD
            };
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [soknad],
                sender: true,
                sendingFeilet: false,
                henter: false,
                hentingFeilet: false,
            });
        });

        it("håndterer SEND_SYKEPENGESOKNAD_FEILET", () => {
            const action = {
                type: actiontyper.SEND_SYKEPENGESOKNAD_FEILET
            };
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [soknad],
                sender: false,
                sendingFeilet: true,
                henter: false,
                hentingFeilet: false,
            });
        });

        it("håndterer SYKEPENGESOKNAD_SENDT", () => {
            let initialState = deepFreeze({
                data: [{id: '1'},{id: '2'}],
                henter: false,
                hentingFeilet: false,
                sender: false,
                sendingFeilet: false,
            });
            const action = {
                type: actiontyper.SYKEPENGESOKNAD_SENDT,
                sykepengesoknadsId: '1',
            };
            const nextState = sykepengesoknader(initialState, action);
            expect(nextState).to.deep.equal({
                data: [{ id: '1', status: 'SENDT' }, { id: '2' }],
                sender: false,
                sendingFeilet: false,
                henter: false,
                hentingFeilet: false,
            });
        });
    });

    describe("parsing", () => {
        it("parser datofelter i aktivitet og beholder resten av feltene", () => {
            const _soknad = parseDatofelter(getSoknad());
            expect(_soknad.aktiviteter[0].periode.fom.getTime()).to.be.equal(new Date("2016-07-15").getTime());
            expect(_soknad.aktiviteter[0].periode.tom.getTime()).to.be.equal(new Date("2017-01-19").getTime());
            expect(_soknad.aktiviteter[0].grad).to.be.equal(100);
        });

        it("parser datofelter i egenmeldingsperioder", () => {
            const soknad = Object.assign({},getSoknad(), { egenmeldingsperioder: [
                {
                    fom: "2016-07-15",
                    tom: "2017-01-19",
                }, {
                    fom: "2016-07-15",
                    tom: "2017-01-19",
                },
            ]});
            const _soknad = parseDatofelter(soknad);
            expect(_soknad.egenmeldingsperioder[0].fom.getTime()).to.be.equal(new Date("2016-07-15").getTime());
            expect(_soknad.egenmeldingsperioder[0].tom.getTime()).to.be.equal(new Date("2017-01-19").getTime());
        });

        it("parser datofelter i ferie", () => {
            const soknad = Object.assign({},getSoknad(), { ferie: [
                {
                    fom: "2016-07-15",
                    tom: "2017-01-19",
                }, {
                    fom: "2016-07-15",
                    tom: "2017-01-19",
                },
            ]});

            const _soknad = parseDatofelter(soknad);
            expect(_soknad.ferie[1].fom.getTime()).to.be.equal(new Date("2016-07-15").getTime());
            expect(_soknad.ferie[1].tom.getTime()).to.be.equal(new Date("2017-01-19").getTime());
        });

        it("parser datofelter i permisjon", () => {
            const soknad = Object.assign({},getSoknad(),
                {
                    permisjon: [
                        {
                            fom: "2016-07-15",
                            tom: "2017-01-19",
                        }, {
                            fom: "2016-07-15",
                            tom: "2017-01-19",
                        },
                    ]
                });
            const _soknad = parseDatofelter(soknad);
            expect(_soknad.permisjon[1].fom.getTime()).to.be.equal(new Date("2016-07-15").getTime());
            expect(_soknad.permisjon[1].tom.getTime()).to.be.equal(new Date("2017-01-19").getTime());
        });

        it("parser datofelter i utenlandsopphold", () => {
            const soknad = Object.assign({},getSoknad(),
                {
                    utenlandsOpphold: [
                        {
                            soektOmSykepengerIPerioden: false,
                            fom: "2016-07-15",
                            tom: "2017-01-19",
                        }, {
                            soektOmSykepengerIPerioden: true,
                            fom: "2016-07-15",
                            tom: "2017-01-19",
                        },
                    ]
                });
            const _soknad = parseDatofelter(soknad);
            expect(_soknad.utenlandsOpphold[0].soektOmSykepengerIPerioden).to.be.equal(false);
            expect(_soknad.utenlandsOpphold[1].fom.getTime()).to.be.equal(new Date("2016-07-15").getTime());
            expect(_soknad.utenlandsOpphold[1].tom.getTime()).to.be.equal(new Date("2017-01-19").getTime());
            expect(_soknad.utenlandsOpphold[1].soektOmSykepengerIPerioden).to.be.equal(true);
        });

        it("parser datofelter i utdanning", () => {
            const soknad = Object.assign({}, getSoknad(),
                {
                    utdanning: {
                        utdanningStartdato: "2017-01-01",
                        erUtdanningFulltidsstudium: true,
                    }
                }
            );
            const _soknad = parseDatofelter(soknad);
            expect(_soknad.utdanning.utdanningStartdato.getTime()).to.be.equal(new Date("2017-01-01").getTime());
            expect(_soknad.utdanning.erUtdanningFulltidsstudium).to.be.equal(true);
        });

        it("parser gjenopptattArbeidFulltUtDato", () => {
            const soknad = Object.assign({}, getSoknad(),
                {
                    gjenopptattArbeidFulltUtDato: "2017-01-19"
                }
            );
            const _soknad = parseDatofelter(soknad);
            expect(_soknad.gjenopptattArbeidFulltUtDato.getTime()).to.be.equal(new Date("2017-01-19").getTime());
        });

        it("parser identdato", () => {
            const soknad = Object.assign({}, getSoknad(),
                {
                    identdato: "2017-01-19"
                }
            );
            const _soknad = parseDatofelter(soknad);
            expect(_soknad.identdato.getTime()).to.be.equal(new Date("2017-01-19").getTime());
        });

        it("parser innsendtDato", () => {
            const soknad = Object.assign({}, getSoknad(),
                {
                    innsendtDato: "2017-01-19"
                }
            );
            const _soknad = parseDatofelter(soknad);
            expect(_soknad.innsendtDato.getTime()).to.be.equal(new Date("2017-01-19").getTime());
        });

        it("parser opprettetDato", () => {
            const soknad = Object.assign({}, getSoknad(),
                {
                    opprettetDato: "2017-01-19"
                }
            );
            const _soknad = parseDatofelter(soknad);
            expect(_soknad.opprettetDato.getTime()).to.be.equal(new Date("2017-01-19").getTime());
        });
    })
});

const getSoknad = () => {
    return soknad = {
        aktiviteter: [
            {
                avvik: null,
                grad: 100,
                periode: {
                    fom: "2016-07-15",
                    tom: "2017-01-19",
                }
            },
        ],
        egenmeldingsperioder: [],
        ferie: [],
        gjenopptattArbeidFulltUtDato: null,
        identdato: null,
        permisjon: [],
        utdanning: null,
        utenlandsOpphold: [],
        opprettetDato: "2017-01-01",
        innsendtDato: null,
    };
};

const getParsetSoknad = () => {
    return soknad = {
        aktiviteter: [
            {
                avvik: null,
                grad: 100,
                periode: {
                    fom: new Date("2016-07-15"),
                    tom: new Date("2017-01-19"),
                }
            },
        ],
        egenmeldingsperioder: [],
        ferie: [],
        gjenopptattArbeidFulltUtDato: null,
        identdato: null,
        permisjon: [],
        utdanning: null,
        utenlandsOpphold: [],
        opprettetDato: new Date("2017-01-01"),
        innsendtDato: null,
    };
};

