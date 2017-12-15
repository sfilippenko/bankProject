import React from 'react';
import {Modal} from 'react-bootstrap';

export default class ModalCustom extends React.Component {
    render() {
        const {header, data, show, onHide} = this.props;
        return(
            <Modal
                bsSize='lg'
                show={show}
                keyboard={true}
                onHide={onHide}
            >
                {
                    header &&
                    <Modal.Header>{header}</Modal.Header>
                }
                <Modal.Body>
                    <div style={{maxHeight: 600, overflow: 'auto'}}>{data}</div>
                </Modal.Body>
            </Modal>
        );
    }
}