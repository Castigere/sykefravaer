import chai from 'chai';
import React from 'react'
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import TidslinjeUtdrag, { VelgArbeidssituasjon } from '../../../js/components/landingsside/TidslinjeUtdrag';
import { Radiofaner } from 'digisyfo-npm';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("TidslinjeUtdrag", () => {

    it("Skal vise VelgArbeidssituasjon dersom visning === VALGFRI", () => {
        const component = shallow(<TidslinjeUtdrag antallDager={5} visning="VALGFRI" />);
        expect(component.find(VelgArbeidssituasjon)).to.have.length(1)
    });

    it("Skal ikke vise VelgArbeidssituasjon hvis visning === MED_ARBEIDSGIVER", () => {
        const component = shallow(<TidslinjeUtdrag antallDager={5} visning="MED_ARBEIDSGIVER" />);
        expect(component.find(VelgArbeidssituasjon)).to.have.length(0)
    });

    it("Skal ikke vise VelgArbeidssituasjon hvis visning === UTEN_ARBEIDSGIVER", () => {
        const component = shallow(<TidslinjeUtdrag antallDager={5} visning="UTEN_ARBEIDSGIVER" />);
        expect(component.find(VelgArbeidssituasjon)).to.have.length(0)
    });

    it("Skal ikke vise VelgArbeidssituasjon hvis visning === UTEN_ARBEIDSGIVER", () => {
        const component = shallow(<TidslinjeUtdrag antallDager={5} visning="UTEN_ARBEIDSGIVER" />);
        expect(component.find(VelgArbeidssituasjon)).to.have.length(0);
    });

})