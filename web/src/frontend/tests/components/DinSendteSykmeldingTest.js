import chai from 'chai';
import React from 'react'
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import ledetekster from "../ledetekster_mock.js";
import getSykmelding from "../mockSykmeldinger.js";

chai.use(chaiEnzyme());
const expect = chai.expect;

import DinSendteSykmelding from "../../js/components/DinSendteSykmelding";
import DineSykmeldingOpplysninger from "../../js/components/DineSykmeldingOpplysninger";
import StatusPanel from "../../js/components/StatusPanel";
import ArbeidsgiversSykmelding from "../../js/components/ArbeidsgiversSykmelding";
import FlereOpplysninger from "../../js/components/FlereOpplysninger";

describe("DinSendteSykmelding", () => {

    let component;

    it("Skal vise kvittering ", () => {
        let sykmelding = getSykmelding();
        sykmelding.status = 'SENDT';
        component = shallow(<DinSendteSykmelding sykmelding={sykmelding} ledetekster={ledetekster}/>);
        expect(component.find(StatusPanel)).to.have.length(1)
    });

    it("Skal vise DineSykmeldingOpplysninger ", () => {
        let sykmelding = getSykmelding();
        sykmelding.status = 'SENDT';
        component = shallow(<DinSendteSykmelding sykmelding={sykmelding} ledetekster={ledetekster}/>);
        expect(component.find(DineSykmeldingOpplysninger)).to.have.length(1)
    });

    it("Skal vise arbedsgiveropplysninger dersom status er sendt", () => {
        let sykmelding = getSykmelding();
        sykmelding.status = 'SENDT';
        component = shallow(<DinSendteSykmelding sykmelding={sykmelding} ledetekster={ledetekster}/>);
        expect(component.find(ArbeidsgiversSykmelding)).to.have.length(1)
    });

}); 