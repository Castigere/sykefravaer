import React from 'react';
import Oppsummering from '../../components/sykepengesoknad/Oppsummering/Oppsummering';
import GenerellSoknadContainer from './GenerellSoknadContainer';

const OppsummeringContainer = ({ params }) => {
    const brodsmuler = [{
        tittel: 'Ditt sykefravær',
        sti: '/',
        erKlikkbar: true,
    }, {
        tittel: 'Søknader om sykepenger',
        sti: '/soknader',
        erKlikkbar: true,
    }, {
        tittel: 'Søknad',
    }];
    return <GenerellSoknadContainer Component={Oppsummering} brodsmuler={brodsmuler} params={params} />;
};

export default OppsummeringContainer;
