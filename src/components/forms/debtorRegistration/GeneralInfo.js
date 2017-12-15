import React from 'react';
import CombinedWrapper from '../../controlWrappers/CombinedWrapper';
import Grid from '../../common/Grid';
import {Button, Panel} from 'react-bootstrap';

export default class GeneralInfo extends React.Component {

    isSameAddrHandler = (path, val) => {
        const {eventFieldChange, data} = this.props;
        eventFieldChange(path, val);
        if (val) {
            eventFieldChange(['data', 'client', 'addresses', 'actualAddress'], data.getIn(['addresses', 'legalAddress']));
        }
    };

    render() {
        const {eventFieldChange, data, readonly, dictionaries} = this.props;
        return (
            <Panel>
                <Grid>
                    <CombinedWrapper
                        type='check'
                        path={['data', 'client', 'isResident']}
                        title='Резидент'
                        value={data.getIn(['isResident'])}
                        handler={eventFieldChange}
                        disabled={readonly}
                        labelTop={true}
                    />
                    <CombinedWrapper
                        type='select'
                        path={['data', 'client', 'regionalBranch']}
                        title='РФ'
                        value={data.getIn(['regionalBranch'])}
                        handler={eventFieldChange}
                        model={dictionaries.getIn(['ref_24'])}
                        readonly={readonly}
                        labelTop={true}
                    />
                    <CombinedWrapper
                        type='text'
                        path={['data', 'client', 'addresses', 'legalAddress']}
                        title='Юридический адрес'
                        value={data.getIn(['addresses', 'legalAddress'])}
                        handler={eventFieldChange}
                        readonly={readonly}
                        labelTop={true}
                    />
                    <CombinedWrapper
                        type='check'
                        path={['data', 'client', 'addresses', 'isSameAddr']}
                        title='Фактический адрес совпадает с юридическим'
                        value={data.getIn(['addresses', 'isSameAddr'])}
                        handler={this.isSameAddrHandler}
                        disabled={readonly}
                        labelTop={true}
                    />
                    <CombinedWrapper
                        type='text'
                        path={['data', 'client', 'addresses', 'actualAddress']}
                        title='Фактический адрес'
                        value={data.getIn(['addresses', 'actualAddress'])}
                        handler={eventFieldChange}
                        readonly={readonly || data.getIn(['addresses', 'isSameAddr'])}
                        labelTop={true}
                    />
                    <CombinedWrapper
                        type='select'
                        path={['data', 'client', 'opf']}
                        title='ОПФ'
                        value={data.getIn(['opf'])}
                        handler={eventFieldChange}
                        model={dictionaries.getIn(['ref_8'])}
                        readonly={readonly}
                        labelTop={true}
                    />
                    <CombinedWrapper
                        type='text'
                        title='Номер списка должников'
                        value={data.getIn(['clientCards', 0, 'numList'])}
                        readonly={true}
                        labelTop={true}
                    />
                    <CombinedWrapper
                        type='date'
                        title='Дата передачи в ДРПА'
                        value={data.getIn(['clientCards', 0, 'drpaDateYob'])}
                        readonly={true}
                        labelTop={true}
                    />
                    <CombinedWrapper
                        type='select'
                        path={['data', 'client', 'activityType']}
                        title='Вид деятельности'
                        value={data.getIn(['activityType'])}
                        handler={eventFieldChange}
                        model={dictionaries.getIn(['ref_9'])}
                        readonly={readonly}
                        labelTop={true}
                    />
                </Grid>
                <div style={{marginTop: 30, position: 'relative', width: 250}}>
                    <CombinedWrapper
                        type='mask'
                        title='УСА (руб.)'
                        maskType='elevenDigitTwoDecimal'
                        value={data.getIn(['clientCards', 0, 'usa'])}
                        readonly={true}
                    />
                    <Button
                        className='btn-sunYellow'
                        style={{position: 'absolute', bottom: 9, left: 260}}
                    >
                        Детализация
                    </Button>
                </div>
            </Panel>
        );
    }
}
