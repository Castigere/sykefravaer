import { fraInputdatoTilJSDato } from './index';

export const tidligsteFom = (perioder) => {
    return perioder.map(p => { return p.fom; }).sort((p1, p2) => {
        if (p1 > p2) {
            return 1;
        } else if (p1 < p2) {
            return -1;
        } return 0;
    })[0];
};

export const erBrukerSykmeldtPdd = (sykmeldinger) => {
    return sykmeldinger.filter(sykmelding => {
        return sykmelding.mulighetForArbeid.perioder.filter((periode) => {
            const tom = fraInputdatoTilJSDato(periode.tom);
            tom.setDate(tom.getDate() + 1);
            return fraInputdatoTilJSDato(periode.fom) < new Date() && fraInputdatoTilJSDato(periode.tom) > new Date();
        }).length > 0;
    }).length > 0;
};

export const finnArbeidsgivereForAktiveSykmeldinger = (sykmeldinger) => {
    return sykmeldinger.filter(sykmelding => {
        return sykmelding.mulighetForArbeid.perioder.filter((periode) => {
            const tom = fraInputdatoTilJSDato(periode.tom);
            tom.setDate(tom.getDate() + 1);
            return fraInputdatoTilJSDato(periode.fom) < new Date() && fraInputdatoTilJSDato(periode.tom) > new Date();
        }).length > 0;
    }).map((sykmelding) => {
        return {
            virksomhetsnummer: sykmelding.orgnummer,
            navn: sykmelding.arbeidsgiver,
        };
    });
};

export const senesteTom = (perioder) => {
    return perioder.map(p => { return p.tom; }).sort((p1, p2) => {
        if (p1 < p2) {
            return 1;
        } else if (p1 > p2) {
            return -1;
        } return 0;
    })[0];
};

const erPafolgendeDager = (a, b) => {
    return b.getTime() - a.getTime() === 86400000;
};

const datoErHelgedag = (dato) => {
    const LORDAG = 6;
    const SONDAG = 0;
    return dato.getDay() === LORDAG || dato.getDay() === SONDAG;
};

const tilDatePeriode = (periode) => {
    let fom;
    let tom;
    try {
        fom = fraInputdatoTilJSDato(periode.fom);
    } catch (e) {
        fom = periode.fom;
    }
    try {
        tom = fraInputdatoTilJSDato(periode.tom);
    } catch (e) {
        tom = periode.tom;
    }
    return { fom, tom };
};

export const periodeErHelg = (periode) => {
    let fom;
    let tom;
    try {
        fom = fraInputdatoTilJSDato(periode.fom);
    } catch (e) {
        return false;
    }
    try {
        tom = fraInputdatoTilJSDato(periode.tom);
    } catch (e) {
        return false;
    }
    if (datoErHelgedag(fom) && datoErHelgedag(tom) && (erPafolgendeDager(fom, tom) || fom.getTime() === tom.getTime())) {
        return true;
    }
    return false;
};

export const perioderErHelg = (perioder) => {
    return perioder.length > 0 && perioder.reduce((acc, periode) => {
        return acc && periodeErHelg(periode) === true;
    }, true);
};

export const periodeOverlapperMedPeriode = (periodeA_, periodeB_) => {
    const periodeA = tilDatePeriode(periodeA_);
    const periodeB = tilDatePeriode(periodeB_);
    try {
        const forstePeriode = periodeA.fom.getTime() < periodeB.fom.getTime() ? periodeA : periodeB;
        const andrePeriode = periodeA.fom.getTime() < periodeB.fom.getTime() ? periodeB : periodeA;
        return forstePeriode.tom.getTime() >= andrePeriode.fom.getTime();
    } catch (e) {
        return false;
    }
};

export const periodeOverlapperMedPerioder = (periode_, perioder_) => {
    const periode = tilDatePeriode(periode_);
    const perioder = perioder_.map(tilDatePeriode);
    return perioder.reduce((acc, p) => {
        return periodeOverlapperMedPeriode(periode, p) || acc;
    }, false);
};

export const perioderOverlapperMedPerioder = (perioderA, perioderB) => {
    if (!perioderA || !perioderB || perioderA.length === 0 || perioderB.length === 0) {
        return false;
    }
    const bools = perioderA.map((periode) => {
        return periodeOverlapperMedPerioder(periode, perioderB);
    });

    return bools.reduce((acc, bool) => {
        return acc && bool;
    }, true);
};

export const erGyldigPeriode = (periode) => {
    try {
        fraInputdatoTilJSDato(periode.fom);
        fraInputdatoTilJSDato(periode.tom);
    } catch (e) {
        return false;
    }
    return true;
};

export const harOverlappendePerioder = (perioder) => {
    const gyldigePerioder = perioder.filter(erGyldigPeriode);
    if (gyldigePerioder.length === 0) {
        return false;
    }
    const overlappingsinfo = gyldigePerioder.map((p, index) => {
        const perioderUtenDennePerioden = gyldigePerioder.filter((p2, index2) => {
            return index !== index2;
        });
        return periodeOverlapperMedPerioder(p, perioderUtenDennePerioden);
    });
    return overlappingsinfo.reduce((acc, bool) => {
        return acc || bool;
    }, false);
};
