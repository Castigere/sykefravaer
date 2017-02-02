import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import history from '../../history';

const sendTilFoerDuBegynner = (sykepengesoknad) => {
    history.replace(`/sykefravaer/soknader/${sykepengesoknad.id}`);
};

export const mapToInitialValues = (soknad) => {
    return Object.assign({}, soknad, {
        aktiviteter: soknad.aktiviteter.map((aktivitet) => {
            return Object.assign({}, aktivitet, {
                avvik: {},
            });
        }),
        utdanning: {},
        andreInntektskilder: {},
        utenlandsopphold: {
            perioder: [],
        },
    });
};

export const SYKEPENGER_SKJEMANAVN = 'SYKEPENGERSKJEMA';

const setup = (validate, Component, initialize = false) => {
    const form = reduxForm({
        form: SYKEPENGER_SKJEMANAVN,
        validate,
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
        sendTilFoerDuBegynner,
    })(Component);
    if (initialize) {
        return connect((state, ownProps) => {
            return {
                initialValues: mapToInitialValues(ownProps.sykepengesoknad),
            };
        })(form);
    }
    return form;
};

export default setup;