import React, { PropTypes, Component } from 'react';
import { FieldArray } from 'redux-form';
import Datovelger from './Datovelger';
import Feilomrade from './Feilomrade';
import { getLedetekst } from 'digisyfo-npm';
import { connect } from 'react-redux';
import { harOverlappendePerioder } from '../../utils/periodeUtils';

export const Periode = (props) => {
    const { name, index, onRemoveHandler, tidligsteFom, senesteTom } = props;
    const fomName = `${name}.fom`;
    const tomName = `${name}.tom`;
    return (<div className="periodevelger__periode">
        <div className="periodevelger__fom input--s">
            <label htmlFor={fomName}>{getLedetekst('sykepengesoknad.periodevelger.fom')}</label>
            <Datovelger name={fomName} id={fomName} tidligsteFom={tidligsteFom} senesteTom={senesteTom} />
        </div>
        <div className="periodevelger__tom input--s">
            <label htmlFor={tomName}>{getLedetekst('sykepengesoknad.periodevelger.tom')}</label>
            <Datovelger name={tomName} id={tomName} tidligsteFom={tidligsteFom} senesteTom={senesteTom} />
        </div>
        <div className="periodevelger__verktoy">
        {
            index > 0 && <a role="button" className="lenke" href="#" onClick={(e) => {
                e.preventDefault();
                onRemoveHandler();
            }}>{getLedetekst('sykepengesoknad.periodevelger.slett')}</a>
        }
        </div>
    </div>);
};

Periode.propTypes = {
    fields: PropTypes.object,
    index: PropTypes.number,
    onRemoveHandler: PropTypes.func,
    tidligsteFom: PropTypes.instanceOf(Date),
    senesteTom: PropTypes.instanceOf(Date),
    name: PropTypes.string.isRequired,
};

export class Periodevelger extends Component {
    componentWillMount() {
        if (this.props.fields.length === 0) {
            this.props.fields.push({});
        }
    }

    render() {
        const { fields, namePrefix, spoersmal, meta, Overskrift, tidligsteFom, senesteTom } = this.props;
        return (<div className="periodevelger">
            <div className={meta && meta.touched && meta.error ? 'blokk' : ''}>
                <Feilomrade {...meta}>
                    <Overskrift className="skjema__sporsmal">{spoersmal}</Overskrift>
                    <div className="periodevelger__perioder">
                        {
                            fields.map((field, index) => {
                                return (<Periode
                                    name={`${namePrefix}[${index}]`}
                                    key={index}
                                    index={index}
                                    tidligsteFom={tidligsteFom}
                                    senesteTom={senesteTom}
                                    onRemoveHandler={() => {
                                        fields.remove(index);
                                    }} />);
                            })
                        }
                    </div>
                </Feilomrade>
            </div>
            <button className="lenke" type="button" onClick={(e) => {
                e.preventDefault();
                fields.push({});
            }}>+ {getLedetekst('sykepengesoknad.periodevelger.legg-til-ekstra')}</button>
        </div>);
    }
}

Periodevelger.propTypes = {
    fields: PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.object,
    ]),
    namePrefix: PropTypes.string,
    spoersmal: PropTypes.string,
    meta: PropTypes.object,
    Overskrift: PropTypes.string,
    tidligsteFom: PropTypes.instanceOf(Date),
    senesteTom: PropTypes.instanceOf(Date),
};

Periodevelger.defaultProps = {
    Overskrift: 'h4',
};

export const StateConnectedPeriodevelger = connect()(Periodevelger);

const PeriodevelgerField = ({ name, spoersmal, tidligsteFom, senesteTom }) => {
    return (<FieldArray
        validate={(value) => {
            if (harOverlappendePerioder(value)) {
                return 'Du kan ikke legge inn perioder som overlapper med hverandre';
            }
            return undefined;
        }}
        component={StateConnectedPeriodevelger}
        name={name}
        namePrefix={name}
        spoersmal={spoersmal}
        tidligsteFom={tidligsteFom}
        senesteTom={senesteTom} />);
};

PeriodevelgerField.propTypes = {
    name: PropTypes.string,
    spoersmal: PropTypes.string,
    tidligsteFom: PropTypes.instanceOf(Date),
    senesteTom: PropTypes.instanceOf(Date),
};

export default PeriodevelgerField;
