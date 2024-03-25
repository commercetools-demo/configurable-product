import { FieldArray } from 'formik';
import { useIntl } from 'react-intl';
import messages from './messages';
import { CategoryField } from '../category-field';

const CATEGORIES = 'categories';
const RowFormDynamicBundle = () => {
  const intl = useIntl();
  return (
    <FieldArray
      validateOnChange={false}
      name={CATEGORIES}
      render={({ push, remove }) => (
        <CategoryField
          name={CATEGORIES}
          title={intl.formatMessage(messages.bundleCategoriesTitle)}
          hint={intl.formatMessage(messages.bundleCategoriesDescription)}
          isRequired={true}
          push={push}
          remove={remove}
        />
      )}
    />
  );
};
export default RowFormDynamicBundle;
