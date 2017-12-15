import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';

export default class TabWrapper extends React.Component {
    render() {
        const {data, stepIndex, onChangeStep, completed} = this.props;
        return(
            <Tabs
                animation={false}
                defaultActiveKey={2}
                id='tabWrapper'
                activeKey={stepIndex}
                onSelect={onChangeStep}
                mountOnEnter={true}
                unmountOnExit={true}
                style={{background: 'white'}}
            >
                {
                    data.map(({title, component}, index) => {
                        return(
                            <Tab
                                style={{padding: 15}}
                                key={index}
                                eventKey={index}
                                title={title}
                                disabled={index > completed}
                            >
                                {component}
                            </Tab>
                        );
                    })
                }
            </Tabs>
        )
    }
}