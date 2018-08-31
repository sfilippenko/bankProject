import React from 'react';
import ReactTooltip from 'react-tooltip';

export default class ReactTooltipWrapper extends React.Component {
    render() {
        const {id, tooltip, type = 'warning'} = this.props;
        return (
            <ReactTooltip
                id={id}
                type={type}
                effect='solid'
                place='bottom'
                delayShow={600}
            >
                <div style={{maxWidth: 600, whiteSpace: 'normal', overflow: 'visible'}}>{tooltip}</div>
            </ReactTooltip>
        )
    }
}