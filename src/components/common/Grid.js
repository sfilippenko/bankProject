import React from 'react';
const gap = 10;

export default class Grid extends React.Component {

    defineMargin = (index) => {
        const {children, col = 2} = this.props;
        const length = children.length;
        const breakPoint = Math.floor(length / col) * col;
        const realCol = index < breakPoint ? col : length - breakPoint;
        if (realCol === 1) return {
            marginLeft: -gap,
            marginRight: -gap
        };
        index = index < breakPoint ? index : index - breakPoint;
        return {
            marginLeft: index % realCol === 0 ? -gap : 0,
            marginRight: (index + 1) % realCol === 0 ? -gap : 0
        }
    };

    render() {
        const {children, col = 2, style} = this.props;
        return(
            <div className='simpleGrid' style={style}>
                {
                    children.map((item, index) => {
                        const {marginLeft, marginRight} = this.defineMargin(index);
                        return (
                            <div key={index} style={{
                                minWidth: `${100/col}%`,
                                padding: `0 ${gap}px`,
                                marginLeft,
                                marginRight
                            }}>
                                {item}
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}