import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autofill, formValueSelector, touch } from 'redux-form';
import {
    fraInputdatoTilJSDato, scrollTo, tilLesbarDatoUtenAarstall, toDatePrettyPrint,
} from '@navikt/digisyfo-npm';
import { connect } from 'react-redux';
import DayPicker, { DateUtils } from 'react-day-picker';
import {
    localeUtils, MONTHS, WEEKDAYS_LONG, WEEKDAYS_SHORT,
} from '../daypicker/daypickerLocale';
import Caption from '../daypicker/DayPickerCaption';
import NavBar from '../daypicker/DayPickerNavBar';
import { leggTilNullForan } from '../datovelger/DayPickerDato';
import { erGyldigDato } from '../../../utils/datoUtils';

const Style = () => (
    <style dangerouslySetInnerHTML={{
        __html:
                '@media (max-width: 30em) { body { overflow: hidden!important; } }',
    }} />
);

const Datoer = ({ fom, tom }) => {
    const tekst = fom && tom
        ? `Fra <strong>${tilLesbarDatoUtenAarstall(fom)}</strong> til <strong>${tilLesbarDatoUtenAarstall(tom)}</strong>`
        : fom
            ? `Startdato: <strong>${tilLesbarDatoUtenAarstall(fom)}</strong>`
            : '&nbsp;';
    return <p className="periodekalender__datoer" aria-live="polite" dangerouslySetInnerHTML={{ __html: tekst }} />;
};

Datoer.propTypes = {
    fom: PropTypes.instanceOf(Date),
    tom: PropTypes.instanceOf(Date),
};

const velgerStartdato = (fra, til, dato) => {
    const erForForsteDag = fra && DateUtils.isDayBefore(dato, fra);
    const periodeErValgt = fra && til;
    return !fra || erForForsteDag || periodeErValgt;
};

class DayPickerPeriode extends Component {
    constructor(props) {
        const { valgtTil } = props;
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
        this.erDeaktivertDag = this.erDeaktivertDag.bind(this);
        this.state = {
            valgtTil,
        };
    }

    componentDidMount() {
        this.kalender.focus();
    }

    componentWillReceiveProps(props) {
        this.setState({
            valgtTil: props.valgtTil,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { erApen } = this.state;
        if (!prevState.erApen && erApen) {
            scrollTo(this.kalender);
            this.kalender.focus();
        }
    }

    getTittel() {
        const { valgtFra, valgtTil } = this.props;
        return valgtFra && valgtTil
            ? 'Velg periode'
            : valgtFra
                ? 'Velg sluttdato'
                : 'Velg startdato';
    }

    getModus() {
        const { valgtFra, valgtTil } = this.props;
        return valgtFra && !valgtTil ? 'velgSluttdato' : 'velgStartdato';
    }

    getInitialMonth() {
        const {
            valgtFra, valgtTil, tidligsteFom, senesteTom, initiellDato,
        } = this.props;
        return valgtTil || valgtFra || initiellDato || senesteTom || tidligsteFom;
    }

    handleDayClick(dato) {
        const { valgtFra, valgtTil, names } = this.props;
        if (this.erDeaktivertDag(dato)) {
            return;
        }
        if (velgerStartdato(valgtFra, valgtTil, dato)) {
            this.lagreTilReduxState(names[0], toDatePrettyPrint(dato));
            this.lagreTilReduxState(names[1], undefined);
        } else {
            this.lagreTilReduxState(names[1], toDatePrettyPrint(dato));
            this.setState({
                valgtTil: dato,
            });
        }
    }

    handleDayMouseEnter(dato) {
        const { valgtFra, valgtTil } = this.props;
        if (!this.erDeaktivertDag(dato) && !velgerStartdato(valgtFra, valgtTil, dato)) {
            this.setState({
                valgtTil: dato,
            });
        }
    }

    lagreTilReduxState(fieldName, value) {
        const { doAutofill, doTouch, skjemanavn } = this.props;
        doAutofill(skjemanavn, fieldName, value);
        if (value) {
            doTouch(skjemanavn, fieldName);
        }
    }

    erDeaktivertDag(dato) {
        const { tidligsteFom, senesteTom } = this.props;
        const _dato = new Date(`${dato.getFullYear()}-${leggTilNullForan(dato.getMonth() + 1)}-${leggTilNullForan(dato.getDate())}`);
        return _dato < tidligsteFom || _dato > senesteTom;
    }

    render() {
        const {
            valgtFra, valgtTil, lukk, Overskrift,
        } = this.props;
        const fraEllerTil = valgtFra || valgtTil;
        const modifiers = { start: fraEllerTil, end: valgtTil };
        // eslint-disable-next-line react/destructuring-assignment
        const selectedDays = [fraEllerTil, { from: fraEllerTil, to: this.state.valgtTil }];

        return (
            <div
                className={`periodekalender periodekalender--${this.getModus()} js-periodekalender`}
                ref={(c) => {
                    this.kalender = c;
                }}
                tabIndex="-1"
                role="application">
                <Overskrift id="periodekalender-tittel" className="periodekalender__tittel" aria-live="polite">{this.getTittel()}</Overskrift>
                <div className="periodekalender__kalender">
                    <DayPicker
                        locale="no"
                        months={MONTHS}
                        weekdaysLong={WEEKDAYS_LONG}
                        weekdaysShort={WEEKDAYS_SHORT}
                        localeUtils={localeUtils}
                        firstDayOfWeek={1}
                        initialMonth={this.getInitialMonth()}
                        captionElement={<Caption />}
                        navbarElement={<NavBar />}
                        modifiers={modifiers}
                        selectedDays={selectedDays}
                        disabledDays={this.erDeaktivertDag}
                        onDayClick={this.handleDayClick}
                        onDayMouseEnter={this.handleDayMouseEnter} />
                </div>
                <div className="periodekalender__kontroller">
                    <Datoer fom={valgtFra} tom={valgtTil} />
                    <button
                        type="button"
                        className="knapp"
                        onClick={lukk}>
                        Lagre periode
                    </button>
                </div>
                <Style />
            </div>
        );
    }
}

DayPickerPeriode.defaultProps = {
    Overskrift: 'h3',
};

DayPickerPeriode.propTypes = {
    tidligsteFom: PropTypes.instanceOf(Date),
    senesteTom: PropTypes.instanceOf(Date),
    initiellDato: PropTypes.instanceOf(Date),
    doAutofill: PropTypes.func,
    doTouch: PropTypes.func,
    skjemanavn: PropTypes.string,
    Overskrift: PropTypes.string,
    lukk: PropTypes.func,
    names: PropTypes.arrayOf(PropTypes.string),
    valgtFra: PropTypes.instanceOf(Date),
    valgtTil: PropTypes.instanceOf(Date),
};

const mapStateToProps = (state, ownProps) => {
    const fomValue = formValueSelector(ownProps.skjemanavn)(state, ownProps.names[0]);
    const tomValue = formValueSelector(ownProps.skjemanavn)(state, ownProps.names[1]);

    const valgtFra = fomValue && erGyldigDato(fomValue) ? fraInputdatoTilJSDato(fomValue) : undefined;
    const valgtTil = tomValue && erGyldigDato(tomValue) ? fraInputdatoTilJSDato(tomValue) : undefined;

    return {
        valgtFra, valgtTil,
    };
};

export default connect(mapStateToProps, { doAutofill: autofill, doTouch: touch })(DayPickerPeriode);
