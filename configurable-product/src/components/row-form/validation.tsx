import { TNumberFieldProps } from '@commercetools-uikit/number-field/dist/declarations/src/number-field';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { FormikErrors } from 'formik';
import TextInput from '@commercetools-uikit/text-input';
import omitEmpty from 'omit-empty-es';
import { Row } from './row-form';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';

export const renderRangeMinError: TNumberFieldProps['renderError'] = (key) => {
  switch (key) {
    case 'quantity':
      return <FormattedMessage {...messages.zeroQuantityError} />;
    case 'minGreaterThanMax':
      return <FormattedMessage {...messages.minGreaterThanMaxError} />;
    default:
      return null;
  }
};
export const renderRangeMaxError: TNumberFieldProps['renderError'] = (key) => {
  switch (key) {
    case 'quantity':
      return <FormattedMessage {...messages.quantityError} />;
    default:
      return null;
  }
};

export const renderCategoryError = (key: string) => {
  switch (key) {
    case 'minGreaterThanMax':
      return <FormattedMessage {...messages.minGreaterThanMaxError} />;
    case 'missing':
      return <FormattedMessage {...messages.missingRequiredField} />;
    default:
      return null;
  }
};

type TCategoryError = {
  category: { missing?: boolean };
  minQuantity: { quantity?: true; minGreaterThanMax?: true };
  maxQuantity: { quantity?: true };
};

export type TErrors = {
  key: { missing?: boolean; keyHint?: boolean };
  title: { missing?: boolean };
  rangeMin: { quantity?: true; minGreaterThanMax?: true };
  rangeMax: { quantity?: true };
  categories: Array<TCategoryError | undefined>;
};

export const validate = (formikValues: Row): FormikErrors<Row> => {
  const errors: TErrors = {
    key: {},
    title: {},
    rangeMin: {},
    rangeMax: {},
    categories: [],
  };

  //Key validation
  if (!formikValues.key || TextInput.isEmpty(formikValues.key)) {
    errors.key.missing = true;
  }
  if (
    formikValues.key &&
    (formikValues.key.length < 2 || formikValues.key.length > 256)
  ) {
    errors.key.keyHint = true;
  }

  if (!formikValues.title || LocalizedTextInput.isEmpty(formikValues.title)) {
    errors.title.missing = true;
  }

  //rangeMin Validation
  if (formikValues.rangeMin && formikValues.rangeMin < 1) {
    errors.rangeMin.quantity = true;
  }

  //rangeMax validation
  if (formikValues.rangeMax) {
    if (formikValues.rangeMax < 0) {
      errors.rangeMax.quantity = true;
    }
    if (
      formikValues.rangeMin &&
      formikValues.rangeMin > formikValues.rangeMax
    ) {
      errors.rangeMin.minGreaterThanMax = true;
    }
  }

  //categories validation only if type is dynamic-bundle
  if (
    formikValues.config.type === 'dynamic-bundle' &&
    formikValues.categories &&
    Array.isArray(formikValues.categories)
  ) {
    errors.categories = formikValues.categories.map((value) => {
      let error: TCategoryError = {
        category: {},
        minQuantity: {},
        maxQuantity: {},
      };
      if (!value.category || !value.category.id) {
        error.category.missing = true;
      }
      if (value.minQuantity && Number.parseInt(value.minQuantity) < 1) {
        error.minQuantity.quantity = true;
      }

      //rangeMax validation
      if (value.maxQuantity) {
        if (Number.parseInt(value.maxQuantity) < 0) {
          error.maxQuantity.quantity = true;
        }
        if (
          value.minQuantity &&
          Number.parseInt(value.minQuantity) >
            Number.parseInt(value.maxQuantity)
        ) {
          error.minQuantity.minGreaterThanMax = true;
        }
      }
      let cleanedError = omitEmpty<TCategoryError>(error);
      return Object.keys(cleanedError).length === 0 ? undefined : cleanedError;
    });
  }

  let result = omitEmpty<FormikErrors<Row>, TErrors>(errors);
  if (errors.categories.length > 0) {
    result = {
      ...result,
      // @ts-ignore
      categories: errors.categories,
    };
  }
  return result;
};
