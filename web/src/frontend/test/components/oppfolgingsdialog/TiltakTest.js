import chai from 'chai';
import React from 'react'
import {mount, shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import ledetekster from "../../mockLedetekster";
import Tiltak from "../../../js/components/oppfolgingsdialoger/Tiltak";
import {
    RenderNotifikasjonBoksSuksess,
    RenderNotifikasjonBoks,
    RenderTiltakKnapper,
    RenderOpprettTiltak,
    RenderOppfolgingsdialogTiltakTabell,
} from "../../../js/components/oppfolgingsdialoger/Tiltak";
import {
    OppfolgingsdialogInfoboks,
    LagreTiltakSkjema,
    OppfolgingsdialogSide,
} from "oppfolgingsdialog-npm";
import { setLedetekster } from 'digisyfo-npm';
import getOppfolgingsdialog from '../../mockOppfolgingsdialoger';

chai.use(chaiEnzyme());
const expect = chai.expect;

const oppfolgingsdialog = getOppfolgingsdialog();

describe("Tiltak", () => {

    let component;

    beforeEach(() => {
        setLedetekster(ledetekster);
    });

    it("Skal vise en OppfolgingsdialogSide", () => {
        component = shallow(<Tiltak oppfolgingsdialog={oppfolgingsdialog} />);
        expect(component.find(OppfolgingsdialogSide)).to.have.length(1);
    });

    it("Skal vise en OppfolgingsdialogInfoboks, om det ikke er tiltak", () => {
        const oppfolgingsdialog = Object.assign({}, oppfolgingsdialog, {tiltakListe: []});
        component = shallow(<Tiltak oppfolgingsdialog={oppfolgingsdialog} />);
        expect(component.find(OppfolgingsdialogInfoboks)).to.have.length(1);
    });

    it("Skal vise RenderOpprettTiltak, om det ikke er tiltak og visTiltakSkjema er true", () => {
        const oppfolgingsdialog = Object.assign({}, oppfolgingsdialog, {tiltakListe: []});
        component = shallow(<Tiltak oppfolgingsdialog={oppfolgingsdialog} />);
        component.setState({
            visTiltakSkjema: true,
        });
        expect(component.find(RenderOpprettTiltak)).to.have.length(1);
    });

    it("Skal vise en overskrift, om det er tiltak", () => {
        component = shallow(<Tiltak oppfolgingsdialog={oppfolgingsdialog} />);
        expect(component.find('h2')).to.have.length(1);
    });

    it("Skal vise RenderNotifikasjonBoks, om det er tiltak som er lagt til av arbeidsgiver ", () => {
        const oppfolgingsdialog = Object.assign({}, oppfolgingsdialog, {
            sykmeldtAktoerId: '***REMOVED***',
            tiltakListe: [{opprettetAv: {aktoerId: "***REMOVED***"}}]
        });
        component = shallow(<Tiltak oppfolgingsdialog={oppfolgingsdialog} />);
        expect(component.find(RenderNotifikasjonBoks)).to.have.length(1);
    });

    it("Skal vise RenderNotifikasjonBoksSuksess, om det er tiltak og en tiltak er lagret", () => {
        component = shallow(<Tiltak oppfolgingsdialog={oppfolgingsdialog}
                                    tiltakLagret={true} />);
        expect(component.find(RenderNotifikasjonBoksSuksess)).to.have.length(1);
    });

    it("Skal vise RenderOppfolgingsdialogTiltakTabell, om det er tiltak", () => {
        component = shallow(<Tiltak oppfolgingsdialog={oppfolgingsdialog} />);
        expect(component.find(RenderOppfolgingsdialogTiltakTabell)).to.have.length(1);
    });

    it("Skal vise LagreTiltakSkjema, om det er tiltak og visTiltakSkjema er true", () => {
        component = shallow(<Tiltak oppfolgingsdialog={oppfolgingsdialog} />);
        component.setState({
            visTiltakSkjema: true,
        });
        expect(component.find(LagreTiltakSkjema)).to.have.length(1);
    });


    describe("RenderOpprettTiltak", () => {

        it("Skal vise en overskrift", () => {
            component = shallow(<RenderOpprettTiltak />);
            expect(component.find('h2')).to.have.length(1);
        });

        it("Skal vise et LagreTiltakSkjema", () => {
            component = shallow(<RenderOpprettTiltak />);
            expect(component.find(LagreTiltakSkjema)).to.have.length(1);
        });

    });

    describe("RenderTiltakKnapper", () => {

        it("Skal vise 1 knapp", () => {
            component = shallow(<RenderTiltakKnapper />);
            expect(component.find('button')).to.have.length(1);
        });

    });

});