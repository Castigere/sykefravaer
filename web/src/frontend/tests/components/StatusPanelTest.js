import chai from 'chai';
import React from 'react'
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import ledetekster from "../ledetekster_mock.js";
import getSykmelding from "../mockSykmeldinger.js";
import { ARBEIDSGIVER, INNSENDT_DATO, ORGNUMMER, STATUS } from '../../js/nokkelopplysninger/NokkelOpplysningerEnum';
import StatusPanel from '../../js/components/StatusPanel';
import StatusOpplysning from "../../js/nokkelopplysninger/StatusOpplysning";
chai.use(chaiEnzyme());
const expect = chai.expect;

describe("StatusPanelTest", () => {
    let component;

    it("Ingen rader eller elementer gir ingen output", () => {
        const nokkelopplysninger = [];

        component = shallow(<StatusPanel sykmelding={getSykmelding()} ledetekster={ledetekster} nokkelopplysninger={nokkelopplysninger} />);
        expect(component.find(StatusOpplysning)).to.have.length(0);
        expect(component.find(".rad-container")).to.have.length(0);
    });

    it("En enkelt rad, med et element gir en container og et element", () => {
        const nokkelopplysninger = [[STATUS]];

        component = shallow(<StatusPanel sykmelding={getSykmelding()} ledetekster={ledetekster} nokkelopplysninger={nokkelopplysninger} />);
        expect(component.find(StatusOpplysning)).to.have.length(1);
        expect(component.find(".rad-container")).to.have.length(1);
    });

    it("En enkelt rad, med to elementer gir en container og to elementer", () => {
        const nokkelopplysninger = [[STATUS, INNSENDT_DATO]];

        component = shallow(<StatusPanel sykmelding={getSykmelding()} ledetekster={ledetekster} nokkelopplysninger={nokkelopplysninger} />);
        expect(component.find(StatusOpplysning)).to.have.length(2);
        expect(component.find(".rad-container")).to.have.length(1);
    });

    it("To rader, med et element hver gir to containere og to elementer", () => {
        const nokkelopplysninger = [[STATUS], [INNSENDT_DATO]];

        component = shallow(<StatusPanel sykmelding={getSykmelding()} ledetekster={ledetekster} nokkelopplysninger={nokkelopplysninger} />);
        expect(component.find(StatusOpplysning)).to.have.length(2);
        expect(component.find(".rad-container")).to.have.length(2);
    });

    it("To rader, med tre elementer hver gir tre containere og 9 elementer", () => {
        const nokkelopplysninger = [[STATUS, INNSENDT_DATO, ARBEIDSGIVER], [STATUS, INNSENDT_DATO, ARBEIDSGIVER], [STATUS, INNSENDT_DATO, ARBEIDSGIVER]];

        component = shallow(<StatusPanel sykmelding={getSykmelding()} ledetekster={ledetekster} nokkelopplysninger={nokkelopplysninger} />);
        expect(component.find(StatusOpplysning)).to.have.length(9);
        expect(component.find(".rad-container")).to.have.length(3);
    });

    it("To rader, med 3/2/1 elementer hver gir tre containere og 6 elementer", () => {
        const nokkelopplysninger = [[STATUS, INNSENDT_DATO, ARBEIDSGIVER], [STATUS, INNSENDT_DATO], [STATUS]];

        component = shallow(<StatusPanel sykmelding={getSykmelding()} ledetekster={ledetekster} nokkelopplysninger={nokkelopplysninger} />);
        expect(component.find(StatusOpplysning)).to.have.length(6);
        expect(component.find(".rad-container")).to.have.length(3);
    });

});