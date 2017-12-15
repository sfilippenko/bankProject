import React from 'react';
import {Button} from 'react-bootstrap';

export default class Header extends React.Component {

    render() {
        const {maxWidth, taskName} = this.props;
        return (
            <div className='header-custom'>
                <div className='container-custom' style={{maxWidth}}>
                    <div className='pull-left header-custom__taskName'>
                        <div id='burger-button-wrapper' style={{width: 30, height: 20, marginTop: 15, position: 'relative', float: 'left'}}></div>
                        <span style={{marginLeft: 10}}>{taskName}</span>
                    </div>
                    <div className='clearfix'/>
                </div>
            </div>
        );
    }
}