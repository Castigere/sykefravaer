import React, { PropTypes } from 'react';
import { getLedetekst } from '../ledetekster';
import VelgArbeidsgiverContainer from '../containers/VelgArbeidsgiverContainer.js';
import ArbeidsgiversSykmelding from './ArbeidsgiversSykmelding.js';

const SendTilArbeidsgiver = ({ sykmelding, ledetekster, sendSykmeldingTilArbeidsgiver }) => {

    return (<form className="panel" onSubmit={(e) => {sendSykmeldingTilArbeidsgiver(e, sykmelding)}}>
        <h1 className="typo-innholdstittel tittel-dekorert blokk-l">{getLedetekst('send-til-arbeidsgiver.hovedtittel', ledetekster)}</h1>
        <VelgArbeidsgiverContainer sykmelding={sykmelding} />
        <ArbeidsgiversSykmelding sykmelding={sykmelding} ledetekster={ledetekster} />
        <p>{getLedetekst('send-til-arbeidsgiver.infotekst', ledetekster)}</p>
        <div className="knapperad">
            <input type="submit" className="knapp knapp-hoved"/>
        </div>
    </form>);
};

SendTilArbeidsgiver.propTypes = {
    sykmelding: PropTypes.object,
    ledetekster: PropTypes.object,
};

export default SendTilArbeidsgiver;
