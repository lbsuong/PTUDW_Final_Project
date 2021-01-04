const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');

module.exports = function(app) {
  app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    extname: 'hbs',
    layoutsDir: 'views/_layouts',
    partialsDir: 'views/_partials',
    helpers: {
      section: hbs_sections(),
      format_real_num(val) {
        return numeral(val).format('0,0.00');
      },

      format(val) {
        return numeral(val).format('0,0');
      },

      format_date(val) {
        let date = new Date(val);
        return (date.getMonth() + 1) + "/" + date.getFullYear();
      },

      split_line(val) {
        return val.split('\n');
      }
    }
  }));
  app.set('view engine', 'hbs');
}