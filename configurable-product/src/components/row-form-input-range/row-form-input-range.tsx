import { useFormikContext } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import messages from './messages';
import { FormattedMessage, useIntl } from 'react-intl';
import Spacings from '@commercetools-uikit/spacings';
import NumberField from '@commercetools-uikit/number-field';
import { Row, TErrors } from '../row-form/row-form';
import LocalizedTextField from '@commercetools-uikit/localized-text-field';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import { ErrorMessage } from '@commercetools-uikit/messages';

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
          value={formik.values.rangeMin || 1}
          errors={NumberField.toFieldErrors<TErrors>(formik.errors).rangeMin}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <NumberField
          title={intl.formatMessage(messages.bundleMaxQuantityPlaceholder)}
          name={'rangeMax'}
          min={1}
          step={1}
          value={formik.values.rangeMax || 1}
          errors={NumberField.toFieldErrors<TErrors>(formik.errors).rangeMax}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <LocalizedTextField
          name="unit"
          title={<FormattedMessage {...messages.unitTitle} />}
          value={formik.values.unit || {}}
          selectedLanguage={dataLocale}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
      </Spacings.Inline>
      {formik.errors.rangeMin && (
        <ErrorMessage>{formik.errors.rangeMin || ''}</ErrorMessage>
      )}
      {formik.errors.rangeMax && (
        <ErrorMessage>{formik.errors.rangeMax}</ErrorMessage>
      )}
    </Spacings.Stack>
  );
};
export default RowFormInputRange;
