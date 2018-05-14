import chai from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { FravaerOgFriskmeldingSkjema } from '../../../../js/components/sykepengesoknad/FravaerOgFriskmelding/FravaerOgFriskmelding';
import AvbrytSoknadContainer from '../../../../js/containers/sykepengesoknad/AvbrytSoknadContainer';
import { getSoknad } from '../../../mockSykepengesoknader';

chai.use(chaiEnzyme());
const expect = chai.expect;


describe('FravaerOgFriskmelding', () => {
    let component;
    let sykepengesoknad;

    beforeEach(() => {
        sykepengesoknad = getSoknad();
        component = shallow(<FravaerOgFriskmeldingSkjema handleSubmit={sinon.spy()} sykepengesoknad={sykepengesoknad} />);
    });

    it('Skal inneholde en AvbrytSoknadContainer', () => {
        expect(component.contains(<AvbrytSoknadContainer sykepengesoknad={sykepengesoknad} />)).to.equal(true);
    });
});
