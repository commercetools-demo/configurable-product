import { FieldArray, useFormikContext } from 'formik';
import ProductField from '../product-field/product-field';
import { FormattedMessage, useIntl } from 'react-intl';
import messages from './messages';
import NumberField from '@commercetools-uikit/number-field';
import { Row } from '../row-form/row-form';
import FieldLabel from '@commercetools-uikit/field-label';
import Spacings from '@commercetools-uikit/spacings';
import {
  renderRangeMaxError,
  renderRangeMinError,
  TErrors,
} from '../row-form/validation';

const PRODUCTS = 'products';
const RowFormRangeBundle = () => {
  const formik = useFormikContext<Row>();
  const intl = useIntl();
  return (
    <>
      <Spacings.Stack scale="xs">
        <FieldLabel
          title={<FormattedMessage {...messages.bundleQuantityTitle} />}
        />
        <Spacings.Inline scale="m">
          <NumberField
            title={intl.formatMessage(messages.bundleMinQuantityPlaceholder)}
            name={'rangeMin'}
            min={0}
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
        </Spacings.Inline>
      </Spacings.Stack>
      <FieldArray
        validateOnChange={false}
        name={PRODUCTS}
        render={({ push, remove }) => (
          <ProductField
            name={PRODUCTS}
            title={intl.formatMessage(messages.bundleProductsTitle)}
            hint={intl.formatMessage(messages.bundleProductsDescription)}
            isRequired={true}
            push={push}
            remove={remove}
          />
        )}
      />
    </>
  );
};
export default RowFormRangeBundle;
