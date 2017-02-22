import chai from 'chai';
import React from 'react'
import {mount, shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { FieldArray, Field } from 'redux-form';
import Checkbox from '../../js/components/skjema/Checkbox';

import configureMockStore from 'redux-mock-store';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';

chai.use(chaiEnzyme());
const expect = chai.expect;

import ErOpplysningeneRiktige, { RenderFeilaktigeOpplysninger, SykmeldingFeilaktigeOpplysningerInfo, DuTrengerNySykmelding, DuKanBrukeSykmeldingenDinArbeidsgiver, DuKanBrukeSykmeldingenDinDiagnoseAndre  } from '../../js/components/sykmelding/ErOpplysningeneRiktige';
import JaEllerNei from '../../js/components/sykepengesoknad/JaEllerNei';

describe("ErOpplysningeneRiktige - ", () => {

    let skjemaData = {};
    
    beforeEach(() => {
        skjemaData.values = {};
        skjemaData.values.opplysningeneErRiktige = false;
    });


    it("Inneholder en ja/nei", () => {
        const comp = shallow(<ErOpplysningeneRiktige ledetekster={{}} skjemaData={skjemaData}/>);
        expect(comp.find(JaEllerNei)).to.be.length(1);
    });

    it("inneholder et fieldarray", () => {
        const comp = shallow(<ErOpplysningeneRiktige ledetekster={{}} skjemaData={skjemaData}/>);
        const array = comp.find(FieldArray);

        expect(array.prop("component")).to.deep.equal(RenderFeilaktigeOpplysninger);
        expect(array.prop("name")).to.equal("feilaktigeOpplysninger");
        expect(array.prop("fields")).to.deep.equal(['periode', 'sykmeldingsgrad', 'arbeidsgiver', 'diagnose', 'andre']);
        expect(comp.find(FieldArray)).to.be.length(1);
    });

    it("skal vise riktig spoersmal", () => {
        const comp = shallow(<ErOpplysningeneRiktige ledetekster={{}} skjemaData={skjemaData}/>)
        expect(comp.find(JaEllerNei).prop("spoersmal")).to.equal("Er opplysningene riktige?");
    });

    describe("RenderFeilaktigeOpplysninger", () => {

        let component;

        beforeEach(() => {
            const meta = {
                error: "Feilmelding",
                touched: false,
            };
            const fields = ['periode', 'sykmeldingsgrad', 'arbeidsgiver', 'diagnose', 'andre'];
            component = shallow(<RenderFeilaktigeOpplysninger fields={fields} ledetekster={{}} meta={meta} skjemaData={skjemaData}/>);
        });

        it("Skal inneholde ett checkbox-Field per field", () => {
            expect(component.find(Field)).to.have.length(5);
            const names = ["feilaktigeOpplysninger.periode",
                "feilaktigeOpplysninger.sykmeldingsgrad",
                "feilaktigeOpplysninger.arbeidsgiver",
                "feilaktigeOpplysninger.diagnose",
                "feilaktigeOpplysninger.andre"];
            for (let i = 0; i < 5; i++) {
                const c = component.find(Field).at(i);
                expect(c.prop("component")).to.deep.equal(Checkbox);
                expect(c.prop("name")).to.equal(names[i]);
            }
        });

        it("viser sykmeldingFeilaktigeOpplysningerInfo", () => {
            const meta = {
                error: "Feilmelding",
                touched: false,
            };

            const fields = ['periode', 'sykmeldingsgrad', 'arbeidsgiver', 'diagnose', 'andre'];

            skjemaData.values = Object.assign({}, skjemaData.values, { feilaktigeOpplysninger: { arbeidsgiver: true }});
            const comp = shallow(<RenderFeilaktigeOpplysninger fields={fields} ledetekster={{}} meta={meta} skjemaData={skjemaData} />);

            expect(comp.find(SykmeldingFeilaktigeOpplysningerInfo)).to.be.length(1);
        });
    });

    describe("SykmeldingFeilaktigeOpplysningerInfo", () => {
        it("viser DuTrengerNySykmelding ved periode eller sykmeldingsgrad", () => {
            let comp = shallow(<SykmeldingFeilaktigeOpplysningerInfo feilaktigeOpplysninger={{ periode: true}}/> );
            expect(comp.find(DuTrengerNySykmelding)).to.be.length(1);

            comp = shallow(<SykmeldingFeilaktigeOpplysningerInfo feilaktigeOpplysninger={{ sykmeldingsgrad: true}}/> );
            expect(comp.find(DuTrengerNySykmelding)).to.be.length(1);
        });

        it("viser DuKanBrukeSykmeldingenDinArbeidsgiver", () => {
            let comp = shallow(<SykmeldingFeilaktigeOpplysningerInfo feilaktigeOpplysninger={{ arbeidsgiver: true}}/> );
            expect(comp.find(DuKanBrukeSykmeldingenDinArbeidsgiver)).to.be.length(1);
        });

        it("viser DuKanBrukeSykmeldingenDinDiagnoseAndre ved diagnose eller andre", () => {
            let comp = shallow(<SykmeldingFeilaktigeOpplysningerInfo feilaktigeOpplysninger={{ andre: true}}/> );
            expect(comp.find(DuKanBrukeSykmeldingenDinDiagnoseAndre)).to.be.length(1);

            comp = shallow(<SykmeldingFeilaktigeOpplysningerInfo feilaktigeOpplysninger={{ diagnose: true}}/> );
            expect(comp.find(DuKanBrukeSykmeldingenDinDiagnoseAndre)).to.be.length(1);
        });

        it("viser null ellers", () => {
            let comp = shallow(<SykmeldingFeilaktigeOpplysningerInfo feilaktigeOpplysninger={{}}/> );
            expect(comp.find(DuKanBrukeSykmeldingenDinDiagnoseAndre)).to.be.length(0);
            expect(comp.find(DuKanBrukeSykmeldingenDinArbeidsgiver)).to.be.length(0);
            expect(comp.find(DuTrengerNySykmelding)).to.be.length(0);
        });
    });
});

