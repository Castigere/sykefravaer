import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'nav-frontend-skjema';
import { childEllerChildren, fieldPropTypes } from '../../propTypes';

const Box = ({ input, label, id, children }) => {
    return (<div className="checkboksContainer" id={`cb-${id}`}>
        <Checkbox
            id={id}
            label={label}
            checked={input.value} {...input} />
        {
            input.value === true && children && <div className="ekstrasporsmal">{children}</div>
        }
    </div>);
};

Checkbox.propTypes = {
    input: fieldPropTypes.input,
    label: PropTypes.string,
    id: PropTypes.string,
    children: childEllerChildren,
};

export default Box;
