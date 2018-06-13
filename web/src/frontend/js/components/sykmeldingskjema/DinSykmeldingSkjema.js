import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import {
    tilDatePeriode,
    getLedetekst,
    Varselstripe,
    arbeidssituasjoner,
    feilaktigeOpplysninger as feilaktigeOpplysningerEnums,
    getHtmlLedetekst,
} from 'digisyfo-npm';
import VelgArbeidssituasjon from './VelgArbeidssituasjon';
import ArbeidsgiversSykmeldingContainer from '../../containers/sykmelding/ArbeidsgiversSykmeldingContainer';
import ErOpplysningeneRiktige from './ErOpplysningeneRiktige';
import StrengtFortroligInfo from './StrengtFortroligInfo';
import AvbrytDialog from './AvbrytDialog';
import { sykmelding as sykmeldingPt } from '../../propTypes';
import FeiloppsummeringContainer, { onSubmitFail } from '../../containers/FeiloppsummeringContainer';
import validerSykmeldingskjema from './validerSykmeldingskjema';
import * as sykmeldingActions from '../../actions/dinSykmelding_actions';
import { sykmeldingskjemamodi as modi, DIN_SYKMELDING_SKJEMANAVN } from '../../enums/sykmeldingskjemaenums';
import { getSkjemaModus } from './sykmeldingSkjemaUtils';
import SpoersmalForFrilanserOgNaeringsdrivende from './SpoersmalForFrilanserOgNaeringsdrivende';
import { Vis } from '../../utils';

const { ARBEIDSTAKER, NAERINGSDRIVENDE, FRILANSER } = arbeidssituasjoner;

export class DinSykmeldingSkjemaComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.values.opplysningeneErRiktige !== this.props.values.opplysningeneErRiktige) {
            this.setState({
                visAvbrytDialog: false,
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.sykmelding.id !== prevProps.sykmelding.id) {
            // Tilbakestiller data i skjema dersom man navigverer til en ny sykmelding
            this.props.reset();
        }
    }

    getFeilaktigeOpplysninger() {
        const { values } = this.props;
        return values.feilaktigeOpplysninger
            .filter((opplysning) => {
                return opplysning.avkrysset && !values.opplysningeneErRiktige;
            })
            .reduce((acc, currentValue) => {
                return {
                    ...acc,
                    [currentValue.opplysning]: true,
                };
            }, {});
    }

    getDekningsgrad() {
        const { values } = this.props;
        return (!this.erFrilanser() || !values.harForsikring)
            ? null
            : values.dekningsgrad;
    }

    getEgenmeldingsperioder() {
        const { values } = this.props;
        return !this.erFrilanser() || !values.varSykmeldtEllerEgenmeldt
            ? null
            : values.egenmeldingsperioder.map(tilDatePeriode);
    }

    erFrilanser() {
        const { values } = this.props;
        return [NAERINGSDRIVENDE, FRILANSER].indexOf(values.valgtArbeidssituasjon) > -1;
    }

    avbryt() {
        this.props.avbrytSykmelding(this.props.sykmelding.id, this.getFeilaktigeOpplysninger());
    }

    handleSubmit(values) {
        const { sykmelding, modus } = this.props;
        const feilaktigeOpplysninger = this.getFeilaktigeOpplysninger();

        switch (modus) {
            case modi.SEND_MED_NAERMESTE_LEDER:
            case modi.SEND: {
                this.props.sendSykmeldingTilArbeidsgiver(
                    sykmelding.id,
                    values.valgtArbeidsgiver.orgnummer,
                    feilaktigeOpplysninger,
                    values.beOmNyNaermesteLeder,
                );
                return;
            }
            case modi.BEKREFT: {
                this.props.bekreftSykmelding(
                    sykmelding.id,
                    {
                        arbeidssituasjon: values.valgtArbeidssituasjon,
                        feilaktigeOpplysninger,
                        egenmeldingsperioder: this.getEgenmeldingsperioder(),
                        harForsikring: values.harForsikring,
                        harAnnetFravaer: values.varSykmeldtEllerEgenmeldt,
                        dekningsgrad: this.getDekningsgrad(),
                    },
                );
                return;
            }
            case modi.AVBRYT: {
                this.setState({
                    visAvbrytDialog: !this.state.visAvbrytDialog,
                });
                break;
            }
            default: {
                break;
            }
        }
    }

