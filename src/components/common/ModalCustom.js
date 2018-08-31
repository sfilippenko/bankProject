import React from 'react';
import {Modal} from 'react-bootstrap';

export default class ModalCustom extends React.Component {
    render() {
        const {header, data, show, onHide, bsSize = 'lg', dialogClassName = '', id} = this.props;
        return(
            <Modal
                id={id}
                bsSize={bsSize}
                show={show}
                keyboard={true}
                onHide={onHide}
                dialogClassName={dialogClassName}
            >
                {
                    header &&
                    <Modal.Header closeButton><h4 style={{margin: 0}}>{header}</h4></Modal.Header>
                }
                <Modal.Body>
                    <div id='modal-body-content' style={{maxHeight: window.innerHeight - 150, overflowY: 'auto', overflowX: 'hidden'}}>{data}</div>
                </Modal.Body>
            </Modal>
        );
    }
}