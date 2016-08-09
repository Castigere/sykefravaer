import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { getLedetekst, getHtmlLedetekst } from '../ledetekster';
import UnderUtviklingVarselContainer from '../containers/UnderUtviklingVarselContainer';
import LandingssideLenke from './LandingssideLenke';

export class GenerellInfo extends Component {
    componentDidMount() {
        window.setTimeout(() => {
            document.body.focus();
        }, 200);
    }

    render() {
        return (<article className="panel blokk side-innhold js-generell-informasjon">
            <h2 className="typo-undertittel">Sykmeldt &mdash; hva nå?</h2>
            <div dangerouslySetInnerHTML={getHtmlLedetekst('landingsside.generell.informasjon.tekst', this.props.ledetekster)} />
            <p>
                <a href={getLedetekst('landingsside.generell.informasjon.lenke1.url', this.props.ledetekster)}>
                    {getLedetekst('landingsside.generell.informasjon.lenke1.tittel', this.props.ledetekster)}
                </a>
            </p>
            <p>
                <Link to={getLedetekst('landingsside.generell.informasjon.lenke2.url', this.props.ledetekster)}>
                    {getLedetekst('landingsside.generell.informasjon.lenke2.tittel', this.props.ledetekster)}
                </Link>
            </p>
        </article>);
    }

}

GenerellInfo.propTypes = {
    ledetekster: PropTypes.object,
};

const Landingsside = ({ ledetekster = {}, skjulVarsel = false }) => {
    return (<div>
        <h1 className="side-header typo-sidetittel js-sidetittel">
            {getLedetekst('landingsside.sidetittel', ledetekster)}
        </h1>
        {
            (!skjulVarsel ? <UnderUtviklingVarselContainer ledetekster={ledetekster} /> : null)
        }
        <article className="panel js-intro-banner blokk side-innhold">
            <div className="landingsside-intro">
                <div className="landingsside-intro-bilde">
                    <img src="/sykefravaer/img/svg/illustrasjon-landingsside-2.svg"
                        alt="Samtale mellom deg, lege, arbeidsgiver og NAV" />
                </div>
                <div className="landingsside-intro-innhold">
                    <h2 className="typo-undertittel">{getLedetekst('landingsside.intro.tittel', ledetekster)}</h2>
                    <p>{getLedetekst('landingsside.intro.tekst', ledetekster)} </p>
                    <p className="ustilet">
                        <Link to="/sykefravaer/tidslinjen">{getLedetekst('landingsside.intro.lenketekst', ledetekster)}</Link>
                    </p>
                </div>
            </div>
        </article>
        <nav role="navigation">
            <LandingssideLenke to="/sykefravaer/sykmeldinger" ikonAlt="Lege">
                {getLedetekst('landingsside.tilsykmeldinger.lenketekst', ledetekster)}
            </LandingssideLenke>
        </nav>
        <GenerellInfo ledetekster={ledetekster} />
    </div>);
};

Landingsside.propTypes = {
    ledetekster: PropTypes.object.isRequired,
    skjulVarsel: PropTypes.bool.isRequired,
};

export default Landingsside;