    render() {
        const {
            values,
            modus,
            harStrengtFortroligAdresse,
            sykmelding,
            sender,
            sendingFeilet,
            avbryter,
            avbrytFeilet,
            handleSubmit,
            visFrilansersporsmal,
            untouch } = this.props;

        return (<form
            id="dinSykmeldingSkjema"
            onSubmit={handleSubmit((v) => {
                this.handleSubmit(v);
            })}>
            <FeiloppsummeringContainer skjemanavn={DIN_SYKMELDING_SKJEMANAVN} />
            <h3 className="typo-innholdstittel">{getLedetekst('starte-sykmelding.tittel')}</h3>
            <div className="redaksjonelt-innhold blokk" dangerouslySetInnerHTML={getHtmlLedetekst('din-sykmelding.gdpr.bruk-sykmeldingen')} />
            <ErOpplysningeneRiktige untouch={untouch} />
            <Vis hvis={modus !== modi.AVBRYT}>
                <div className="blokk">
                    <VelgArbeidssituasjon {...this.props} />
                    <Vis hvis={values.valgtArbeidssituasjon === ARBEIDSTAKER && harStrengtFortroligAdresse}>
                        <StrengtFortroligInfo sykmeldingId={sykmelding.id} />
                    </Vis>
                    <Vis hvis={visFrilansersporsmal}>
                        <SpoersmalForFrilanserOgNaeringsdrivende sykmeldingId={sykmelding.id} />
                    </Vis>
                </div>
            </Vis>
            <Vis hvis={values.valgtArbeidssituasjon === ARBEIDSTAKER}>
                <ArbeidsgiversSykmeldingContainer sykmeldingId={sykmelding.id} Overskrift="h4" />
            </Vis>
            <div aria-live="polite" role="alert">
                <Vis hvis={sendingFeilet || avbrytFeilet}>
                    <div className="panel panel-ramme js-varsel">
                        <Varselstripe type="feil">
                            <p className="sist">Beklager, det oppstod en feil! Prøv igjen litt senere.</p>
                        </Varselstripe>
                    </div>
                </Vis>
            </div>
            <Vis hvis={modus !== modi.GA_VIDERE && modus !== modi.SEND && modus !== modi.SEND_MED_NAERMESTE_LEDER}>
                <p className="dinSykmeldingSkjema__sendInfo">{getLedetekst(`starte-sykmelding.info.${modus.toLowerCase()}`)}</p>
            </Vis>
            <div className="knapperad">
                <p className="blokk--s">
                    <button
                        disabled={sender}
                        ref={(c) => {
                            this.submitknapp = c;
                        }}
                        type="submit"
                        id="dinSykmeldingSkjemaSubmit"
                        className={`js-submit knapp ${modus === modi.AVBRYT ? 'knapp--fare' : ''} ${(sender) ? 'js-spinner' : ''}`}>
                        {getLedetekst(`starte-sykmelding.knapp.${modus}`)}
                        { sender && <span className="knapp__spinner" /> }
                    </button>
                </p>
                <div className="avbrytDialog">
                    <Vis hvis={modus !== modi.AVBRYT}>
                        <p className="blokk">
                            <button
                                aria-pressed={this.state.visAvbrytDialog}
                                className="lenke"
                                ref={(c) => {
                                    this.triggAvbrytdialogKnapp = c;
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                        visAvbrytDialog: !this.state.visAvbrytDialog,
                                    });
                                }}>{getLedetekst('starte-sykmelding.trigger-avbryt-dialog')}</button>
                        </p>
                    </Vis>
                    <AvbrytDialog
                        vis={this.state.visAvbrytDialog}
                        avbryter={avbryter}
                        avbrytHandler={() => {
                            this.setState({
                                visAvbrytDialog: false,
                            });
                            if (this.triggAvbrytdialogKnapp) {
                                this.triggAvbrytdialogKnapp.focus();
                            } else if (this.submitknapp) {
                                this.submitknapp.focus();
                            }
                        }}
                        bekreftHandler={() => {
                            this.avbryt(sykmelding.id, this.getFeilaktigeOpplysninger());
                        }} />
                </div>
            </div>
        </form>);
    }
}

DinSykmeldingSkjemaComponent.propTypes = {
    sykmelding: sykmeldingPt,
    sender: PropTypes.bool,
    sendingFeilet: PropTypes.bool,
    avbryter: PropTypes.bool,
    avbrytFeilet: PropTypes.bool,
    handleSubmit: PropTypes.func,
    values: PropTypes.shape({
        opplysningeneErRiktige: PropTypes.bool,
    }),
    untouch: PropTypes.func,
    sendSykmeldingTilArbeidsgiver: PropTypes.func,
    bekreftHandler: PropTypes.func,
    avbrytSykmelding: PropTypes.func,
    harStrengtFortroligAdresse: PropTypes.bool,
    bekreftSykmelding: PropTypes.func,
    reset: PropTypes.func,
    modus: PropTypes.oneOf(Object.values(modi)),
    visFrilansersporsmal: PropTypes.bool,
};

const mapStateToProps = (state) => {
    const harStrengtFortroligAdresse = state.brukerinfo.bruker.data.strengtFortroligAdresse;
    const values = getFormValues(DIN_SYKMELDING_SKJEMANAVN)(state);

    return {
        values,
        harStrengtFortroligAdresse,
        modus: getSkjemaModus(values, harStrengtFortroligAdresse),
        sender: state.arbeidsgiversSykmeldinger.sender,
        sendingFeilet: state.dineSykmeldinger.sendingFeilet,
        avbryter: state.dineSykmeldinger.avbryter,
        avbrytFeilet: state.dineSykmeldinger.avbrytFeilet,
    };
};

export const DinSykmeldingConnectedSkjema = connect(mapStateToProps, sykmeldingActions)(DinSykmeldingSkjemaComponent);

const initialValues = {
    feilaktigeOpplysninger: Object.keys(feilaktigeOpplysningerEnums).map((key) => {
        return {
            opplysning: feilaktigeOpplysningerEnums[key],
        };
    }),
    valgtArbeidssituasjon: arbeidssituasjoner.DEFAULT,
};

export default reduxForm({
    form: DIN_SYKMELDING_SKJEMANAVN,
    initialValues,
    validate: validerSykmeldingskjema,
    onSubmitFail: (error, dispatch) => {
        onSubmitFail(error, dispatch, DIN_SYKMELDING_SKJEMANAVN);
    },
})(DinSykmeldingConnectedSkjema);
