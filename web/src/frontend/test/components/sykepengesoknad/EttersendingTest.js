import chai from 'chai';
import React from 'react'
import {mount, shallow, render} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme());
const expect = chai.expect;
import { Ettersending, EttersendLightbox, EttersendDialogConnected, EttersendKvittering } from '../../../js/components/sykepengesoknad/Ettersending';
import { sendSykepengesoknadTilArbeidsgiver, sendSykepengesoknadTilNAV } from '../../../js/actions/sykepengesoknader_actions';
import Lightbox from '../../../js/components/Lightbox';
import  { getSoknad } from '../../mockSoknader';
import ledetekster from '../../mockLedetekster';
import { Varselstripe, setLedetekster } from 'digisyfo-npm';
import sinon from 'sinon';

describe("Ettersending", () => {

    let component; 
    let sykepengesoknad = getSoknad();

    describe("Ettersending med sendtTilNAVDato", () => {
        beforeEach(() => {
            setLedetekster({
                "sykepengesoknad.ettersending.knapp.send-til-nav": "Send til NAV!",
                "sykepengesoknad.ettersending.knapp.send-til-arbeidsgiver": "Send til arbeidsgiver",
            });
            sykepengesoknad = getSoknad({
                sendtTilNAVDato: null,
                sendtTilArbeidsgiverDato: new Date("2017-02-07"),
            })
            component = shallow(<Ettersending sykepengesoknad={sykepengesoknad} manglendeDato="sendtTilNAVDato" ledetekstKeySuffix="send-til-nav" />);
        });

        it("Skal vise en knapp med teksten 'Send til NAV'", () => {
            expect(component.find(".js-trigger").text()).to.equal("Send til NAV!");
        });

        it("Viser ingen EttersendLightbox", () => {
            expect(component.find(EttersendLightbox)).to.have.length(0);
        });

        it("Viser ingenting hvis sendtTilNAVDato er satt", () => {
            sykepengesoknad = getSoknad({
                sendtTilNAVDato: new Date("2017-02-07"),
                sendtTilArbeidsgiverDato: new Date("2017-02-07"),
            })
            component = shallow(<Ettersending sykepengesoknad={sykepengesoknad} manglendeDato="sendtTilNAVDato" ledetekstKeySuffix="send-til-nav" />);
            expect(component.html()).to.equal(null);
        });

        it("Viser EttersendLightbox hvis sendtTilNAVDato er satt og visKvittering er true", () => {
            sykepengesoknad = getSoknad({
                sendtTilNAVDato: new Date("2017-02-07"),
                sendtTilArbeidsgiverDato: new Date("2017-02-07"),
            });
            component = shallow(<Ettersending sykepengesoknad={sykepengesoknad} manglendeDato="sendtTilNAVDato" ledetekstKeySuffix="send-til-nav" />);
            component.setState({
                visKvittering: true,
                visLightbox: true,
            });
            expect(component.find(".js-trigger")).to.have.length(0);
            expect(component.find(EttersendLightbox)).to.have.length(1);
        });

        describe("Når man klikker på knappen", () => {
            beforeEach(() => {
                const preventDefault = sinon.spy();
                component.find(".js-trigger").simulate("click", {
                    preventDefault,
                });
            });

            it("Viser en EttersendLightbox", () => {
                const l = component.find(EttersendLightbox);
                expect(l).to.have.length(1);
                expect(l.prop("sykepengesoknad")).to.deep.equal(sykepengesoknad);
                expect(l.prop("manglendeDato")).to.equal("sendtTilNAVDato");
                expect(l.prop("ledetekstKeySuffix")).to.equal("send-til-nav");
            });

        });

    });

    describe("EttersendLightbox", () => {
        it("Inneholder en EttersendDialogConnected hvis visKvittering === false", () => {
            component = shallow(<EttersendLightbox sykepengesoknad={sykepengesoknad} manglendeDato="sendtTilNAVDato" ledetekstKeySuffix="send-til-nav" visKvittering={false} />)
            expect(component.find(EttersendDialogConnected)).to.have.length(1);
        });

        it("Inneholder en EttersendKvittering hvis visKvittering === true", () => {
            component = shallow(<EttersendLightbox sykepengesoknad={sykepengesoknad} manglendeDato="sendtTilNAVDato" ledetekstKeySuffix="send-til-nav" visKvittering={true} />)
            expect(component.find(EttersendKvittering)).to.have.length(1);
        });
    })

});