import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { senesteTom, sykmeldingstatuser as statuser, arbeidssituasjoner as situasjoner } from 'digisyfo-npm';
import DinSituasjon from '../../components/landingsside/DinSituasjon';

const { BEKREFTET, SENDT, TIL_SENDING } = statuser;
const { ARBEIDSTAKER } = situasjoner;

export function filtrerSykemeldingerPaaPeriode(state) {
    const treMndSiden = new Date();
    treMndSiden.setMonth(treMndSiden.getMonth() - 3);

    return state.dineSykmeldinger.data.filter((sykmelding) => {
        return senesteTom(sykmelding.mulighetForArbeid.perioder) > treMndSiden;
    });
}

export function filtrerArbeidssituasjoner(state) {
    return [...new Set(filtrerSykemeldingerPaaPeriode(state).filter((sykmelding) => {
        return sykmelding.status === BEKREFTET;
    }).map((sykmelding) => {
        return sykmelding.valgtArbeidssituasjon;
    }))];
}

export function filtrerArbeidsgivere(state) {
    return [...new Set(filtrerSykemeldingerPaaPeriode(state).filter((sykmelding) => {
        return sykmelding.status === SENDT || sykmelding.status === TIL_SENDING;
    }).map((sykmelding) => {
        return sykmelding.innsendtArbeidsgivernavn;
    }))];
}

export const Container = ({ arbeidsgivere, arbeidssituasjoner }) => {
    return ((arbeidsgivere && arbeidsgivere.length) || (arbeidssituasjoner && arbeidssituasjoner.length))
        ? <DinSituasjon arbeidsgivere={arbeidsgivere} arbeidssituasjoner={arbeidssituasjoner} />
        : null;
};

Container.propTypes = {
    arbeidsgivere: PropTypes.arrayOf(PropTypes.string),
    arbeidssituasjoner: PropTypes.arrayOf(PropTypes.string),
};

export const mapStateToProps = (state) => {
    const arbeidsgivere = filtrerArbeidsgivere(state);
    const arbeidssituasjoner = filtrerArbeidssituasjoner(state)
        .filter((arbeidssituasjon) => {
            return !(arbeidssituasjon === ARBEIDSTAKER && arbeidsgivere.length);
        });
    return {
        arbeidsgivere,
        arbeidssituasjoner,
    };
};

const DinSituasjonContainer = connect(mapStateToProps)(Container);
export default DinSituasjonContainer;
