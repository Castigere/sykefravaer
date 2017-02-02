import React, { PropTypes } from 'react';
import setup from '../setup';
import FravaerOgFriskmelding from './FravaerOgFriskmelding';
import AktiviteterISykmeldingsperioden from './AktiviteterISykmeldingsperioden';
import { Utvidbar } from 'digisyfo-npm';
import CheckboxSelvstendig from '../../skjema/CheckboxSelvstendig';
import { Field } from 'redux-form';
import { Avkrysset } from './opplysninger';
import SykepengerSkjema from '../SykepengerSkjema';
import { Link } from 'react-router';
import Knapperad from '../../skjema/Knapperad';
import mapSkjemasoknadToBackendsoknad from '../mapSkjemasoknadToBackendsoknad';
import { Varselstripe } from 'digisyfo-npm';
import * as foerDuBegynner from '../FoerDuBegynner/FoerDuBegynner';
import * as aktiviteterISykmeldingsperioden from '../AktiviteterISykmeldingsperioden/AktiviteterISykmeldingsperioden';
import * as fravaerOgFriskmelding from '../FravaerOgFriskmelding/FravaerOgFriskmelding';

export const Oppsummering = ({ sykepengesoknad }) => {
    return (<div>
        <div className="oppsummering__bolk">
            <Avkrysset tekst="Jeg er klar over at dersom jeg gir uriktige opplysninger eller holder tilbake opplysninger som har betydning for min rett til sykepenger, kan pengene holdes tilbake eller kreves tilbake, og/eller det kan medføre straffeansvar." />
        </div>
        <FravaerOgFriskmelding sykepengesoknad={sykepengesoknad} />
        <AktiviteterISykmeldingsperioden sykepengesoknad={sykepengesoknad} />
    </div>);
};

Oppsummering.propTypes = {
    sykepengesoknad: PropTypes.object,
};

export const OppsummeringWrap = (props) => {
    const { skjemasoknad, sykepengesoknad, handleSubmit, ledetekster, actions, sender, sendingFeilet } = props;
    const label = 'Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte';
    const onSubmit = (values) => {
        const soknad = mapSkjemasoknadToBackendsoknad(values);
        const soknadObjekt = JSON.parse(JSON.stringify(soknad)); // Hack for å sikre riktig datoformat
        actions.sendSykepengesoknad(soknadObjekt);
    };
    const backendSoknad = mapSkjemasoknadToBackendsoknad(skjemasoknad);

    return (<SykepengerSkjema aktivtSteg="3" sykepengesoknad={sykepengesoknad} ledetekster={ledetekster}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="blokk">
                <Utvidbar tittel="Oppsummering" Overskrift="h2">
                    <Oppsummering sykepengesoknad={backendSoknad} />
                </Utvidbar>
            </div>
            <div className="panel blokk">
                <p>Vær klar over at</p>
                <ul>
                    <li>rett til sykepenger forutsetter at du har inntektstap på grunn av egen sykdom. Sosiale eller økonomiske problemer gir ikke rett til sykepenger</li>
                    <li>sykepenger utbetales i maksimum 52 uker, også for gradert (delvis) sykmelding</li>
                    <li>du kan miste retten til sykepenger hvis du uten rimelig grunn nekter å opplyse om egen funksjonsevne eller nekter å ta imot tilbud om behandling og/eller tilrettelegging</li>
                </ul>
            </div>
            <Field component={CheckboxSelvstendig} name="bekreftetKorrektInformasjon" id="bekreftetKorrektInformasjon" label={label} />
            {
                sendingFeilet && <Varselstripe type="feil">
                    <p>Beklager, det oppstod en feil! Prøv igjen litt senere.</p>
                </Varselstripe>
            }
            <Knapperad variant="knapperad--forrigeNeste">
                <Link to={`/sykefravaer/soknader/${sykepengesoknad.id}/aktiviteter-i-sykmeldingsperioden`} className="rammeknapp rammeknapp--forrige">Tilbake</Link>
                <button className="knapp">Send søknad{sender ? ' ' : null}{ sender ? <span className="knapp__spinner" /> : null}</button>
            </Knapperad>
        </form>
    </SykepengerSkjema>);
};

OppsummeringWrap.propTypes = {
    sykepengesoknad: PropTypes.object,
    handleSubmit: PropTypes.func,
    skjemasoknad: PropTypes.object,
    ledetekster: PropTypes.object,
    actions: PropTypes.object,
    sender: PropTypes.bool,
    sendingFeilet: PropTypes.bool,
};

export const validate = (values, props) => {
    foerDuBegynner.validate(values, props);
    fravaerOgFriskmelding.validate(values, props);
    if (Object.keys(aktiviteterISykmeldingsperioden.validate(values, props)).length > 0) {
        props.sendTilFoerDuBegynner(props.sykepengesoknad);
    }

    if (!values.bekreftetKorrektInformasjon) {
        return {
            bekreftetKorrektInformasjon: 'Du må bekrefte at du har lest informasjonen og bekreftet at opplysningene du har gitt er korrekte',
        };
    }
    return {};
};

const OppsummeringSkjema = setup(validate, OppsummeringWrap);

export default OppsummeringSkjema;