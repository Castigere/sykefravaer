import React, { PropTypes } from 'react';

export function getIkon(type) {
    let typeIkon;
    let ikonAlt = 'Info';
    const modigFrontendIkonRot = '/sykefravaer/img/modig-frontend/ikoner-svg/';

    switch (type) {
        case 'suksess': {
            typeIkon = `${modigFrontendIkonRot}ikon-suksess.svg`;
            ikonAlt = 'Suksess';
            break;
        }
        case 'feil': {
            typeIkon = '/sykefravaer/img/svg/utropstegn-hvit.svg';
            break;
        }
        case 'info': {
            typeIkon = '/sykefravaer/img/svg/utropstegn-hvit.svg';
            break;
        }
        case 'avbrutt': {
            typeIkon = '/sykefravaer/img/svg/avbryt-sykmelding-roed.svg';
            ikonAlt = 'Avbrutt';
            break;
        }
        default: {
            typeIkon = `${modigFrontendIkonRot}ikon-informasjon.svg`;
            break;
        }
    }
    return {
        typeIkon,
        ikonAlt,
    };
}

const Varselstripe = ({ type = 'default', children }) => {
    const typeClass = `varselstripe--${type}`;
    const { typeIkon, ikonAlt } = getIkon(type);

    return (<div className={`varselstripe ${(type ? typeClass : '')}`}>
        <div className="varselstripe__ikon">
            <img src={typeIkon} alt={ikonAlt} />
        </div>
        {children}
    </div>);
};

Varselstripe.propTypes = {
    type: PropTypes.string,
    children: PropTypes.object,
};

export default Varselstripe;
