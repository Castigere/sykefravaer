import chai from 'chai';
import React from 'react'
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());
const expect = chai.expect;

import Soknader from "../../../js/components/sykepengesoknader/Soknader";
import SoknaderTeasere from "../../../js/components/sykepengesoknader/SoknaderTeasere";
import Sidetopp from "../../../js/components/Sidetopp";
import { setLedetekster } from 'digisyfo-npm';

describe("Soknader", () => {

    const ledetekster = {
        'soknader.introduksjonstekst': 'introtekst',
        'soknader.sidetittel': 'tittel',
    };

    let component;
    let soknad1;
    let soknad2;
    let soknad3;
    let soknad4;
    let soknad5;

    beforeEach(() => {
        setLedetekster(ledetekster);

        soknad1 = {
            id: "1",
            status: "KORRIGERT",
            sendtTilNAVDato: new Date("2017-02-04"),
            opprettetDato: new Date("2017-04-01"),
            aktiviteter: [{
                periode: {
                    fom: new Date("2017-05-01"),
                    tom: new Date("2017-06-01"),
                }
            }]
        };

        soknad2 = {
            id: "2",
            status: "SENDT",
            sendtTilNAVDato: new Date("2017-02-06"),
            sendtTilArbeidsgiverDato: new Date("2017-02-08"),
            opprettetDato: new Date("2017-03-01"),
            aktiviteter: [{
                periode: {
                    fom: new Date("2017-04-01"),
                    tom: new Date("2017-04-20"),
                }
            }]
        };

        soknad3 = {
            id: "3",
            korrigerer: "1",
            status: "KORRIGERT",
            sendtTilNAVDato: new Date("2017-02-05"),
            sendtTilArbeidsgiverDato: new Date("2017-02-10"),
            opprettetDato: new Date("2017-07-01"),
            aktiviteter: [{
                periode: {
                    fom: new Date("2017-10-01"),
                    tom: new Date("2017-10-12"),
                }
            }]
        };

        soknad4 = {
            id: "4",
            korrigerer: "3",
            status: "SENDT",
            sendtTilNAVDato: new Date("2017-02-08"),
            sendtTilArbeidsgiverDato: new Date("2017-02-11"),
            opprettetDato: new Date("2017-02-01"),
            aktiviteter: [{
                periode: {
                    fom: new Date("2016-08-01"),
                    tom: new Date("2016-08-12"),
                }
            }, {
                periode: {
                    fom: new Date("2016-08-13"),
                    tom: new Date("2016-08-19"),
                }
            }]
        };

        soknad5 = {
            id: "5",
            status: "NY",
            sendtTilArbeidsgiverDato: new Date("2017-02-01"),
            opprettetDato: new Date("2017-10-01"),
            aktiviteter: [{
                periode: {
                    fom: new Date("2017-05-01"),
                    tom: new Date("2017-06-10"),
                }
            }]
        };
    });

    it('skal vise tittel', () => {
        component = shallow(<Soknader soknader={[]} />);
        expect(component.find(Sidetopp)).to.have.length(1);
    });

    it('skal vise søknader til behandlings boks', () => {
        component = shallow(<Soknader soknader={[]} />);
        expect(component.find(SoknaderTeasere)).to.have.length(1);
    });

    it('viser ikke innsendte om innsendte soknader er tom', () => {
        component = shallow(<Soknader soknader={[]} />);
        expect(component.find(".js-sendt")).to.have.length(0);
    });

    it('Bare nye soknader og utkast sendes videre til SoknaderTeasere', () => {
        component = shallow(<Soknader soknader={[soknad1, soknad2, soknad3, soknad4, soknad5]} />);
        expect(component.find('.js-til-behandling').props().soknader).to.have.length(1);
    });

    it('Viser innsendte søknader om vi har noen', () => {
        const soknad = {id: "1", status: 'SENDT', fom: '01.01.2017', tom: '01.20.2017', arbeidsgiver: 'BEKK Consulting AS', innsendingsDato: '02.01.2017'}

        component = shallow(<Soknader soknader={[soknad]} />);
        expect(component.find(".js-sendt")).to.have.length(1);
    });

    it('Sender søknader videre til SoknaderTeasere', () => {
        component = shallow(<Soknader soknader={[soknad1, soknad2, soknad3, soknad4, soknad5]} />);
        expect(component.find('.js-til-behandling').props().soknader).to.have.length(1);
        expect(component.find('.js-sendt').props().soknader).to.have.length(2);
    });

}); 