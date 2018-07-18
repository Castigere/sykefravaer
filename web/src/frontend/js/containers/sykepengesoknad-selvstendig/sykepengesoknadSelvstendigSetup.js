import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { bindActionCreators } from 'redux';
import { onSubmitFail } from '../FeiloppsummeringContainer';
import { SYKEPENGER_SKJEMANAVN } from '../../enums/skjemanavn';
import { sendSoknad } from '../../actions/soknader_actions';

export const finnSoknad = (state, ownProps) => {
    const soknader = state.soknader.data.filter((s) => {
        return s.id === ownProps.params.sykepengesoknadId;
    });
    return soknader.length === 1 ? soknader[0] : undefined;
};

const finnSykmelding = (state, ownProps) => {
    const soknad = finnSoknad(state, ownProps);
    const sykmeldinger = state.dineSykmeldinger.data.filter((s) => {
        return s.id === soknad.sykmeldingId;
    });
    return sykmeldinger.length === 1 ? sykmeldinger[0] : undefined;
};

const mapStateToProps = (state, ownProps) => {
    const soknad = finnSoknad(state, ownProps);
    return {
        soknad,
        sykmelding: finnSykmelding(state, ownProps),
        skjemasvar: getFormValues(SYKEPENGER_SKJEMANAVN)(state),
        sender: state.soknader.sender,
        sendingFeilet: state.soknader.sendingFeilet,
    };
};

const mapStateToPropsMedInitialValues = (state, ownProps) => {
    const soknad = finnSoknad(state, ownProps);

    return {
        ...mapStateToProps(state, ownProps),
        initialValues: {
            id: soknad.id,
        },
    };
};

const mapDispatchToProps = (dispatch) => {
    const actions = bindActionCreators({
        sendSoknad,
    }, dispatch);

    return {
        actions,
    };
};

export default (validate, Component, initialize = false) => {
    const form = reduxForm({
        form: SYKEPENGER_SKJEMANAVN,
        validate,
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
        onSubmitFail: (errors, dispatch) => {
            onSubmitFail(errors, dispatch, SYKEPENGER_SKJEMANAVN);
        },
    })(Component);
    if (initialize) {
        return connect(mapStateToPropsMedInitialValues)(form);
    }
    return connect(mapStateToProps, mapDispatchToProps)(form);
};