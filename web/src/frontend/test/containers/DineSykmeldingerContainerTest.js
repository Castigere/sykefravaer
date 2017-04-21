import chai from 'chai';
import React from 'react'
import {mount, shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import ledetekster from "../mockLedetekster";
import sinon from 'sinon';

chai.use(chaiEnzyme());
const expect = chai.expect;

import { DineSykmldSide, mapStateToProps } from "../../js/containers/DineSykmeldingerContainer";
import AppSpinner from '../../js/components/AppSpinner';
import Feilmelding from '../../js/components/Feilmelding';
import DineSykmeldinger from '../../js/components/sykmeldinger/DineSykmeldinger';

let component;
let sykmeldinger;

describe("DineSykmeldingerContainer", () => {

    let component; 
    let dispatch;

    beforeEach(() => {
        const sykmeldingerArray = [{
            id: 2,
            fnr: "12",
            fornavn: "Per",
            etternavn: "Person",
            sykmelder: "Ove Olsen",
            arbeidsgiver: "Selskapet AS",
            perioder: [{
                fom: "2015-12-31",
                tom: "2016-01-06",
                grad: 67
            }],
            hoveddiagnose: {
                diagnose: "Influensa",
                diagnosesystem: "ICPC",
                diagnosekode: "LP2"
            },
            arbeidsfoerEtterPerioden: true
        }, {
            id: 1,
            fnr: "12",
            fornavn: "Per",
            etternavn: "Person",
            sykmelder: "Ove Olsen",
            arbeidsgiver: "Selskapet AS",
            perioder: [{
                fom: "2015-12-31",
                tom: "2016-01-06",
                grad: 67
            }],
            hoveddiagnose: {
                diagnose: "Influensa",
                diagnosesystem: "ICPC",
                diagnosekode: "LP2"
            },
            arbeidsfoerEtterPerioden: true
        }, {
            id: 3,
            fnr: "12",
            fornavn: "Per",
            etternavn: "Person",
            sykmelder: "Ove Olsen",
            arbeidsgiver: "Selskapet AS",
            perioder: [{
                fom: "2015-12-31",
                tom: "2016-01-06",
                grad: 67
            }],
            hoveddiagnose: {
                diagnose: "Influensa",
                diagnosesystem: "ICPC",
                diagnosekode: "LP2"
            },
            arbeidsfoerEtterPerioden: true
        }];

        sykmeldinger = {
            data: sykmeldingerArray
        }
    })

    describe("mapStateToProps", () => {

        it("skal returnere dineSykmeldinger", function() {
            const res = mapStateToProps({
                dineSykmeldinger: sykmeldinger,
                ledetekster: {
                    data: []
                },
                brukerinfo: {
                    bruker: {},
                    innstillinger: {}
                }
            });
            expect(res.sykmeldinger).to.deep.equal(sykmeldinger.data)
        });

    });

    describe("DineSykmldSide", () => {

        beforeEach(() => {
            dispatch = sinon.spy(); 
        });

        it("Skal vise spinner dersom data hentes", () => {
            let component = shallow(<DineSykmldSide sykmeldinger={[]} henter dispatch={dispatch} />);
            expect(component.contains(<AppSpinner />)).to.equal(true);
        });

        it("Skal ikke spinner dersom data ikke hentes", () => {
            let component = shallow(<DineSykmldSide sykmeldinger={[]} dispatch={dispatch} />);
            expect(component.contains(<AppSpinner />)).to.equal(false);
        });

        it("Skal vise feilmelding dersom henting feilet", () => {
            let component = shallow(<DineSykmldSide sykmeldinger={[]} dispatch={dispatch} hentingFeilet />);
            expect(component.contains(<Feilmelding />)).to.equal(true);
        }); 

        it("Skal vise DineSykmeldinger dersom henting er OK", () => {
            let sykmeldinger = [];
            let component = shallow(<DineSykmldSide sykmeldinger={[]} dispatch={dispatch} />);
            expect(component.find(DineSykmeldinger)).to.have.length(1);
        });     

    })

}); 