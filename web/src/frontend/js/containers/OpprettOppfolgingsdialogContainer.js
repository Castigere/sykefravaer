import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { getLedetekst } from 'digisyfo-npm';
import Side from '../sider/Side';
import Feilmelding from '../components/Feilmelding';
import AppSpinner from '../components/AppSpinner';
import { brodsmule as brodsmulePt } from '../propTypes';
import OpprettOppfolgingsdialog from '../components/oppfolgingsdialoger/OpprettOppfolgingsdialog';
import { hentAlleArbeidsgivere } from '../actions/alleArbeidsgivere_actions';
import { OppfolgingsdialogSamtykke } from 'oppfolgingsdialog-npm';

export class OpprettOppfolgingsdialogSide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arbeidsgiverValgt: '',
            samtykket: false,
        };
        this.velgArbeidsgiver = this.velgArbeidsgiver.bind(this);
        this.samtykk = this.samtykk.bind(this);
    }

    componentWillMount() {
        this.props.hentAlleArbeidsgivere();
    }

    velgArbeidsgiver(value) {
        this.setState({
            arbeidsgiverValgt: value.arbeidsgiver,
        });
    }

    samtykk(value) {
        if (value.samtykkeInput) {
            this.setState({
                samtykket: true,
            });
        }
    }

    render() {
        const { brodsmuler, ledetekster, henter, hentingFeilet, arbeidsgivere } = this.props;

        return (<Side tittel={getLedetekst('oppfolgingsdialoger.opprett.tittel')} brodsmuler={brodsmuler}>
            {
                (() => {
                    if (henter) {
                        return <AppSpinner />;
                    } else if (hentingFeilet) {
                        return (<Feilmelding />);
                    } else if (this.state.arbeidsgiverValgt !== '') {
                        return (
                            <OppfolgingsdialogSamtykke
                                ledetekster={ledetekster}
                                avbrytHref={"/sykefravaer/oppfolgingsdialoger"}
                                svgUrl="/sykefravaer/img/svg/samtykke.svg"
                                svgAlt="samtykkeIllustrasjon"
                                samtykk={this.samtykk}
                            />);
                    }
                    return (
                        <OpprettOppfolgingsdialog
                            arbeidsgivere={arbeidsgivere}
                            ledetekster={ledetekster}
                            avbrytHref={"/sykefravaer/oppfolgingsdialoger"}
                            velgArbeidsgiver={this.velgArbeidsgiver}
                        />);
                })()
            }
        </Side>);
    }
}

OpprettOppfolgingsdialogSide.propTypes = {
    brodsmuler: PropTypes.arrayOf(brodsmulePt),
    arbeidsgivere: PropTypes.array,
    ledetekster: PropTypes.object,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    sykmeldingId: PropTypes.string,
    hentAlleArbeidsgivere: PropTypes.func,
};

export const mapStateToProps = (state) => {
    return {
        ledetekster: state.ledetekster.data,
        arbeidsgivere: state.allearbeidsgivere.data,
        henter: state.ledetekster.henter || state.allearbeidsgivere.henter,
        hentingFeilet: state.ledetekster.hentingFeilet || state.allearbeidsgivere.hentingFeilet,
        brodsmuler: [{
            tittel: getLedetekst('landingsside.sidetittel'),
            sti: '/',
            erKlikkbar: true,
        }, {
            tittel: getLedetekst('oppfolgingsdialoger.sidetittel'),
            sti: '/oppfolgingsdialoger',
        }],
    };
};

const OppfolgingsdialogContainer = connect(mapStateToProps, { hentAlleArbeidsgivere })(OpprettOppfolgingsdialogSide);

export default OppfolgingsdialogContainer;
