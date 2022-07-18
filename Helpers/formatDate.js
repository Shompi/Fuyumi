const { format } = require('date-format-parse');

/**
* @param {Date?} date
*/
module.exports.FormatDate = (date) => {
  if (!date) return "DD-MM-YY";

  return format(date, "DD-MM-YYYY HH:mm:ss", {
    locale: {
      months: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      // MMM
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      // dddd
      weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      // ddd
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb'],
      // dd
      weekdaysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      // [A a] format the ampm. The following is the default value
      meridiem: (h, m, isLowercase) => {
        const word = h < 12 ? 'AM' : 'PM';
        return isLowercase ? word.toLocaleLowerCase() : word;
      },
      // [A a] used by parse to match the ampm. The following is the default value
      meridiemParse: /[ap]\.?m?\.?/i,
      // [A a] used by parse to determine if the matching string is pm. The following is the default value
      isPM: (input) => {
        return (input + '').toLowerCase().charAt(0) === 'p';
      }
    }
  })
}