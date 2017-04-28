import React, { PropTypes } from 'react';
import { ARBEIDSGIVER, INNSENDT_DATO, ORGNUMMER, STATUS } from '../enums/nokkelopplysninger';
import { Hjelpetekst, SykmeldingNokkelOpplysning, toDatePrettyPrint, getLedetekst } from 'digisyfo-npm';
import { BEKREFTET, AVBRUTT, TIL_SENDING } from '../enums/sykmeldingstatuser';
import { sykmelding as sykmeldingPt } from '../propTypes';

const tilSendingHjelpetekst = () => {
    return (<Hjelpetekst
        tittel={getLedetekst('sykepengesoknad.til-sending.hjelpetekst.tittel')}
        tekst={getLedetekst('sykepengesoknad.til-sending.hjelpetekst.tekst')} />);
};

const Status = ({ status }) => {
    return (<SykmeldingNokkelOpplysning className="nokkelopplysning--statusopplysning" Overskrift="H2" tittel={getLedetekst('statuspanel.status')}>
        {status === TIL_SENDING ?
            <div className="medHjelpetekst">
                <span>{getLedetekst(`statuspanel.status.${status}`)}</span>
                {tilSendingHjelpetekst()}
            </div>
            :
            <p className="js-status">{getLedetekst(`statuspanel.status.${status}`)}</p>
        }
    </SykmeldingNokkelOpplysning>);
};

Status.propTypes = {
    status: PropTypes.string,
};

const InnsendtDato = ({ sendtdato, status }) => {
    let nokkel = 'statuspanel.dato.innsendt';
    if (status === BEKREFTET) {
        nokkel = 'statuspanel.dato.bekreftet';
    } else if (status === AVBRUTT) {
        nokkel = 'statuspanel.dato.avbrutt';
    }
    return (<SykmeldingNokkelOpplysning className="nokkelopplysning--statusopplysning" Overskrift="H2" tittel={getLedetekst(nokkel)}>
        <p className="js-dato">{toDatePrettyPrint(sendtdato)}</p>
    </SykmeldingNokkelOpplysning>);
};

InnsendtDato.propTypes = {
    sendtdato: PropTypes.string,
    status: PropTypes.string,
};

const Arbeidsgiver = ({ arbeidsgiver }) => {
    return (<SykmeldingNokkelOpplysning className="nokkelopplysning--statusopplysning" Overskrift="H2" tittel={getLedetekst('statuspanel.arbeidsgiver')}>
        <p className="js-arbeidsgiver">{arbeidsgiver}</p>
    </SykmeldingNokkelOpplysning>);
};

Arbeidsgiver.propTypes = {
    arbeidsgiver: PropTypes.string,
};

const Orgnummer = ({ orgnummer }) => {
    let _orgnummer = orgnummer;
    if (_orgnummer) {
        _orgnummer = _orgnummer.replace(/(...)(...)(...)/g, '$1 $2 $3');
    }
    return (<SykmeldingNokkelOpplysning className="nokkelopplysning--statusopplysning" Overskrift="H2" tittel={getLedetekst('statuspanel.organisasjonsnummer')}>
        <p className="js-organisasjonsnummer">{_orgnummer}</p>
    </SykmeldingNokkelOpplysning>);
};

Orgnummer.propTypes = {
    orgnummer: PropTypes.string,
};

const StatusOpplysning = ({ sykmelding, nokkelopplysning }) => {
    switch (nokkelopplysning) {
        case STATUS: {
            return <Status status={sykmelding.status} />;
        }
        case INNSENDT_DATO: {
            return <InnsendtDato sendtdato={sykmelding.sendtdato} status={sykmelding.status} />;
        }
        case ARBEIDSGIVER: {
            return <Arbeidsgiver arbeidsgiver={sykmelding.innsendtArbeidsgivernavn} />;
        }
        case ORGNUMMER: {
            return <Orgnummer orgnummer={sykmelding.orgnummer} />;
        }
        default: {
            return null;
        }
    }
};

StatusOpplysning.propTypes = {
    sykmelding: sykmeldingPt,
    nokkelopplysning: PropTypes.string,
};

export default StatusOpplysning;