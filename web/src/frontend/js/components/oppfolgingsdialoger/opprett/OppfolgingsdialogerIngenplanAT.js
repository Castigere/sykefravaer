import React from 'react';
import PropTypes from 'prop-types';
import { getLedetekst, keyValue } from 'digisyfo-npm';
import {
    proptypes as oppfolgingProptypes,
    OppfolgingsdialogerIngenplan,
} from 'oppfolgingsdialog-npm';
import { opprettOppfolgingArbeidsgiverPt } from '../../../propTypes';
import { erOppfolgingsdialogOpprettbarDirekte } from '../../../utils/oppfolgingsdialogUtils';

export const OppfolgingsdialogerIngenplanKnapper = (
    {
        arbeidsgivere,
        oppfolgingsdialoger,
        opprett,
        visOppfolgingsdialogOpprett,
    }) => {
    return (
        <div className="knapperad knapperad--justervenstre">
            { erOppfolgingsdialogOpprettbarDirekte(arbeidsgivere, oppfolgingsdialoger) ?
                <button
                    className="knapp knapperad__element"
                    onClick={() => {
                        opprett(arbeidsgivere[0].virksomhetsnummer);
                    }}>
                    {getLedetekst('oppfolgingsdialog.knapp.ny-oppfolgingsdialog')}
                </button>
                :
                <button
                    className="knapp knapperad__element"
                    onClick={() => {
                        visOppfolgingsdialogOpprett(true);
                    }}>
                    {getLedetekst('oppfolgingsdialog.knapp.ny-oppfolgingsdialog')}
                </button>
            }
        </div>
    );
};
OppfolgingsdialogerIngenplanKnapper.propTypes = {
    arbeidsgivere: PropTypes.arrayOf(opprettOppfolgingArbeidsgiverPt),
    oppfolgingsdialoger: PropTypes.arrayOf(oppfolgingProptypes.oppfolgingsdialogPt),
    opprett: PropTypes.func,
    visOppfolgingsdialogOpprett: PropTypes.func,
};

const OppfolgingsdialogerIngenplanAT = (
    {
        ledetekster,
        arbeidsgivere,
        oppfolgingsdialoger,
        opprett,
        visOppfolgingsdialogOpprett,
        rootUrl,
    }) => {
    return (<OppfolgingsdialogerIngenplan
        ledetekster={ledetekster}
        rootUrl={rootUrl}
    >
        <OppfolgingsdialogerIngenplanKnapper
            arbeidsgivere={arbeidsgivere}
            oppfolgingsdialoger={oppfolgingsdialoger}
            opprett={opprett}
            visOppfolgingsdialogOpprett={visOppfolgingsdialogOpprett}
        />
    </OppfolgingsdialogerIngenplan>);
};

OppfolgingsdialogerIngenplanAT.propTypes = {
    ledetekster: keyValue,
    arbeidsgivere: PropTypes.arrayOf(opprettOppfolgingArbeidsgiverPt),
    oppfolgingsdialoger: PropTypes.arrayOf(oppfolgingProptypes.oppfolgingsdialogPt),
    opprett: PropTypes.func,
    visOppfolgingsdialogOpprett: PropTypes.func,
    rootUrl: PropTypes.string,
};

export default OppfolgingsdialogerIngenplanAT;