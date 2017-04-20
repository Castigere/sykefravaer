import React, { PropTypes } from 'react';
import { getLedetekst } from 'digisyfo-npm';
import Checkbox from '../skjema/Checkbox';
import Feilomrade from '../skjema/Feilomrade';
import JaEllerNei from '../../components/sykepengesoknad/JaEllerNei';
import { FieldArray, Field } from 'redux-form';
import SporsmalMedTillegg from '../skjema/SporsmalMedTillegg';
import feilaktigeOpplysningerFields, { PERIODE, SYKMELDINGSGRAD, ARBEIDSGIVER, DIAGNOSE, ANDRE } from '../../enums/feilaktigeOpplysninger';

const Tilleggsinfo = ({ children }) => {
    return (<div className="ekstrasporsmal ekstrasporsmal--sist">{children}</div>);
};

Tilleggsinfo.propTypes = {
    children: PropTypes.object,
};

export const DuTrengerNySykmelding = () => {
    return (<Tilleggsinfo>
        <div className="hode hode--advarsel">
            <h5 className="hode__tittel">
                {getLedetekst('starte-sykmelding.feilaktige-opplysninger.ny-sykmelding.tittel')}
            </h5>
            <p>
                {getLedetekst('starte-sykmelding.feilaktige-opplysninger.ny-sykmelding.tekst')}
            </p>
        </div>
    </Tilleggsinfo>);
};

export const DuKanBrukeSykmeldingenDinArbeidsgiver = () => {
    return (<Tilleggsinfo>
        <div className="hode hode--informasjon">
            <h5 className="hode__tittel">
                {getLedetekst('starte-sykmelding.feilaktige-opplysninger.du-kan-bruke-sykmelding.arbeidsgiver.tittel')}
            </h5>
            <p>
                {getLedetekst('starte-sykmelding.feilaktige-opplysninger.du-kan-bruke-sykmelding.arbeidsgiver.tekst')}
            </p>
        </div>
    </Tilleggsinfo>);
};

export const DuKanBrukeSykmeldingenDinDiagnoseAndre = () => {
    return (<Tilleggsinfo>
        <div className="hode hode--informasjon">
            <h5 className="hode__tittel">
                {getLedetekst('starte-sykmelding.feilaktige-opplysninger.du-kan-bruke-sykmelding.andre.tittel')}
            </h5>
            <p>
                {getLedetekst('starte-sykmelding.feilaktige-opplysninger.du-kan-bruke-sykmelding.andre.tekst')}
            </p>
        </div>
    </Tilleggsinfo>);
};

const getAvkryssedeOpplysninger = (feilaktigeOpplysninger) => {
    return feilaktigeOpplysninger.filter((o) => {
        return o.avkrysset;
    }).map((o) => {
        return o.opplysning;
    });
};

export const SykmeldingFeilaktigeOpplysningerInfo = ({ feilaktigeOpplysninger = [] }) => {
    const opplysninger = getAvkryssedeOpplysninger(feilaktigeOpplysninger);
    if (opplysninger.indexOf(PERIODE) > -1 || opplysninger.indexOf(SYKMELDINGSGRAD) > -1) {
        return <DuTrengerNySykmelding />;
    }
    if (opplysninger.indexOf(ARBEIDSGIVER) > -1) {
        return <DuKanBrukeSykmeldingenDinArbeidsgiver />;
    }
    if (opplysninger.indexOf(DIAGNOSE) > -1 || opplysninger.indexOf(ANDRE) > -1) {
        return <DuKanBrukeSykmeldingenDinDiagnoseAndre />;
    }
    return null;
};

SykmeldingFeilaktigeOpplysningerInfo.propTypes = {
    feilaktigeOpplysninger: PropTypes.array,
};

export const HvilkeOpplysninger = ({ fields, meta }) => {
    const labels = {};
    labels[PERIODE] = getLedetekst('sykmelding.bekreft-opplysninger.hvilke-opplysninger.periode');
    labels[SYKMELDINGSGRAD] = getLedetekst('sykmelding.bekreft-opplysninger.hvilke-opplysninger.sykmeldingsgrad');
    labels[ARBEIDSGIVER] = getLedetekst('sykmelding.bekreft-opplysninger.hvilke-opplysninger.arbeidsgiver');
    labels[DIAGNOSE] = getLedetekst('sykmelding.bekreft-opplysninger.hvilke-opplysninger.diagnose');
    labels[ANDRE] = getLedetekst('sykmelding.bekreft-opplysninger.hvilke-opplysninger.andre');

    return (<Feilomrade {...meta}>
        <h4 className="skjema__sporsmal">Hvilke opplysninger er ikke riktige?</h4>
        {
            fields.map((field, index) => {
                const opplysning = field.opplysning;
                return (<Field
                    key={index}
                    component={Checkbox}
                    name={`feilaktigeOpplysninger[${index}].avkrysset`}
                    label={labels[opplysning]}
                    id={`checkbox-${opplysning}`} />);
            })
        }
    </Feilomrade>);
};

HvilkeOpplysninger.propTypes = {
    fields: PropTypes.array,
    meta: PropTypes.object,
};

export const RenderFeilaktigeOpplysninger = (props) => {
    const { skjemaData } = props;
    const Sporsmal = <HvilkeOpplysninger {...props} />;

    return (<SporsmalMedTillegg {...props} Sporsmal={Sporsmal} visTillegg={(_props) => {
        try {
            const feilaktigeOpplysninger = _props.skjemaData.values.feilaktigeOpplysninger;
            return feilaktigeOpplysninger.filter((o) => {
                return o.avkrysset;
            }).length > 0;
        } catch (e) {
            return false;
        }
    }}>
        <SykmeldingFeilaktigeOpplysningerInfo feilaktigeOpplysninger={skjemaData.values.feilaktigeOpplysninger} />
    </SporsmalMedTillegg>);
};

RenderFeilaktigeOpplysninger.propTypes = {
    fields: PropTypes.array,
    meta: PropTypes.object,
    skjemaData: PropTypes.object,
};

export const ErOpplysningeneRiktige = (props) => {
    return (<JaEllerNei
        verdiMedTilleggssporsmal={false}
        spoersmal="Er opplysningene i sykmeldingen riktige?"
        name="opplysningeneErRiktige">
        <FieldArray
            {...props}
            component={RenderFeilaktigeOpplysninger}
            name="feilaktigeOpplysninger"
            fields={feilaktigeOpplysningerFields} />
    </JaEllerNei>);
};

ErOpplysningeneRiktige.propTypes = {
    skjemaData: PropTypes.object,
};

export default ErOpplysningeneRiktige;
