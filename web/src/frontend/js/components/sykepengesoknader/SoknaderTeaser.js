import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { getLedetekst, toDatePrettyPrint } from 'digisyfo-npm';
import { getContextRoot } from '../../routers/paths';
import { tidligsteFom, senesteTom } from '../../utils/periodeUtils';

class SoknadTeaser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ikon: 'soknader.svg',
        };
    }

    onMouseEnter() {
        this.setState({
            ikon: 'soknader_hover-blue.svg',
        });
    }

    onMouseLeave() {
        this.setState({
            ikon: 'soknader.svg',
        });
    }

    render() {
        const { soknad, ledetekster } = this.props;

        const perioder = soknad.aktiviteter.map(a => { return a.periode; });
        const visStatus = soknad.status !== 'NY';

        return (<article aria-labelledby={`soknader-header-${soknad.id}`}>
            <Link className="inngangspanel js-panel" to={`${getContextRoot()}/soknader/${soknad.id}`}
                onMouseEnter={() => {this.onMouseEnter();}}
                onMouseLeave={() => {this.onMouseLeave();}}
            >
            <span className="inngangspanel__ikon">
                <img className="js-ikon" src={`/sykefravaer/img/svg/${this.state.ikon}`} />
            </span>
            <div className="inngangspanel__innhold">
                <header className="inngangspanel__header">
                    <h3 className="js-title" id={`soknad-header-${soknad.id}`}>
                        <small className="inngangspanel__meta js-meta">
                            {getLedetekst('soknad.teaser.dato', ledetekster, { '%DATO%': toDatePrettyPrint(soknad.opprettetDato) }) }
                        </small>
                        <span className="inngangspanel__tittel">
                            {getLedetekst('soknad.teaser.tittel', ledetekster)}
                        </span>
                    </h3>
                    {
                        visStatus &&
                            <p className="inngangspanel__status js-status">
                            { getLedetekst(`soknad.teaser.status.${soknad.status}`, ledetekster, { '%DATO%': toDatePrettyPrint(soknad.innsendtDato) }) }
                            </p>
                    }
                </header>
                <p className="inngangspanel__tekst js-tekst">{getLedetekst('soknad.teaser.tekst', ledetekster,
                    {
                        '%FRA%': toDatePrettyPrint(tidligsteFom(perioder)),
                        '%TIL%': toDatePrettyPrint(senesteTom(perioder)) }
                    )
                }</p>
                <p className="inngangspanel__undertekst js-undertekst mute">
                    {getLedetekst('soknad.teaser.undertekst', ledetekster, { '%ARBEIDSGIVER%': soknad.arbeidsgiver.navn }) }
                </p>
            </div>
        </Link></article>);
    }
}

SoknadTeaser.propTypes = {
    soknad: PropTypes.shape({
        opprettetDato: PropTypes.instanceOf(Date),
        aktiviteter: PropTypes.arrayOf(PropTypes.shape({
            avvik: PropTypes.object,
            grad: PropTypes.number,
            periode: PropTypes.shape({
                fom: PropTypes.instanceOf(Date).isRequired,
                tom: PropTypes.instanceOf(Date).isRequired,
            }),
        })),
        arbeidsgiver: PropTypes.shape({
            navn: PropTypes.string.isRequired,
        }),
        innsendtDato: PropTypes.instanceOf(Date),
    }).isRequired,
    ledetekster: PropTypes.object,
};

export default SoknadTeaser;