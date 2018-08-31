import {fromJS} from 'immutable';
import commonReducer from './commonReducer';
const initialState = fromJS({
    'references': {
        'ref_32': [{'internalId': 1, 'name': 'Заемщик', 'externalId': null}, {
            'internalId': 2,
            'name': 'Залогодатель',
            'externalId': null
        }, {'internalId': 3, 'name': 'Поручитель', 'externalId': null}, {
            'internalId': 4,
            'name': 'Гарант',
            'externalId': null
        }, {
            'internalId': 5,
            'name': 'Лица, аффилированные с заёмщиками Банка, имеющие договоры с Банком',
            'externalId': null
        }, {
            'internalId': 6,
            'name': 'Лица, аффилированные с заёмщиками Банка, не имеющие договоры с Банком',
            'externalId': null
        }, {'internalId': 7, 'name': 'Собственники/Бенефициары', 'externalId': null}, {
            'internalId': 8,
            'name': 'Топ-менеджеры',
            'externalId': null
        }, {'internalId': 9, 'name': 'Ответственные лица', 'externalId': null}, {
            'internalId': 10,
            'name': 'Бенефициар',
            'externalId': null
        }, {'internalId': 11, 'name': 'Контролирующее лицо', 'externalId': null}]
    },
    'data': {
        'gsz': {
            'editedConnectionList': [{
                'id': '13a15842-3be6-4ddf-a538-61d4a1ff0a39',
                'version': 1,
                'fromClientId': '0426ae33-82c6-477a-b8a2-4b2347fb172e',
                'toClientId': 'bc913817-330e-4c11-8301-46fdde8155af',
                'attributeList': [{
                    'id': '3e3af7e2-f27b-44fe-bd57-9f88e4ade9be',
                    'version': 1,
                    'name': 'timestamp',
                    'value': '1535724913914'
                }],
                'roleId': 10,
                'title': null
            }, {
                'id': '39d969a0-0732-4ba9-bcb1-d65654773553',
                'version': 1,
                'fromClientId': '17f836b7-cab7-4148-a53c-32a28b44a4b4',
                'toClientId': '773274bb-17bb-4340-a1bc-39ed8abce3de',
                'attributeList': [{
                    'id': '9081a546-eb90-463e-bc0e-836fdf8d9265',
                    'version': 1,
                    'name': 'timestamp',
                    'value': '1535724921578'
                }],
                'roleId': 10,
                'title': null
            }],
            'clientIdentityList': [{
                'idEbpz': null,
                'idCrm': null,
                'clientType': 2,
                'idCif': null,
                'omUser': null,
                'inn': '2128690649',
                'visualProperties': {'position': {'x': 240, 'y': 15}, 'zIndex': 0},
                'personIdentity': null,
                'cmUser': null,
                'legalIdentity': {
                    'id': 'd82f7071-0305-46b9-9a44-8c2c72fd3850',
                    'version': 1,
                    'shortName': null,
                    'fullName': 'Детский мир',
                    'kpp': '771701001',
                    'ogrn': '7412039002675',
                    'opfId': null,
                    'activityTypeId': null
                },
                'version': 2,
                'id': 'bc913817-330e-4c11-8301-46fdde8155af',
                'branchId': null,
                'absCodeList': null
            }, {
                'idEbpz': null,
                'idCrm': null,
                'clientType': 3,
                'idCif': null,
                'omUser': null,
                'inn': '540571462922',
                'visualProperties': {'position': {'x': 880, 'y': 90}, 'zIndex': 20},
                'personIdentity': {
                    'lastName': 'Ламов',
                    'birthPlace': null,
                    'birthDate': 746913600000,
                    'marriageStatusId': null,
                    'version': 1,
                    'identityDoc': null,
                    'id': '54560b97-b78b-4568-bc62-a327c2ffd660',
                    'firstName': 'Алексей',
                    'nationality': null,
                    'genderId': null,
                    'secondName': 'Петрович'
                },
                'cmUser': null,
                'legalIdentity': null,
                'version': 2,
                'id': '770566b3-1032-45cd-a9a3-cc4b6ed65a57',
                'branchId': null,
                'absCodeList': null
            }, {
                'idEbpz': null,
                'idCrm': null,
                'clientType': 1,
                'idCif': null,
                'omUser': null,
                'inn': '5405714569',
                'visualProperties': {'position': {'x': 435, 'y': 345}, 'zIndex': 21},
                'personIdentity': null,
                'cmUser': null,
                'legalIdentity': {
                    'id': 'aed83c02-67e8-4550-a72a-057400ac81ac',
                    'version': 1,
                    'shortName': null,
                    'fullName': 'Взрослый мир',
                    'kpp': '771701001',
                    'ogrn': '8963201482682',
                    'opfId': null,
                    'activityTypeId': null
                },
                'version': 3,
                'id': 'ad685eeb-4e75-4ff0-a89f-900e135f53f9',
                'branchId': 1,
                'absCodeList': null
            }, {
                'idEbpz': null,
                'idCrm': null,
                'clientType': null,
                'idCif': null,
                'omUser': null,
                'inn': '222222222222',
                'visualProperties': {
                    'roleId': 10,
                    'timestamp': '1535724921578',
                    'position': {'x': 130, 'y': 585},
                    'zIndex': 22
                },
                'personIdentity': null,
                'cmUser': null,
                'legalIdentity': {
                    'id': 'f435c2b3-6988-4392-8791-d92516bbea35',
                    'version': 1,
                    'shortName': null,
                    'fullName': 'Бенефициар-2',
                    'kpp': null,
                    'ogrn': null,
                    'opfId': null,
                    'activityTypeId': null
                },
                'version': 1,
                'id': '17f836b7-cab7-4148-a53c-32a28b44a4b4',
                'branchId': null,
                'absCodeList': null
            }, {
                'idEbpz': null,
                'idCrm': null,
                'clientType': null,
                'idCif': null,
                'omUser': null,
                'inn': '111111111111',
                'visualProperties': {
                    'roleId': 10,
                    'timestamp': '1535724913914',
                    'position': {'x': 55, 'y': 315},
                    'zIndex': 18
                },
                'personIdentity': null,
                'cmUser': null,
                'legalIdentity': {
                    'id': '72cc6a03-99ac-42fe-b59f-be92bf5e372e',
                    'version': 1,
                    'shortName': null,
                    'fullName': 'Бенефициар-1',
                    'kpp': null,
                    'ogrn': null,
                    'opfId': null,
                    'activityTypeId': null
                },
                'version': 1,
                'id': '0426ae33-82c6-477a-b8a2-4b2347fb172e',
                'branchId': null,
                'absCodeList': null
            }, {
                'idEbpz': null,
                'idCrm': null,
                'clientType': 1,
                'idCif': null,
                'omUser': null,
                'inn': '5602714629',
                'visualProperties': {'position': {'x': 720, 'y': 625}, 'zIndex': 19},
                'personIdentity': null,
                'cmUser': null,
                'legalIdentity': {
                    'id': '584fbfd5-67ca-4a96-a05f-e0a6dcb84f5d',
                    'version': 1,
                    'shortName': null,
                    'fullName': 'Новый мир',
                    'kpp': '771701001',
                    'ogrn': '2465217898643',
                    'opfId': null,
                    'activityTypeId': null
                },
                'version': 2,
                'id': '773274bb-17bb-4340-a1bc-39ed8abce3de',
                'branchId': null,
                'absCodeList': null
            }],
            'name': '31.08.2018-fil-5',
            'code': '11200',
            'segmentId': 2,
            'createdDate': 1355317891011,
            'version': 2,
            'id': '485f7a68-c2bb-4dac-9a16-aef25c8d46f8',
            'readonlyConnectionList': [{
                'id': null,
                'version': 1,
                'fromClientId': 'ad685eeb-4e75-4ff0-a89f-900e135f53f9',
                'toClientId': null,
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '5405714569'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': null
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Взрослый мир'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractId',
                    'value': 'a1ff41ab-59bb-4538-9cbf-f3c3395f51e3'
                }, {'id': null, 'version': 1, 'name': 'loanContractNum', 'value': '123'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractMainDebt',
                    'value': '30.0'
                }, {'id': null, 'version': 1, 'name': 'loanContractGeneralReserve', 'value': '170.0'}, {
                    'id': null,
                    'version': 1,
                    'name': 'branchId',
                    'value': '1'
                }],
                'roleId': 1,
                'title': null
            }, {
                'id': null,
                'version': 1,
                'fromClientId': 'bc913817-330e-4c11-8301-46fdde8155af',
                'toClientId': null,
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '2128690649'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': null
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Детский мир'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractId',
                    'value': 'e8f69c53-6ea9-4a9b-97a5-2f7dc16c6450'
                }, {'id': null, 'version': 1, 'name': 'loanContractNum', 'value': '435'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractMainDebt',
                    'value': '456.0'
                }, {'id': null, 'version': 1, 'name': 'loanContractGeneralReserve', 'value': '0.0'}],
                'roleId': 1,
                'title': null
            }, {
                'id': null,
                'version': 1,
                'fromClientId': 'bc913817-330e-4c11-8301-46fdde8155af',
                'toClientId': 'bc913817-330e-4c11-8301-46fdde8155af',
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '2128690649'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': null
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Детский мир'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractId',
                    'value': 'e8f69c53-6ea9-4a9b-97a5-2f7dc16c6450'
                }, {'id': null, 'version': 1, 'name': 'loanContractNum', 'value': '435'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractMainDebt',
                    'value': '456.0'
                }, {'id': null, 'version': 1, 'name': 'loanContractGeneralReserve', 'value': '0.0'}, {
                    'id': null,
                    'version': 1,
                    'name': 'guarantorContractNum',
                    'value': '456'
                }],
                'roleId': 3,
                'title': null
            }, {
                'id': null,
                'version': 1,
                'fromClientId': '770566b3-1032-45cd-a9a3-cc4b6ed65a57',
                'toClientId': 'ad685eeb-4e75-4ff0-a89f-900e135f53f9',
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '540571462922'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': 'Ламов А. П.'
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Ламов Алексей Петрович'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractId',
                    'value': 'a1ff41ab-59bb-4538-9cbf-f3c3395f51e3'
                }, {'id': null, 'version': 1, 'name': 'loanContractNum', 'value': '123'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractMainDebt',
                    'value': '30.0'
                }, {'id': null, 'version': 1, 'name': 'loanContractGeneralReserve', 'value': '170.0'}, {
                    'id': null,
                    'version': 1,
                    'name': 'guarantorContractNum',
                    'value': '123-1'
                }],
                'roleId': 3,
                'title': null
            }, {
                'id': null,
                'version': 1,
                'fromClientId': 'ad685eeb-4e75-4ff0-a89f-900e135f53f9',
                'toClientId': null,
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '5405714569'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': null
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Взрослый мир'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractId',
                    'value': '09c2cfab-f386-470c-ab99-c736acc774c6'
                }, {'id': null, 'version': 1, 'name': 'loanContractNum', 'value': '125'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractMainDebt',
                    'value': '300.0'
                }, {'id': null, 'version': 1, 'name': 'loanContractGeneralReserve', 'value': '1700.0'}, {
                    'id': null,
                    'version': 1,
                    'name': 'branchId',
                    'value': '1'
                }],
                'roleId': 1,
                'title': null
            }, {
                'id': null,
                'version': 1,
                'fromClientId': '770566b3-1032-45cd-a9a3-cc4b6ed65a57',
                'toClientId': 'ad685eeb-4e75-4ff0-a89f-900e135f53f9',
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '540571462922'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': 'Ламов А. П.'
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Ламов Алексей Петрович'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractId',
                    'value': '09c2cfab-f386-470c-ab99-c736acc774c6'
                }, {'id': null, 'version': 1, 'name': 'loanContractNum', 'value': '125'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractMainDebt',
                    'value': '300.0'
                }, {'id': null, 'version': 1, 'name': 'loanContractGeneralReserve', 'value': '1700.0'}, {
                    'id': null,
                    'version': 1,
                    'name': 'guarantorContractNum',
                    'value': '125-1'
                }],
                'roleId': 2,
                'title': null
            }, {
                'id': null,
                'version': 1,
                'fromClientId': 'ad685eeb-4e75-4ff0-a89f-900e135f53f9',
                'toClientId': null,
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '5405714569'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': null
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Взрослый мир'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractId',
                    'value': '9f9c3426-9ccb-4935-842a-09d649e6ece3'
                }, {'id': null, 'version': 1, 'name': 'loanContractNum', 'value': '124'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractMainDebt',
                    'value': '34.0'
                }, {'id': null, 'version': 1, 'name': 'loanContractGeneralReserve', 'value': '174.0'}, {
                    'id': null,
                    'version': 1,
                    'name': 'branchId',
                    'value': '1'
                }],
                'roleId': 1,
                'title': null
            }, {
                'id': null,
                'version': 1,
                'fromClientId': 'bc913817-330e-4c11-8301-46fdde8155af',
                'toClientId': 'ad685eeb-4e75-4ff0-a89f-900e135f53f9',
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '2128690649'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': null
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Детский мир'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractId',
                    'value': '9f9c3426-9ccb-4935-842a-09d649e6ece3'
                }, {'id': null, 'version': 1, 'name': 'loanContractNum', 'value': '124'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractMainDebt',
                    'value': '34.0'
                }, {'id': null, 'version': 1, 'name': 'loanContractGeneralReserve', 'value': '174.0'}, {
                    'id': null,
                    'version': 1,
                    'name': 'guarantorContractNum',
                    'value': '124-1'
                }],
                'roleId': 2,
                'title': null
            }, {
                'id': null,
                'version': 1,
                'fromClientId': '773274bb-17bb-4340-a1bc-39ed8abce3de',
                'toClientId': 'ad685eeb-4e75-4ff0-a89f-900e135f53f9',
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '5602714629'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': null
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Новый мир'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractId',
                    'value': '9f9c3426-9ccb-4935-842a-09d649e6ece3'
                }, {'id': null, 'version': 1, 'name': 'loanContractNum', 'value': '124'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractMainDebt',
                    'value': '34.0'
                }, {'id': null, 'version': 1, 'name': 'loanContractGeneralReserve', 'value': '174.0'}, {
                    'id': null,
                    'version': 1,
                    'name': 'guarantorContractNum',
                    'value': '124-2'
                }],
                'roleId': 4,
                'title': null
            }, {
                'id': null,
                'version': 1,
                'fromClientId': '17f836b7-cab7-4148-a53c-32a28b44a4b4',
                'toClientId': null,
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '222222222222'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': null
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Бенефициар-2'}],
                'roleId': null,
                'title': null
            }, {
                'id': null,
                'version': 1,
                'fromClientId': '773274bb-17bb-4340-a1bc-39ed8abce3de',
                'toClientId': null,
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '5602714629'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': null
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Новый мир'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractId',
                    'value': '3cac7227-c73e-4449-a234-98d309e2ffe4'
                }, {'id': null, 'version': 1, 'name': 'loanContractNum', 'value': 'ааа'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractMainDebt',
                    'value': '501.0'
                }, {'id': null, 'version': 1, 'name': 'loanContractGeneralReserve', 'value': '0.0'}],
                'roleId': 1,
                'title': null
            }, {
                'id': null,
                'version': 1,
                'fromClientId': 'ad685eeb-4e75-4ff0-a89f-900e135f53f9',
                'toClientId': '773274bb-17bb-4340-a1bc-39ed8abce3de',
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '5405714569'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': null
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Взрослый мир'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractId',
                    'value': '3cac7227-c73e-4449-a234-98d309e2ffe4'
                }, {'id': null, 'version': 1, 'name': 'loanContractNum', 'value': 'ааа'}, {
                    'id': null,
                    'version': 1,
                    'name': 'loanContractMainDebt',
                    'value': '501.0'
                }, {'id': null, 'version': 1, 'name': 'loanContractGeneralReserve', 'value': '0.0'}, {
                    'id': null,
                    'version': 1,
                    'name': 'branchId',
                    'value': '1'
                }, {'id': null, 'version': 1, 'name': 'guarantorContractNum', 'value': '456па'}],
                'roleId': 4,
                'title': null
            }, {
                'id': null,
                'version': 1,
                'fromClientId': '0426ae33-82c6-477a-b8a2-4b2347fb172e',
                'toClientId': null,
                'attributeList': [{'id': null, 'version': 1, 'name': 'inn', 'value': '111111111111'}, {
                    'id': null,
                    'version': 1,
                    'name': 'clientShortName',
                    'value': null
                }, {'id': null, 'version': 1, 'name': 'clientFullName', 'value': 'Бенефициар-1'}],
                'roleId': null,
                'title': null
            }]
        }
    },
    intermediateState: {
        zIndex: 8,
        startDraw: null,
        canvasContext: null,
        viewPort: 1000,
        drawLayout: false,
        canvasCursor: 'default',
        focusCard: null,
        focusLine: null,
        focusLinePath: null
    }
});

export default function drawing(state = initialState, action) {
    switch (action.type) {
        default:
            return commonReducer('drawing', state, action, initialState);
    }
}