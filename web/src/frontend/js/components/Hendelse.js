import React, { PropTypes, Component } from 'react';
import { getLedetekst } from '../ledetekster';
import TidslinjeBudskap from './TidslinjeBudskap.js';
import { scrollTo } from '../utils';
import { toDatePrettyPrint } from '../utils/datoUtils.js'

const StatusIkon = ({ type }) => {
    const status = {
        statusClassName: 'milepael-status-klokke',
        ikonClassName: 'milepael-ikon-klokke',
        ikon: 'klokke-svart.svg',
        alt: '',
    };
    if (type === 'START') {
        status.statusClassName = '';
        status.ikonClassName = '';
        status.ikon = 'person.svg';
    }
    return (<div className={`milepael-status ${status.statusClassName}`}>
        <div className={`milepael-ikon ${status.ikonClassName}`}>
            <img src={`/sykefravaer/img/svg/${status.ikon}`} alt={status.alt} />
        </div>
    </div>);
};

StatusIkon.propTypes = {
    type: PropTypes.string,
};

class Hendelse extends Component {

    constructor(props) {
        super(props);
        this.props.setHendelseState({
            medAnimasjon: this.props.erApen === true,
        });
    }

    getContainerClass() {
        let className = this.props.erApen ? 'milepael-budskap-container er-apen' : 'milepael-budskap-container';
        if (this.props.medAnimasjon) {
            className = `${className} med-animasjon`;
        }
        return className;
    }

    setNaavaerendeHoyde() {
        const budskapHoyde = this.refs['js-budskap'].offsetHeight;
        const naaHoyde = !this.props.erApen ? null : budskapHoyde;

        this.props.setHendelseState({
            hoyde: `${naaHoyde}px`,
        });
    }

    apne() {
        this.setNaavaerendeHoyde();
        this.props.setHendelseState({
            visBudskap: true,
            medAnimasjon: true,
            hindreToggle: true,
        });
        setTimeout(() => {
            const nyHoyde = `${this.refs['js-budskap'].offsetHeight}px`;
            this.props.setHendelseState({
                hoyde: nyHoyde,
                erApen: true,
            });
        }, 0);
        setTimeout(() => {
            scrollTo(this.refs.boble, 1000);
            this.props.setHendelseState({
                medAnimasjon: false,
                hoyde: 'auto',
                hindreToggle: false,
            });
            setTimeout(() => {
                this.props.setHendelseState({
                    medAnimasjon: true,
                });
            }, 20);
        }, 300);
    }

    lukk() {
        this.props.setHendelseState({
            medAnimasjon: true,
            hindreToggle: true,
        });
        this.setNaavaerendeHoyde();
        setTimeout(() => {
            this.props.setHendelseState({
                hoyde: '0',
                erApen: false,
            });
        }, 0);
        setTimeout(() => {
            this.props.setHendelseState({
                visBudskap: false,
                medAnimasjon: false,
                hindreToggle: false,
            });
        }, 300);
    }

    toggle(e) {
        e.preventDefault();
        if (this.props.erApen && !this.props.hindreToggle) {
            this.lukk();
        } else if (!this.props.hindreToggle) {
            this.apne();
        }
    }

    render() {
        return (<article className="milepael" ref="milepael">
                <StatusIkon type={this.props.type} />
                <div className="milepael-innhold">
                    <div className="milepael-meta">
                        <h2>{getLedetekst(`${this.props.ledetekst}.meta`, this.props.ledetekster, { '%DATO%': toDatePrettyPrint(this.props.data.oppfoelgingsdato) })} </h2>
                    </div>
                    <div className="milepael-boble" ref="boble">
                        <button
                            onClick={(e) => { this.toggle(e); }}
                            aria-pressed={this.props.erApen}
                            className={!this.props.erApen ? 'header-milepael' : 'header-milepael er-apen'}>
                            <h3 className={!this.props.erApen ? 'milepael-tittel milepael-tittel-collapse' : 'milepael-tittel milepael-tittel-collapse er-apen'}>
                                {getLedetekst(`${this.props.ledetekst}.tittel`, this.props.ledetekster)}
                            </h3>
                        </button>
                        <div
                            aria-hidden={!this.props.erApen}
                            style={this.props.hoyde ? { height: this.props.hoyde } : {}}
                            className={this.getContainerClass()}>
                            <div ref="js-budskap">
                                <TidslinjeBudskap
                                    vis={this.props.visBudskap}
                                    bilde={this.props.bilde}
                                    alt={this.props.alt}
                                    innhold={getLedetekst(`${this.props.ledetekst}.budskap`, this.props.ledetekster)} />
                            </div>
                        </div>
                    </div>
                </div>
        </article>);
    }
}

Hendelse.propTypes = {
    erApen: PropTypes.bool,
    ledetekst: PropTypes.string,
    ledetekster: PropTypes.object,
    bilde: PropTypes.string,
    alt: PropTypes.string,
    type: PropTypes.string,
    setHendelseState: PropTypes.func,
    hoyde: PropTypes.string,
    visBudskap: PropTypes.bool,
    medAnimasjon: PropTypes.bool,
    hindreToggle: PropTypes.bool,
};

export default Hendelse;
