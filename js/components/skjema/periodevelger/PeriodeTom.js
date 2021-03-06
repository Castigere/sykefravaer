import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fieldPropTypes } from '../../../propTypes';
import Feilmelding from '../Feilmelding';
import PeriodeDatoinput from './PeriodeDatoinput';
import { Vis } from '../../../utils';
// eslint-disable-next-line import/no-cycle
import { PeriodevelgerContext } from './Periodevelger';

export const onDatoChange = (props, prevProps) => {
    const { value } = props.input;
    const prevValue = prevProps.input.value;
    if (typeof props.onChange === 'function'
        && value !== prevValue) {
        props.onChange(props.input.name, value);
    }
};

class PeriodeTomComponent extends Component {
    componentDidUpdate(prevProps) {
        const { erApen } = this.props;
        if (prevProps.erApen && !erApen) {
            this.toggle.focus();
        }
        onDatoChange(this.props, prevProps);
    }

    render() {
        const {
            meta, input, id, buttonId, onDoubleClick, onKeyUp, toggle, erApen,
        } = this.props;
        /* eslint-disable jsx-a11y/no-static-element-interactions */
        return (
            <div className="datovelger">
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                <div
                    className="datovelger__inner"
                    onClick={(event) => {
                        try {
                            event.nativeEvent.stopImmediatePropagation();
                        } catch (e) {
                            event.stopPropagation();
                        }
                    }}>
                    <div className="datovelger__inputContainer">
                        <PeriodeDatoinput meta={meta} id={id} input={input} onDoubleClick={onDoubleClick} onKeyUp={onKeyUp} />
                        <button
                            type="button"
                            className="js-toggle datovelger__toggleDayPicker"
                            ref={(c) => {
                                this.toggle = c;
                            }}
                            id={buttonId}
                            onClick={(e) => {
                                e.preventDefault();
                                toggle();
                            }}
                            aria-pressed={erApen}>
                            {erApen ? 'Skjul kalender' : 'Vis kalender'}
                        </button>
                    </div>
                    <Vis
                        hvis={!erApen}
                        render={() => {
                            return <Feilmelding {...meta} />;
                        }} />
                </div>
            </div>
        );
        /* eslint-enable jsx-a11y/no-static-element-interactions */
    }
}

PeriodeTomComponent.propTypes = {
    meta: fieldPropTypes.meta,
    id: PropTypes.string.isRequired,
    buttonId: PropTypes.string,
    input: fieldPropTypes.input,
    erApen: PropTypes.bool,
    toggle: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onKeyUp: PropTypes.func,
};

const PeriodeTom = (props) => {
    return (
        <PeriodevelgerContext.Consumer>
            {
                ({ onChange }) => {
                    return <PeriodeTomComponent {...props} onChange={onChange} />;
                }
            }
        </PeriodevelgerContext.Consumer>
    );
};

export default PeriodeTom;
