import React from 'react';
import {
    getLedetekst,
} from '@navikt/digisyfo-npm';
import { soknad as soknadPt } from '../../propTypes';
import Statuspanel, { StatusNokkelopplysning, Statusopplysninger } from '../Statuspanel';
import hentStatustekst from '../../utils/soknad-felles/hentSoknadStatustekst';

const StatuspanelUtland = ({ soknad }) => {
    return (<Statuspanel>
        <Statusopplysninger>
            <StatusNokkelopplysning tittel={getLedetekst('statuspanel.status')}>
                <p>{hentStatustekst(soknad)}</p>
            </StatusNokkelopplysning>
        </Statusopplysninger>
    </Statuspanel>);
};

StatuspanelUtland.propTypes = {
    soknad: soknadPt,
};

export default StatuspanelUtland;