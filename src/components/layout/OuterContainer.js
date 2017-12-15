import React from 'react';
import ReactDOM from 'react-dom';
import {slide as Menu} from 'react-burger-menu';
import Header from './Header';
import {Link} from 'react-router';

const styles = {
    bmBurgerButton: {
        // position: 'fixed',
        // width: 30,
        // height: 20,
        // left: 20,
        // top: 15,
        // zIndex: 10
    },
    bmBurgerBars: {
        background: 'white'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: 'white'
    },
    bmMenu: {
        background: 'rgb(43, 96, 48)',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em',
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#b8b7ad',
        padding: '0.8em'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)',
        top: 0,
        left: 0,
        zIndex: 7
    }
};

export default class OuterContainer extends React.Component {

    onClick = ({target}) => {
        if (target.tagName === 'A') this.refs.menu.setState({isOpen: false});
    };

    componentDidMount() {
        const btn = ReactDOM.findDOMNode(this).querySelector('.bm-burger-button');
        const wrap = document.getElementById('burger-button-wrapper');
        btn.parentNode.removeChild(btn);
        wrap.appendChild(btn);
    }

    render() {
        const {children, style, taskName = '', maxWidth = 1400} = this.props;
        return (
            <div id='outer-container'>
                <Menu
                    ref='menu'
                    pageWrapId='page-wrap'
                    outerContainerId='outer-container'
                    styles={styles}
                >
                    <ul className='nav nav-pills nav-stacked' onClick={this.onClick}>
                        <li><Link to='/'>Карточка должника</Link></li>
                        <li><Link to='/drawing'>Рисовалка</Link></li>
                    </ul>
                </Menu>
                <div id='page-wrap' style={{paddingTop: 50}}>
                    <Header taskName={taskName} maxWidth={maxWidth}/>
                    <div className='container-custom' style={{maxWidth, ...style}}>
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}