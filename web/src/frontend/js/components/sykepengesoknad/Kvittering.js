import React, { Component } from 'react';
import { getLedetekst, getHtmlLedetekst, scrollTo, erSynligIViewport } from 'digisyfo-npm';
import Sidetopp from '../Sidetopp';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes';
import { getSendtTilSuffix } from '../../utils/sykepengesoknadUtils';

class Kvittering extends Component {
    componentDidMount() {
        const el = this.kvittering;
        if (!erSynligIViewport(el)) {
            scrollTo(el, 200);
        }
    }

    render() {
        const { sykepengesoknad } = this.props;
        return (<div ref={(c) => {
            this.kvittering = c;
        }}>
            <Sidetopp tittel="Kvittering" />
            <div className="panel js-kvittering">
                <div className="hode hode--suksess">
                    <h2 className="hode__tittel">{getLedetekst(`sykepengesoknad.kvittering${getSendtTilSuffix(sykepengesoknad)}.tittel`)}</h2>
                    <div dangerouslySetInnerHTML={getHtmlLedetekst(`sykepengesoknad.kvittering${getSendtTilSuffix(sykepengesoknad)}.tekst`, {
                        '%ARBEIDSGIVER%': sykepengesoknad.arbeidsgiver ? sykepengesoknad.arbeidsgiver.navn : '',
                    })} />
                </div>
            </div>
            <article className="panel typo-infotekst ikke-print js-tilbakemelding">
                <h2 className="typo-undertittel">Hjelp oss å bli bedre</h2>
                <p className="typo-infotekst sist">Dette er en tjeneste som fortsatt er under utvikling. Gi oss tilbakemelding slik at vi kan bli bedre!</p>
                <div className="knapperad">
                    <a target="_blank" rel="noopener noreferrer" href="https://www.survey-xact.no/LinkCollector?key=Z6ML2MRQC5CJ" className="rammeknapp rammeknapp--mini">Gi tilbakemelding</a>
                </div>
            </article>
        </div>);
    }
}

Kvittering.propTypes = {
    sykepengesoknad: sykepengesoknadPt.isRequired,
};

export default Kvittering;
