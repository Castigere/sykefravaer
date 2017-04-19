import React, { PropTypes } from 'react';
import StatusPanel from '../StatusPanel';
import ArbeidsgiversSykmelding from './ArbeidsgiversSykmelding';
import { getLedetekst, Utvidbar, DineSykmeldingOpplysninger } from 'digisyfo-npm';
import { ARBEIDSGIVER, INNSENDT_DATO, ORGNUMMER, STATUS } from '../../enums/nokkelopplysninger';
import Sidetopp from '../Sidetopp';

const DinSendteSykmelding = ({ dinSykmelding, ledetekster, arbeidsgiversSykmelding }) => {
    return (<div>
        <Sidetopp tittel={getLedetekst('din-sykmelding.tittel', ledetekster)} />
        <StatusPanel
            sykmelding={dinSykmelding}
            ledetekster={ledetekster}
            type="suksess"
            nokkelopplysninger={[
                [STATUS, INNSENDT_DATO],
                [ARBEIDSGIVER, ORGNUMMER],
            ]} />
        <Utvidbar tittel={getLedetekst('din-sykmelding.dine-opplysninger.tittel', ledetekster)}
            ikon="svg/person.svg" ikonHover="svg/person_hover.svg" ikonAltTekst="Du" className="blokk" variant="lysebla" Overskrift="H2">
            <DineSykmeldingOpplysninger sykmelding={dinSykmelding} ledetekster={ledetekster} />
        </Utvidbar>
        <div className="blokk--l">
            <ArbeidsgiversSykmelding sykmelding={arbeidsgiversSykmelding} ledetekster={ledetekster} />
        </div>
    </div>);
};

DinSendteSykmelding.propTypes = {
    ledetekster: PropTypes.object,
    dinSykmelding: PropTypes.object,
    arbeidsgiversSykmelding: PropTypes.object,
};

export default DinSendteSykmelding;
