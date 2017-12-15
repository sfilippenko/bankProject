import React from 'react';
import {Button} from 'react-bootstrap';

export default class Footer extends React.Component {

    render() {
        const {btns = [], maxWidth = 1400} = this.props;
        return (
            <div className='footer'>
                <div className='container-custom' style={{lineHeight: '58px', maxWidth}}>
                    {
                        btns.map(({className = '', text, onClick, visible = true}, index) => {
                            if (visible) return (
                                <Button
                                    key={index}
                                    className={className}
                                    onClick={onClick}
                                    bsSize='lg'
                                    style={{marginRight: 10}}
                                >
                                    {text}
                                </Button>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}