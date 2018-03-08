import chai from 'chai';
import { arbeidssituasjoner } from 'digisyfo-npm';
import { getSkjemaModus } from "../../../js/components/sykmeldingskjema/sykmeldingSkjemaUtils";
import { sykmeldingskjemamodi as modi } from '../../../js/enums/sykmeldingskjemaenums';

const expect = chai.expect;

describe("getSkjemaModus", () => {

    let component;

    it("Skal være GA_VIDERE by default", () => {
        const modus = getSkjemaModus({}, false);
        expect(modus).to.equal(modi.GA_VIDERE)
    })

    it("Skal være AVBRYT dersom periode eller sykmeldingsgrad er feil", () => {
        let values = {
            feilaktigeOpplysninger: [{
                opplysning: "periode",
                avkrysset: true,
            }],
            opplysningeneErRiktige: false,
        }
        const modus = getSkjemaModus(values, false);
        expect(modus).to.equal(modi.AVBRYT)

        values.feilaktigeOpplysninger = [{
            opplysning: "sykmeldingsgrad",
            avkrysset: true,
        }]
        const modus2 = getSkjemaModus(values, false);
        expect(modus2).to.equal(modi.AVBRYT)
    });

    it("Skal være SEND dersom valgtArbeidssituasjon === 'ARBEIDSTAKER'", () => {
        let values = {
            valgtArbeidssituasjon: arbeidssituasjoner.ARBEIDSTAKER
        }
        const modus = getSkjemaModus(values, false);
        expect(modus).to.equal(modi.SEND)
    });


    it("Skal være BEKREFT dersom arbeidssituasjon === 'ARBEIDSTAKER' og valgtArbeidsgiver.orgnummer = '0'", () => {
        let values = {
            valgtArbeidssituasjon: arbeidssituasjoner.ARBEIDSTAKER,
            valgtArbeidsgiver: {
                orgnummer: '0'
            }
        }
        const modus = getSkjemaModus(values, false);
        expect(modus).to.equal(modi.BEKREFT)
    });

    it("Skal være BEKREFT dersom bruker har strengt fortrolig adresse", () => {
        let values = {
            valgtArbeidssituasjon: 'ARBEIDSTAKER'
        }
        const modus = getSkjemaModus(values, true);
        expect(modus).to.equal(modi.BEKREFT)
    });

});
