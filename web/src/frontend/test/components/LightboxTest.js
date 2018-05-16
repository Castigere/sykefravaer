import chai from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import Lightbox from '../../js/components/Lightbox';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Lightbox', () => {
    let component;
    let onClose;

    beforeEach(() => {
        onClose = sinon.spy();
        component = mount(<Lightbox onClose={onClose}><p>Innhold</p></Lightbox>);
    });

    it('Skal sette fokus på lightbox', () => {
        component = mount(<Lightbox onClose={onClose} />);
        expect(document.activeElement.className).to.contain('lightbox__innhold');
    });

    it('Skal sette erApen til true', () => {
        expect(component.state()).to.deep.equal({
            erApen: true,
            tabIndex: '-1',
        });
    });

    it('Skal vise children', () => {
        expect(component.contains(<p>Innhold</p>)).to.equal(true);
    });

    describe('Når man klikker på lukk', () => {
        beforeEach(() => {
            component.find('.js-lukk').simulate('click');
        });

        it('Skal sette erApen til false', () => {
            expect(component.state().erApen).to.equal(false);
        });

        it('Skal kalle på onClose', () => {
            expect(onClose.calledOnce).to.equal(true);
        });

        it('Skal ikke vise children', () => {
            expect(component.contains(<p>Innhold</p>)).to.equal(false);
        });
    });
});
