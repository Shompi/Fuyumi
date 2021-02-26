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

numeral.locale('cl');

module.exports = {
	numeral
}