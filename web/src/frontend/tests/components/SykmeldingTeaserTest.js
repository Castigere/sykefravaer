import chai from 'chai';
import React from 'react'
import {mount, shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());
const expect = chai.expect;
import ledetekster from "../ledetekster_mock.js";
import SykmeldingTeaser from "../../js/components/SykmeldingTeaser.js";
import getSykmelding from "../mockSykmeldinger.js";

describe("SykmeldingTeaser", () => {
    it("Viser datoer", function () {
        const sykmelding = {
            mulighetForArbeid: {
                perioder: [{
                    fom: "2016-02-02T00:00:00Z",
                    tom: "2016-02-16T00:00:00Z",
                    grad: "100"
                }],
            }
        };
        const teaser = shallow(<SykmeldingTeaser sykmelding={getSykmelding(sykmelding)} ledetekster={ledetekster}/>);
        expect(teaser.find(".js-title").text()).to.contain("fra 02.02.2016 til 16.02.2016");
        expect(teaser.find(".js-title").text()).to.contain("Sykmelding");
    });

    it("Viser arbeidsgiver dersom arbeidsgiver finnes", function () {
        const teaser = mount(<SykmeldingTeaser sykmelding={getSykmelding({
            mulighetForArbeid: {
                perioder: [{
                    fom: "2016-02-02T00:00:00Z",
                    tom: "2016-02-16T00:00:00Z",
                    grad: "100",
                }],
            },
            arbeidsgiver: "Bekk Consulting AS",
        })} ledetekster={ledetekster}/>);

        expect(teaser.find(".js-periode").text()).to.contain("Bekk Consulting AS")
    });

    it("Viser ikke arbeidsgiver dersom arbeidsgiver ikke finnes", function() {
        const teaser = mount(<SykmeldingTeaser sykmelding={getSykmelding({
            arbeidsgiver: null
        })} ledetekster={ledetekster} />);
        expect(teaser.text()).to.not.contain("fra null")
    });

    it("Viser ikke grad dersom grad ikke finnes", function() {
        const teaser = mount(<SykmeldingTeaser sykmelding={getSykmelding({
            mulighetForArbeid: {
                perioder: [{
                    fom: "2016-02-02T00:00:00Z",
                    tom: "2016-02-16T00:00:00Z",
                    grad: null
                }]
            }
        })} ledetekster={ledetekster} />);
        expect(teaser.text()).to.not.contain("Du er null %")
    });    

    it("Skal være et <article />-element", function () {
        const teaser = shallow(<SykmeldingTeaser sykmelding={{
			arbeidsgiver: "Bekk Consulting AS",
			mulighetForArbeid: {
			    perioder: [{
                    fom: "2016-02-02T00:00:00Z",
                    tom: "2016-02-16T00:00:00Z",
                    grad: "100"
                }]
			}
		}}/>);
        expect(teaser).to.have.tagName("article")
    });



});