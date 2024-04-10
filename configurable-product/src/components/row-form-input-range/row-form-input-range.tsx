import { useFormikContext } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import messages from './messages';
import { FormattedMessage, useIntl } from 'react-intl';
import Spacings from '@commercetools-uikit/spacings';
import NumberField from '@commercetools-uikit/number-field';
import { Row } from '../row-form/row-form';
import LocalizedTextField from '@commercetools-uikit/localized-text-field';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import {
  renderRangeMaxError,
  renderRangeMinError,
  TErrors,
} from '../row-form/validation';

const RowFormInputRange = () => {
  const formik = useFormikContext<Row>();
  const intl = useIntl();
  const { dataLocale } = useCustomViewContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  return (
    <Spacings.Stack scale="xs">
      <FieldLabel
        title={<FormattedMessage {...messages.bundleQuantityTitle} />}
      />
      <Spacings.Inline scale="m">
        <NumberField
          title={intl.formatMessage(messages.bundleMinQuantityPlaceholder)}
          name={'rangeMin'}
          min={1}
          step={1}
          value={formik.values.rangeMin || ''}
          errors={NumberField.toFieldErrors<TErrors>(formik.errors).rangeMin}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          touched={formik.touched.rangeMin}
          renderError={renderRangeMinError}
        />
        <NumberField
          title={intl.formatMessage(messages.bundleMaxQuantityPlaceholder)}
          name={'rangeMax'}
          min={1}
          step={1}
          value={formik.values.rangeMax || ''}
          errors={NumberField.toFieldErrors<TErrors>(formik.errors).rangeMax}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          touched={formik.touched.rangeMax}
          renderError={renderRangeMaxError}
        />
        <LocalizedTextField
          name="unit"
          title={<FormattedMessage {...messages.unitTitle} />}
          value={formik.values.unit || {}}
          selectedLanguage={dataLocale}
          onBlur={formik.handleBlur}
          touched={formik.touched.unit}
          onChange={formik.handleChange}
          errors={LocalizedTextField.toFieldErrors<TErrors>(formik.errors).unit}
        />
      </Spacings.Inline>
    </Spacings.Stack>
  );
};
export default RowFormInputRange;
