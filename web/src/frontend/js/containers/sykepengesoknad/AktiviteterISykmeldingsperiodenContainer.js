import React, { PropTypes } from 'react';
import AktiviteterISykmeldingsperioden from '../../components/sykepengesoknad/AktiviteterISykmeldingsperioden/AktiviteterISykmeldingsperioden';
import GenerellSoknadContainer from './GenerellSoknadContainer';
import StartIgjen from '../../components/sykepengesoknad/StartIgjen';
import Kvittering from '../../components/sykepengesoknad/Kvittering';
import { SENDT, TIL_SENDING } from '../../enums/sykepengesoknadstatuser';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes';

export const Controller = (props) => {
    if (props.korrigerendeSoknad) {
        return <AktiviteterISykmeldingsperioden {...props} />;
    }
    if (props.sykepengesoknad.status === SENDT || props.sykepengesoknad.status === TIL_SENDING) {
        return <Kvittering sykepengesoknad={props.sykepengesoknad} />;
    }
    if (props.skjemasoknad) {
        return <AktiviteterISykmeldingsperioden {...props} />;
    }
    return <StartIgjen sykepengesoknad={props.sykepengesoknad} />;
};

Controller.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
    skjemasoknad: PropTypes.object,
};

const AktiviteterISykmeldingsperiodenContainer = ({ params }) => {
    const brodsmuler = [{
        tittel: 'Ditt sykefravær',
        sti: '/',
        erKlikkbar: true,
    }, {
        tittel: 'Søknader om sykepenger',
        sti: '/soknader/',
        erKlikkbar: true,
    }, {
        tittel: 'Søknad',
    }];
    return <GenerellSoknadContainer Component={Controller} brodsmuler={brodsmuler} params={params} />;
};

AktiviteterISykmeldingsperiodenContainer.propTypes = {
    params: PropTypes.shape({
        sykepengesoknadId: PropTypes.string,
    }),
};

export default AktiviteterISykmeldingsperiodenContainer;
