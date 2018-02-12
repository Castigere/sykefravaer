import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { senesteTom } from 'digisyfo-npm';
import DinSituasjon from '../../components/landingsside/DinSituasjon';

export function filtrerSykemeldingerPaaPeriode(sykmeldinger) {
    const treMndSiden = new Date();
    treMndSiden.setMonth(treMndSiden.getMonth() - 3);

    return sykmeldinger.filter((sykmelding) => {
        return senesteTom(sykmelding.mulighetForArbeid.perioder) > treMndSiden;
    });
}

export function mapArbeidssituasjonString(arbeidssituasjon) {
    switch (arbeidssituasjon) {
        case 'ARBEIDSTAKER':
            return 'Arbeidstaker';
        case 'NAERINGSDRIVENDE':
            return 'Selvstendig næringsdrivende';
        case 'FRILANSER':
            return 'Frilanser';
        case 'ARBEIDSLEDIG':
            return 'Arbeidsledig';
        default:
            return 'Annet';
    }
}

export function filtrerArbeidssituasjoner(sykmeldinger) {
    return [...new Set(sykmeldinger.filter((sykmelding) => {
        return sykmelding.status === 'BEKREFTET';
    }).map((sykmelding) => {
        return mapArbeidssituasjonString(sykmelding.valgtArbeidssituasjon);
    }))];
}

export function filtrerArbeidsgivere(sykmeldinger) {
    return [...new Set(sykmeldinger.filter((sykmelding) => {
        return sykmelding.status === 'SENDT';
    }).map((sykmelding) => {
        return sykmelding.innsendtArbeidsgivernavn;
    }))];
}

export const Container = ({ arbeidsgivere, arbeidssituasjoner }) => {
    return ((arbeidsgivere && arbeidsgivere.length) || (arbeidssituasjoner && arbeidssituasjoner.length))
        && <DinSituasjon arbeidsgivere={arbeidsgivere} arbeidssituasjoner={arbeidssituasjoner}/>
};

Container.propTypes = {
    arbeidsgivere: PropTypes.arrayOf(PropTypes.string),
    arbeidssituasjoner: PropTypes.arrayOf(PropTypes.string),
};

export const mapStateToProps = (state) => {
    const sykmeldingerFiltrertPaaPeriode = filtrerSykemeldingerPaaPeriode(state.dineSykmeldinger.data);
    const arbeidsgivere = filtrerArbeidsgivere(sykmeldingerFiltrertPaaPeriode);
    const arbeidssituasjoner = filtrerArbeidssituasjoner(sykmeldingerFiltrertPaaPeriode)
            .filter((arbeidssituasjon) => {
                return !(arbeidssituasjon === 'Arbeidstaker' && arbeidsgivere.length);
            });
    return {
        arbeidsgivere: arbeidsgivere,
        arbeidssituasjoner: arbeidssituasjoner,
    };
};

const DinSituasjonContainer = connect(mapStateToProps)(Container);
export default DinSituasjonContainer;
