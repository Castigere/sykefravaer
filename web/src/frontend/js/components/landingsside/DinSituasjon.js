import React from 'react';
import NaermesteLedereContainer from '../../containers/NaermesteLedereContainer';
import { getLedetekst } from 'digisyfo-npm';
import Landingspanel from './Landingspanel';

const DinSituasjon = () => {
    return (<Landingspanel
        tittel={getLedetekst('din-situasjon.tittel')}
        className="landingspanel--dinSituasjon"
        ikon="/sykefravaer/img/svg/landingsside/hjerte.svg" ikonAlt="Hjerte">
        <NaermesteLedereContainer />
    </Landingspanel>);
};

export default DinSituasjon;
