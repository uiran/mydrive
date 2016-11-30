import moment from 'moment';
import numeral from 'numeral';

export class DateFormatValueConverter {
  toView(value, format) {
    return moment(value).format(format);
  }
}

export class ByteFormatValueConverter {
  toView(value) {
    return numeral(value).format('(0 b)');
  }
}