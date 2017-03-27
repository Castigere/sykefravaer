import chai from 'chai';
import React from 'react'
import {mount, shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

chai.use(chaiEnzyme());
const expect = chai.expect;

import validate, {
    antallFeil,
    ikkeJobbetMerEnnGraderingProsentFeil,
    ikkeJobbetMerEnnGraderingTimerFeil,
    normaltAntallFeil,
    overHundreFeil,
    jobbetMerEnnPlanlagtFeil } from '../../../../js/components/sykepengesoknad/validering/validerAktiviteterISykmeldingsperioden';
import { getSoknad } from '../../../mockSoknader';

describe("validerAktiviteterISykmeldingsperioden", () => {

    let values; 
    let sykepengesoknad;

    beforeEach(() => {
        values = {
            "ansvarBekreftet":true,
            "bruktEgenmeldingsdagerFoerLegemeldtFravaer":false,
            "harGjenopptattArbeidFulltUt":false,
            "harHattFeriePermisjonEllerUtenlandsopphold":false
        };
        sykepengesoknad = getSoknad({
            "aktiviteter": [{
                "periode": {
                    "fom": "2017-01-01",
                    "tom": "2017-01-15"
                },
                "grad": 100,
                "avvik": null
            }, {
                "periode": {
                    "fom": "2017-16-01",
                    "tom": "2017-16-25"
              },
              "grad": 50,
              "avvik": null
            }]
        });
        sendTilFoerDuBegynner = sinon.spy();
    });

    it("Skal returnere undefined når alt er OK", () => {
        const values = {
            "aktiviteter":[{"jobbetMerEnnPlanlagt":false},{"jobbetMerEnnPlanlagt":false}],
            "harAndreInntektskilder":false,
            "utdanning": {
                "underUtdanningISykmeldingsperioden": false
            }
        };
        const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
        expect(res).to.deep.equal({})
    });

    it("Skal kalle på sendTilFoerDuBegynner dersom alt fra side 1 + 2 ikke er fylt ut", () => {
        values = {};
        const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
        expect(sendTilFoerDuBegynner.calledWith(sykepengesoknad)).to.be.true;
    });

    it("Skal ikke kalle på sendTilFoerDuBegynner dersom alt fra side 1 + 2 ikke er fylt ut", () => {
        validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
        expect(sendTilFoerDuBegynner.called).to.be.false;
    });

    describe("Aktivitet", () => {

        it("Skal funke når aktiviteter ikke er oppgitt", () => {
            const values = {};
            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
            expect(typeof res).to.equal("object")
        });

        it("Skal validere alle aktiviteter i søknaden", () => {
            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
            expect(res.aktiviteter).to.have.length(2); 
            expect(res.aktiviteter[0].jobbetMerEnnPlanlagt).to.equal(jobbetMerEnnPlanlagtFeil);
            expect(res.aktiviteter[1].jobbetMerEnnPlanlagt).to.equal(jobbetMerEnnPlanlagtFeil);
        });

        it("Skal validere alle aktiviteter i sykmeldingen når man ikke har jobbet mer enn planlagt", () => {
            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: false
            }, {
                jobbetMerEnnPlanlagt: false
            }]
            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
            expect(res.aktiviteter).to.be.undefined;
        });

        it("Skal validere avvik når man har jobbet mer enn planlagt", () => {
            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: true,
            }, {
                jobbetMerEnnPlanlagt: true,
            }]
            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
            expect(res.aktiviteter).to.deep.equal([{
                avvik: {
                    arbeidsgrad: antallFeil,
                    arbeidstimerNormalUke: normaltAntallFeil
                }
            }, {
                avvik: {
                    arbeidsgrad: antallFeil,
                    arbeidstimerNormalUke: normaltAntallFeil
                }
            }])
        });

        it("Skal validere avvik når man har jobbet mer enn planlagt og arbeidsgrad er en tom streng", () => {
            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: true,
                avvik: {
                    arbeidsgrad: "",
                    enhet: "prosent",
                }
            }, {
                jobbetMerEnnPlanlagt: true,
            }]
            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
            expect(res.aktiviteter).to.deep.equal([{
                avvik: {
                    arbeidsgrad: antallFeil,
                    arbeidstimerNormalUke: normaltAntallFeil
                }
            }, {
                avvik: {
                    arbeidsgrad: antallFeil,
                    arbeidstimerNormalUke: normaltAntallFeil
                }
            }])
        });

        it("Skal validere arbeidstimerNormalUke når man har jobbet mer enn planlagt", () => {
            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: true,
                avvik: {
                    enhet: "timer",
                    timer: "55"
                }
            }, {
                jobbetMerEnnPlanlagt: true,
            }]
            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
            expect(res.aktiviteter).to.deep.equal([{
                avvik: {
                    arbeidstimerNormalUke: normaltAntallFeil
                }
            }, {
                avvik: {
                    arbeidsgrad: antallFeil,
                    arbeidstimerNormalUke: normaltAntallFeil
                }
            }])
        });

        it("Skal validere arbeidsgrad når man har jobbet mer enn planlagt", () => {
            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: true,
                avvik: {
                    enhet: "timer",
                    arbeidstimerNormalUke: "55",
                }
            }, {
                jobbetMerEnnPlanlagt: true,
            }]
            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
            expect(res.aktiviteter[0]).to.deep.equal({
                avvik: {
                    timer: antallFeil,
                }
            });
            expect(res.aktiviteter[1]).to.deep.equal({
                avvik: {
                    arbeidsgrad: antallFeil,
                    arbeidstimerNormalUke: normaltAntallFeil
                }
            })
        });

        it("Skal validere arbeidsgrad når man har jobbet mer enn planlagt og timer er en tom streng", () => {
            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: true,
                avvik: {
                    timer: "",
                    enhet: "timer",
                    arbeidstimerNormalUke: "55",
                }
            }, {
                jobbetMerEnnPlanlagt: true,
            }]
            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
            expect(res.aktiviteter[0]).to.deep.equal({
                avvik: {
                    timer: antallFeil,
                }
            });
            expect(res.aktiviteter[1]).to.deep.equal({
                avvik: {
                    arbeidsgrad: antallFeil,
                    arbeidstimerNormalUke: normaltAntallFeil
                }
            })
        });

        it("Skal ikke validere arbeidsgrad når man har jobbet mer enn planlagt og oppgitt arbeidsgrad", () => {
            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: true,
                avvik: {
                    arbeidsgrad: "50",
                    enhet: "prosent",
                    arbeidstimerNormalUke: "55"
                }
            }, {
                jobbetMerEnnPlanlagt: true,
            }]
            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
            expect(res.aktiviteter).to.deep.equal([{}, {
                avvik: {
                    arbeidsgrad: antallFeil,
                    arbeidstimerNormalUke: normaltAntallFeil
                }
            }])
        });

        it("Skal ikke validere om arbeidsgrad er over 100%", () => {
            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: true,
                avvik: {
                    arbeidsgrad: 101,
                    enhet: "prosent",
                    arbeidstimerNormalUke: "37,5"
                }
            }, {
                jobbetMerEnnPlanlagt: false,
            }];
            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
            expect(res.aktiviteter).to.deep.equal([{
                avvik: {
                    arbeidsgrad: overHundreFeil,
                }
            }, {}])
        });




        it("Skal ikke validere dersom oppgitt arbeidsgrad er laver enn (100 - sykmeldt grad)", () => {

            let _soknad = getSoknad({
                "aktiviteter": [{
                    "periode": {
                        "fom": "2017-16-01",
                        "tom": "2017-16-25"
                    },
                    "grad": 50,
                    "avvik": null
                }]
            });

            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: true,
                avvik: {
                    arbeidsgrad: 45,
                    enhet: "prosent",
                    arbeidstimerNormalUke: "37,5"
                },
                grad: 50,
            }];

            const res = validate(values, { sykepengesoknad:_soknad, sendTilFoerDuBegynner });

            expect(res.aktiviteter).to.deep.equal([{
                avvik: {
                    arbeidsgrad: ikkeJobbetMerEnnGraderingProsentFeil,
                }
            }])
        });

        it("Skal ikke validere dersom oppgitt timer gir lavere arbeidsgrad enn gradering", () => {

            let _soknad = getSoknad({
                "aktiviteter": [{
                    "periode": {
                        "fom": "2017-16-01",
                        "tom": "2017-16-25"
                    },
                    "grad": 50,
                    "avvik": null
                }]
            });

            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: true,
                avvik: {
                    timer: "10",
                    enhet: "timer",
                    arbeidstimerNormalUke: "37,5"
                },
                grad: 50,
            }];

            const res = validate(values, { sykepengesoknad:_soknad, sendTilFoerDuBegynner });

            expect(res.aktiviteter).to.deep.equal([{
                avvik: {
                    timer: ikkeJobbetMerEnnGraderingTimerFeil,
                }
            }])
        });

        it("Skal ikke validere tall i prosent over 100", () => {
            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: true,
                avvik: {
                    arbeidsgrad: 101,
                    enhet: "prosent",
                    arbeidstimerNormalUke: "37,5"
                },
                grad: 50,
            }, {
                jobbetMerEnnPlanlagt: false,
            }];

            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });

            expect(res.aktiviteter).to.deep.equal([{
                avvik: {
                    arbeidsgrad: overHundreFeil,
                }
            }, {}])
        });

        it("Skal ikke validere tall i timer over 100", () => {
            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: true,
                avvik: {
                    timer: "101",
                    enhet: "timer",
                    arbeidstimerNormalUke: "37,5"
                },
                grad: 50,
            }, {
                jobbetMerEnnPlanlagt: false,
            }];

            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });

            expect(res.aktiviteter).to.deep.equal([{
                avvik: {
                    timer: overHundreFeil,
                }
            }, {}])
        });

        it("Skal ikke validere normal arbeidstid over 100", () => {
            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: false,
            }, {
                jobbetMerEnnPlanlagt: true,
                avvik: {
                    arbeidsgrad: 70,
                    enhet: "prosent",
                    arbeidstimerNormalUke: "101"
                },
                grad: 50,
            }];

            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });

            expect(res.aktiviteter).to.deep.equal([{},{
                avvik: {
                    arbeidstimerNormalUke: overHundreFeil,
                }
            }])
        });

        it("Skal ikke validere dersom oppgitt (arbeidstimer / normalArbeidstidUke) er lavere enn arbeidsgrad", () => {
            let _soknad = getSoknad({
                "aktiviteter": [{
                    "periode": {
                        "fom": "2017-16-01",
                        "tom": "2017-16-25"
                    },
                    "grad": 50,
                    "avvik": null
                }]
            });

            values.aktiviteter = [{
                jobbetMerEnnPlanlagt: true,
                avvik: {
                    timer: "10",
                    enhet: "timer",
                    arbeidstimerNormalUke: "37,5"
                },
                grad: 50,
            }];

            const res = validate(values, { sykepengesoknad:_soknad, sendTilFoerDuBegynner });

            expect(res.aktiviteter).to.deep.equal([{
                avvik: {
                    timer: "Antall timer du har oppgitt er lavere enn sykmeldingen tilsier. Husk å oppgi hvor mye du har jobbet totalt",
                }
            }])
        });
    });

    describe("Inntektskilde", () => {

        it("Skal validere hvorvidt brukeren har andre inntektskilder", () => {
            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
            expect(res.harAndreInntektskilder).to.equal("Du må svare på om du har andre inntektskilder");
        });

        describe("Dersom brukeren ikke har andre inntektskilder", () => {

            beforeEach(() => {
                values.harAndreInntektskilder = false;
            });

            it("Skal ikke validere hvorvidt brukeren har andre inntektskilder", () => {
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.harAndreInntektskilder).to.be.undefined;
            });

            it("Skal ikke validere hvilke inntektskilder", () => {
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.andreInntektskilder).to.be.undefined;
            });

        });

        describe("Dersom brukeren har andre inntektskilder", () => {
            let res;
            let values;

            beforeEach(() => {
                values = {
                    harAndreInntektskilder: true
                };
            });

            it("Brukeren må velge hvilken inntektskilde", () => {
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.andreInntektskilder).to.deep.equal({
                    _error: "Vennligst oppgi hvilke andre inntektskilder du har"
                })
            });
            
            it("Brukeren må velge hvilken inntektskilde", () => {
                values.andreInntektskilder = [{
                    "ANDRE_ARBEIDSFORHOLD": {
                        avkrysset: false
                    }
                }]
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.andreInntektskilder).to.deep.equal({
                    _error: "Vennligst oppgi hvilke andre inntektskilder du har"
                })
            });

            it("Brukeren må velge hvilken inntektskilde", () => {
                values.andreInntektskilder = [{
                    ANDRE_ARBEIDSFORHOLD: {
                        avkrysset: false
                    }
                }, {
                    FRILANSER: {
                        avkrysset: false,
                    }
                }]
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.andreInntektskilder).to.deep.equal({
                    _error: "Vennligst oppgi hvilke andre inntektskilder du har"
                })
            });

            it("Brukeren må svare på om han/hun er sykmeldt for hver avkrysset inntektskilde (1)", () => {
                values.andreInntektskilder = {
                    "ANDRE_ARBEIDSFORHOLD": {
                        avkrysset: true,
                    },
                    "FRILANSER": {
                        avkrysset: false, 
                    }
                }
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.andreInntektskilder).to.deep.equal({
                    ANDRE_ARBEIDSFORHOLD: {
                        "sykmeldt": "Vennligst svar på om du er sykmeldt"
                    }
                })
            });

            it("Brukeren må svare på om han/hun er sykmeldt for hver avkrysset inntektskilde (2)", () => {
                values.andreInntektskilder = {
                    "ANDRE_ARBEIDSFORHOLD": {
                        avkrysset: true,
                        sykmeldt: false    
                    },
                    "FRILANSER": {
                        avkrysset: false, 
                    }
                }
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.hasOwnProperty("andreInntektskilder")).to.be.false;
            });

            it("Brukeren må svare på om han/hun er sykmeldt for hver avkrysset inntektskilde (3)", () => {
                values.andreInntektskilder = {
                    "ANDRE_ARBEIDSFORHOLD": {
                        avkrysset: true,
                        sykmeldt: true    
                    }, 
                    "FRILANSER": {
                        avkrysset: false, 
                    }
                };
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.hasOwnProperty("andreInntektskilder")).to.be.false;
            });

            it("Brukeren må ikke svare på om han/hun er sykmeldt for ANNET", () => {
                values.andreInntektskilder = {
                    "ANDRE_ARBEIDSFORHOLD": {
                        avkrysset: true,
                        sykmeldt: true    
                    }, 
                    "ANNET": {
                        avkrysset: true, 
                    }
                };
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.hasOwnProperty("andreInntektskilder")).to.be.false;
            });

            it("Skal ikke klage på andre inntektskilder hvis dette er oppgitt", () => {
                const values = {
                  "andreInntektskilder": {
                    "ANDRE_ARBEIDSFORHOLD": {
                      "avkrysset": true,
                      "sykmeldt": false
                    }
                  },
                  "harAndreInntektskilder": true
                };
              const sykepengesoknad = {
                "id": "b2450694-bc57-40cd-a834-34c817ace7e3",
                "status": "NY",
                "innsendtDato": null,
                "opprettetDato": "2017-02-02T00:00:00.000Z",
                "arbeidsgiver": {
                  "navn": "BYGGMESTER BLOM AS",
                  "orgnummer": "***REMOVED***",
                  "naermesteLeder": null
                },
                "identdato": "2017-02-15T00:00:00.000Z",
                "ansvarBekreftet": false,
                "bekreftetKorrektInformasjon": false,
                "arbeidsgiverUtbetalerLoenn": true,
                "egenmeldingsperioder": [],
                "gjenopptattArbeidFulltUtDato": null,
                "ferie": [],
                "permisjon": [],
                "utenlandsopphold": null,
                "aktiviteter": [{
                  "periode": {
                    "fom": "2016-07-15T00:00:00.000Z",
                    "tom": "2016-07-20T00:00:00.000Z"
                  },
                  "grad": 100,
                  "avvik": null
                }],
                "andreInntektskilder": [],
                "utdanning": null
              };

              const res = validate(values, {
                  sykepengesoknad,
                  sendTilFoerDuBegynner
              });

              expect(res.hasOwnProperty("andreInntektskilder")).to.be.false;

            });


        });

    });


    describe("underUtdanningISykmeldingsperioden", () => {
        it("Skal validere underUtdanningISykmeldingsperioden", () => {
            const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
            expect(res.utdanning.underUtdanningISykmeldingsperioden).to.equal("Vennligst svar på om du har vært under utdanning");
        })

        describe("Hvis brukeren ikke har vært under utdanning", () => {
            beforeEach(() => {
                values.underUtdanningISykmeldingsperioden = false;
            });

            it("Skal ikke validere underUtdanningISykmeldingsperioden", () => {
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.underUtdanningISykmeldingsperioden).to.be.undefined;
            });

        });


        describe("Hvis brukeren har vært under utdanning", () => {
            beforeEach(() => {
                values.utdanning = {
                    underUtdanningISykmeldingsperioden: true,
                };
            });

            it("Skal ikke validere underUtdanningISykmeldingsperioden", () => {
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.underUtdanningISykmeldingsperioden).to.be.undefined;
            });

            describe("utdanningStartdato", () => {
                it("Det skal validere dersom feltet ikke er utfylt", () => {
                    const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                    expect(res.utdanning.utdanningStartdato).to.equal("Vennligst oppgi når du startet på utdanningen");
                });

                it("Skal ikke validere dersom felter er utfylt", () => {
                    values.utdanning.utdanningStartdato = "14.01.2017"
                    const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                    expect(res.utdanning.utdanningStartdato).to.be.undefined;
                });

                it("Skal klage sin nød hvis oppgitt dato er etter tom-dato i siste periode i sykmeldingen", () => {
                    const sykepengesoknad = getSoknad({
                        "aktiviteter": [{
                          "periode": {
                            "fom": "2016-07-15T00:00:00.000Z",
                            "tom": "2016-07-20T00:00:00.000Z"
                          },
                          "grad": 100,
                          "avvik": null
                        }],
                    })
                    values.utdanning.utdanningStartdato = "21.07.2016";
                    const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                    expect(res.utdanning.utdanningStartdato).to.equal("Datoen kan ikke være etter sykmeldingsperioden gikk ut den 20.07.2016");
                });

                it("Skal være happy-go-lucky hvis oppgitt dato er samme dag som tom-dato i siste periode i sykmeldingen", () => {
                    const sykepengesoknad = getSoknad({
                        "aktiviteter": [{
                          "periode": {
                            "fom": "2016-07-15T00:00:00.000Z",
                            "tom": "2016-07-20T00:00:00.000Z"
                          },
                          "grad": 100,
                          "avvik": null
                        }],
                    })
                    values.utdanning.utdanningStartdato = "20.07.2016";
                    const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                    expect(res.utdanning.utdanningStartdato).to.be.undefined;
                });

                it("Skal være happy-go-lucky hvis oppgitt dato er før tom-dato i siste periode i sykmeldingen", () => {
                    const sykepengesoknad = getSoknad({
                        "aktiviteter": [{
                          "periode": {
                            "fom": "2016-07-15T00:00:00.000Z",
                            "tom": "2016-07-20T00:00:00.000Z"
                          },
                          "grad": 100,
                          "avvik": null
                        }],
                    })
                    values.utdanning.utdanningStartdato = "19.07.2016";
                    const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                    expect(res.utdanning.utdanningStartdato).to.be.undefined;
                });

            }); 

            describe("erUtdanningFulltidsstudium", () => {
                
                it("Skal validere dersom feltet ikke er utfylt", () => {
                    const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                    expect(res.utdanning.erUtdanningFulltidsstudium).to.equal("Vennligst svar på om utdanningen er et fulltidsstudium");
                });

                it("Skal ikke validere dersom feltet er utfylt med ja", () => {
                    values.utdanning.erUtdanningFulltidsstudium = true;
                    const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                    expect(res.utdanning.erUtdanningFulltidsstudium).to.be.undefined;
                });

                it("Skal ikke validere dersom feltet er utfylt med nei", () => {
                    values.utdanning.erUtdanningFulltidsstudium = false;
                    const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                    expect(res.utdanning.erUtdanningFulltidsstudium).to.be.undefined;
                });

            });

        });

        describe("Hvis brukeren ikke har vært under utdanning", () => {
            beforeEach(() => {
                values.utdanning = {
                    underUtdanningISykmeldingsperioden: false
                }
            })

            it("Skal ikke validere at utdanningStartdato er påkrevd", () => {
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.utdanningStartdato).to.be.undefined;
            });

            it("Skal ikke validere at erUtdanningFulltidsstudium er påkrevd", () => {
                const res = validate(values, { sykepengesoknad, sendTilFoerDuBegynner });
                expect(res.erUtdanningFulltidsstudium).to.be.undefined;
            });
        });

    });


});