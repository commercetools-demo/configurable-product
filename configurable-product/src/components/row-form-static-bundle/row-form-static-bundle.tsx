import { FieldArray } from 'formik';
import ProductField from '../product-field/product-field';
import { useIntl } from 'react-intl';
import messages from './messages';

const PRODUCTS = 'products';
const RowFormStaticBundle = () => {
  const intl = useIntl();
  return (
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
  );
};
export default RowFormStaticBundle;
