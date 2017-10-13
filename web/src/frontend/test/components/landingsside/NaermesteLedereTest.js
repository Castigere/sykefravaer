import chai from 'chai';
import React from 'react'
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import ledetekster from "../../mockLedetekster";
import NaermesteLedere from '../../../js/components/landingsside/NaermesteLedere';
import BekreftFeilLederContainer from '../../../js/containers/landingsside/BekreftFeilLederContainer';
import Lightbox from '../../../js/components/Lightbox';
import { setLedetekster } from 'digisyfo-npm';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("NaermesteLedere", () => {

    let ledere;

    beforeEach(() => {
        setLedetekster({
            'din-situasjon.naermeste-leder.om': "Din nærmeste leder i %ORGANISASJONSNAVN% er %LEDER%",
            'din-situasjon.naermeste-leder.meld-feil': "Meld feil",
        });
        ledere = [{
            navn: "Ole Olsen",
            orgnummer: "123456789",
            organisasjonsnavn: "Solstrålen Barnehage"
        }, {
            navn: "Ole Larsen",
            orgnummer: "444555",
            organisasjonsnavn: "Solstrålen Pizza",
            avkreftet: true,
        }]
    })

    it("Skal vise ledere", () => {
        const compo = shallow(<NaermesteLedere ledere={ledere} />)
        expect(compo.text()).to.contain("Ole Olsen");
        expect(compo.text()).to.contain("Solstrålen Barnehage");
    });

    it("Skal vise avkreftede ledere", () => {
        const compo = shallow(<NaermesteLedere ledere={ledere} />)
        expect(compo.find(".leder--avkreftet")).to.have.length(1);
    });

    it("Skal bare vise feil-knapp for aktive ledere", () => {
        const compo = shallow(<NaermesteLedere ledere={ledere} />);
        expect(compo.find(".js-feil")).to.have.length(1);
    })

    it("Skal vise en lightbox når man klikker på Dette er feil", () => {
        const compo = shallow(<NaermesteLedere ledere={ledere} />);
        compo.find(".js-feil").simulate("click");
        expect(compo.find(Lightbox)).to.have.length(1);
    });

    it("Skal vise BekreftFeilLederContainer når man klikker på Dette er feil", () => {
       const compo = shallow(<NaermesteLedere ledere={ledere} />);
       compo.find(".js-feil").simulate("click");
       expect(compo.find(BekreftFeilLederContainer)).to.have.length(1); 
    });

    it("Skal vise tekst om lederen", () => {
        const compo = shallow(<NaermesteLedere ledere={ledere} />);
        expect(compo.text()).to.contain("Din nærmeste leder i Solstrålen Barnehage er Ole Olsen");
        expect(compo.text()).to.contain("Meld feil");
    })

});