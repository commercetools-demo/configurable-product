import { TNumberFieldProps } from '@commercetools-uikit/number-field/dist/declarations/src/number-field';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { FormikErrors } from 'formik';
import TextInput from '@commercetools-uikit/text-input';
import omitEmpty from 'omit-empty-es';
import { Row } from './row-form';

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
  rangeMin: { quantity?: true; minGreaterThanMax?: true };
  rangeMax: { quantity?: true };
  categories: Array<TCategoryError | undefined>;
};

export const validate = (formikValues: Row): FormikErrors<Row> => {
  const errors: TErrors = {
    key: {},
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

  //categories validation
  if (formikValues.categories && Array.isArray(formikValues.categories)) {
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

  return {
    ...omitEmpty<FormikErrors<Row>, TErrors>(errors),
    // @ts-ignore
    categories: errors.categories,
  };

  // const validationSchema = object({
  //   categories: array(
  //     object({
  //       category: object({
  //         value: string(),
  //         label: string(),
  //       })
  //         .nullable()
  //         .required(intl.formatMessage(messages.missingRequiredField)),
  //       minQuantity: lazy((value) =>
  //         typeof value === 'number'
  //           ? number()
  //               .min(0, intl.formatMessage(messages.zeroQuantityError))
  //               .integer(intl.formatMessage(messages.integerError))
  //           : string()
  //       ),
  //       maxQuantity: lazy((value) =>
  //         typeof value === 'number'
  //           ? number()
  //               .min(0, intl.formatMessage(messages.zeroQuantityError))
  //               .integer(intl.formatMessage(messages.integerError))
  //               .when('minQuantity', {
  //                 is: (val: number | undefined) => {
  //                   return val;
  //                 },
  //                 then: (schema) =>
  //                   schema.moreThan(
  //                     ref('minQuantity'),
  //                     intl.formatMessage(messages.maxGreaterThanMinError)
  //                   ),
  //               })
  //           : string()
  //       ),
  //       additionalCharge: bool(),
  //     })
  //   ),
  // });
};
