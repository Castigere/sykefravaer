import React, { PropTypes } from 'react';
import { getLedetekst } from 'digisyfo-npm';
import Sidetopp from '../Sidetopp';
import SoknadTeasere from './SoknaderTeasere';
import { SENDT, TIL_SENDING, UTGAATT, NY, UTKAST_TIL_KORRIGERING, FREMTIDIG, AVBRUTT } from '../../enums/sykepengesoknadstatuser';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes';
import { sorterEtterPerioder, sorterEtterOpprettetDato } from '../../utils/sykepengesoknadUtils';
import FremtidigSoknadTeaser from './FremtidigSoknadTeaser';

const Soknader = ({ soknader = [] }) => {
    const nyeSoknader = [...soknader].filter((soknad) => {
        return soknad.status === NY || soknad.status === UTKAST_TIL_KORRIGERING;
    }).sort(sorterEtterOpprettetDato);
    const tidligereSoknader = [...soknader]
        .filter((soknad) => {
            return soknad.status === SENDT || soknad.status === TIL_SENDING || soknad.status === UTGAATT || soknad.status === AVBRUTT;
        })
        .sort(sorterEtterPerioder);
    const fremtidigeSoknader = [...soknader]
        .filter((soknad) => {
            return soknad.status === FREMTIDIG;
        })
        .sort(sorterEtterOpprettetDato);

    return (<div>
        <Sidetopp
            tittel={getLedetekst('soknader.sidetittel')}
        />
        <SoknadTeasere
            soknader={nyeSoknader}
            tittel={getLedetekst('soknader.venter-paa-behandling.tittel')}
            tomListeTekst={getLedetekst('soknader.venter-paa-behandling.ingen-soknader')}
            className="js-til-behandling"
            id="soknader-list-til-behandling"
        />
        {
            fremtidigeSoknader.length && <SoknadTeasere
                Child={FremtidigSoknadTeaser}
                soknader={fremtidigeSoknader}
                tittel={getLedetekst('soknader.planlagt.tittel')}
                className="js-planlagt"
                id="soknader-planlagt"
            />
        }
        {
            tidligereSoknader.length > 0 && (<SoknadTeasere
                soknader={tidligereSoknader}
                tittel={getLedetekst('soknader.sendt.tittel')}
                tomListeTekst={getLedetekst('soknader.sendt.ingen-soknader')}
                className="js-sendt"
                id="soknader-sendt"
            />)
        }
    </div>);
};

Soknader.propTypes = {
    soknader: PropTypes.arrayOf(sykepengesoknadPt),
};

export default Soknader;
