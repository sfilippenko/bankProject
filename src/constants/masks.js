'use strict';

import _times from 'lodash/times'

/**
 *
 * @param intDigits {number} количество цифр до запятой
 * @param decimalDigits {number} количество цифр после запятой
 * return {function} функция маски
 */
const maskFunctionRound = (intDigits, decimalDigits) => (rawValue) => {
    let arr = [];
    let str = rawValue.replace(/_/g, '');
    str = str.replace(/ /g, '');

    let separatorSymbol = '.';
    const isSeparator = /[,.]/.test(str);
    if (isSeparator) {
        if (/,/.test(str)) separatorSymbol = ',';
    }
    if (isSeparator) {
        if (str[0] === '0') {
            arr = [/0/, /[,.]/, ..._times(decimalDigits, () => /\d/)];
        } else {
            let wholeLength = intDigits + decimalDigits + 1;
            for (let i = 0; i < (str.length < wholeLength ? str.length : wholeLength); i++) {
                if (i === str.indexOf(separatorSymbol) && i !== 0) arr.push(/[,.]/);
                else if (i < str.indexOf(separatorSymbol) + decimalDigits + 1) arr.push(/\d/);
            }
        }
    } else {
        if (str[0] === '0') {
            arr = [/0/, /[,.]/];
        } else {
            for (let i = 0; i < (str.length < intDigits ? str.length : intDigits); i++) {
                arr.push(/\d/);
            }
        }

    }
    if (str.length > 3) {
        let strNoSeparator = str;
        if (isSeparator) strNoSeparator = str.slice(0, str.indexOf(separatorSymbol));
        for (let i = 0; i < Math.floor((strNoSeparator.length-1)/3); i++) {
            const length = strNoSeparator.length;
            let shift = 0;
            if (length % 3 === 0) {
                shift = 3*(i+1) + i;
            } else {
                shift = length % 3 + 3*i + i
            }
            if (shift > 0 ) arr.splice(shift, 0, ' ');

        }
    }
    return arr;
};

export const nineDigit = {
    mask: _times(9, () => /\d/),
    ph: 'Введите 9 цифр максимум'
};

export const tenDigit = {
    mask: _times(10, () => /\d/),
    ph: 'Введите 10 цифр максимум'
};

export const thirteenDigit = {
    mask: _times(13, () => /\d/),
    ph: 'Введите 13 цифр максимум'
};

export const elevenDigitTwoDecimal = {
    mask: maskFunctionRound(11, 2),
    ph: '11 цифр максимум, до 2-х цифр после запятой'
};

export const nineDigitTwoDecimal = {
    mask: maskFunctionRound(9, 2),
    ph: '9 цифр максимум, до 2-х цифр после запятой'
};

export const twoDigitTwoDecimal = {
    mask: maskFunctionRound(2, 2),
    ph: '2 цифры максимум, до 2-х цифр после запятой'
};

export const fourDigitOneDecimal = {
    mask: maskFunctionRound(4, 1),
    ph: '4 цифры максимум, до 1-ой цифры после запятой'
};

export const regOrder = {
    mask: [/[1-9]/, ..._times(5, () => /\d/)],
    ph: 'Введите порядковый номер'
};