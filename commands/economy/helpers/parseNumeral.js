const numeral = require('numeral');

numeral.register('locale', 'cl', {
	delimiters: {
		thousands: '.',
		decimal: ','
	},
	abbreviations: {
		thousand: 'k',
		million: 'M',
		billion: 'B',
		trillion: 'T'
	},
	currency: {
		symbol: '$'
	}
});


/**
 * @param {Number} number Número para formatear
 * @example 13040 => 13.040
 * @example 3994192.04 => 3.994.192,02
 * @example null|undefined|'' => null
 */
const parseNumeral = (number) => {

	numeral.locale('cl');
	number ? numeral(number).format('0,0') : null
}

module.exports = {
	parseNumeral
}