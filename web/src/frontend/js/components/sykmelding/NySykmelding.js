import React, { Component } from 'react';
import { Bjorn, getLedetekst, DineSykmeldingOpplysninger, scrollTo } from 'digisyfo-npm';
import Alertstripe from 'nav-frontend-alertstriper';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import getContextRoot from '../../utils/getContextRoot';
import DinSykmeldingSkjemaContainer from '../../containers/sykmelding/DinSykmeldingSkjemaContainer';
import Sidetopp from '../Sidetopp';
import { sykmelding as sykmeldingPt } from '../../propTypes';
import { getSykmeldtFornavn } from '../../utils/sykmeldingUtils';
import { Vis } from '../../utils';

class NySykmelding extends Component {
    render() {
        const { sykmelding, visEldreSykmeldingVarsel, eldsteSykmeldingId } = this.props;
        return (<div>
            <Sidetopp tittel={getLedetekst('din-sykmelding.tittel')} />
            <Vis
                hvis={visEldreSykmeldingVarsel}
                render={() => {
                    return (<Alertstripe type="info" className="blokk">
                        <p className="sist">
                            <span>{getLedetekst('starte-sykmelding.eldre-sykmeldinger.tekst')} </span>
                            <Link className="lenke" to={`/sykefravaer/sykmeldinger/${eldsteSykmeldingId}`}>{getLedetekst('starte-sykmelding.eldre-sykmeldinger.lenke')}</Link>
                        </p>
                    </Alertstripe>);
                }} />
            <Bjorn
                className="blokk"
                hvit
                stor
                rootUrl={getContextRoot()}>
                <div>
                    <p>
                        {
                            getLedetekst('din-sykmelding.introtekst.bjorn', {
                                '%NAVN%': getSykmeldtFornavn(sykmelding),
                            })
                        }
                    </p>
                    <p className="introtekst__knapperad">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                scrollTo(this.skjema);
                                this.skjema.focus();
                            }}
                            className="knapp knapp--mini">Gå til utfylling</button>
                    </p>
                </div>
            </Bjorn>
            <header className="panelHeader panelHeader--lysebla">
                <img className="panelHeader__ikon" src="/sykefravaer/img/svg/person.svg" alt="Du" />
                <h2 className="panelHeader__tittel">{sykmelding.pasient.fornavn} {sykmelding.pasient.mellomnavn} {sykmelding.pasient.etternavn}</h2>
            </header>
            <div className="panel blokk">
                <DineSykmeldingOpplysninger sykmelding={sykmelding} />
            </div>
            <div
                ref={(c) => {
                    this.skjema = c;
                }}
                tabIndex="-1"
                className="sykmeldingskjemaRef">
                <DinSykmeldingSkjemaContainer sykmeldingId={sykmelding.id} />
            </div>
        </div>);
    }
}

NySykmelding.propTypes = {
    sykmelding: sykmeldingPt,
    visEldreSykmeldingVarsel: PropTypes.bool,
    eldsteSykmeldingId: PropTypes.string,
};

export default NySykmelding;