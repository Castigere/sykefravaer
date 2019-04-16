import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { sykmelding as sykmeldingPt, SykmeldingUtdrag, scrollTo } from '@navikt/digisyfo-npm';
import { UTKAST_TIL_KORRIGERING } from '../../enums/soknadstatuser';
import { settErOppdelt } from '../../utils/settErOppdelt';
import KorrigerVarsel from '../../../components/soknad-felles/KorrigerVarsel';
import TidligSoknad from '../../../components/soknad-felles/TidligSoknad';
import { soknadPt } from '../../prop-types/soknadProptype';
import StegindikatorEttSporsmalPerSide from './StegindikatorEttSporsmalPerSide';
import { LenkeTilSoknader } from '../../felleskomponenter/LenkeTilSoknader';

class Soknadskjema extends Component {
    componentDidMount() {
        if (this.props.scroll) {
            scrollTo(this.stegindikator, 0);
        }
    }

    render() {
        const { children, sidenummer = null, tittel, soknad, sykmelding, intro = null } = this.props;
        const { _erOppdelt } = settErOppdelt(soknad, sykmelding);
        const forrigeUrl = `/sykefravaer/soknader/${soknad.id}/${(sidenummer - 1)}`;

        return (<div>
            {
                sidenummer > 1 && (<div
                    ref={(stegindikator) => {
                        this.stegindikator = stegindikator;
                    }}>
                    <StegindikatorEttSporsmalPerSide soknad={soknad} sidenummer={sidenummer} />
                </div>)
            }
            {
                sidenummer > 1 && (<p>
                    <Link to={forrigeUrl} className="tilbakelenke">
                        Tilbake
                    </Link>
                </p>)
            }
            {soknad.status === UTKAST_TIL_KORRIGERING && <KorrigerVarsel />}
            <TidligSoknad soknad={soknad} />
            {intro}
            {sykmelding
            && <SykmeldingUtdrag
                rootUrl="/sykefravaer"
                sykmelding={sykmelding}
                erApen={sidenummer === 1}
                sykepengesoknad={{ _erOppdelt }} />}
            {tittel && <h2 className="soknad__stegtittel">{tittel}</h2>}
            {children}
        </div>);
    }
}

Soknadskjema.propTypes = {
    children: PropTypes.node,
    tittel: PropTypes.string,
    soknad: soknadPt,
    sykmelding: sykmeldingPt,
    intro: PropTypes.node,
    sidenummer: PropTypes.number,
    scroll: PropTypes.bool,
};

Soknadskjema.defaultProps = {
    scroll: true,
};

export default Soknadskjema;
