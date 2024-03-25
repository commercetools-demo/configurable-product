import { FormattedMessage, useIntl } from 'react-intl';
import get from 'lodash/get';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import FieldLabel from '@commercetools-uikit/field-label';
import NumberInput from '@commercetools-uikit/number-input';
import { PlusBoldIcon, CloseBoldIcon } from '@commercetools-uikit/icons';
import IconButton from '@commercetools-uikit/icon-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import messages from './messages';
import styles from './category-field.mod.css';
import { CategorySearchInput } from '../category-search-input';
import { useFormikContext } from 'formik';
import { Row } from '../row-form/row-form';
import React, { FC } from 'react';
import { FormikErrors, FormikTouched } from 'formik/dist/types';

export interface CategoryValue extends Record<string, unknown> {
  id?: string;
  name: string;
}

export interface CategoryEntry {
  category?: CategoryValue | null;
  minQuantity?: string;
  maxQuantity?: string;
  additionalCharge?: boolean;
}

const CATEGORY = 'category';
const FIELD_ADDITIONAL_CHARGE = 'additionalCharge';
const FIELD_MIN_QUANTITY = 'minQuantity';
const FIELD_MAX_QUANTITY = 'maxQuantity';

const hasError = (
  touched: Array<FormikTouched<CategoryEntry>> | undefined,
  errors:
    | string
    | Array<string>
    | Array<FormikErrors<CategoryEntry>>
    | undefined,
  index: number,
  field: string
) =>
  !!get(touched, `[${index}].${field}`) && !!get(errors, `[${index}].${field}`);

/*
 * Retrieve the unique (`uniq`), non-null (`compact`) errors for the inputs of each
 * value in the field based on the currently touched inputs.
 *
 * Example: The field contains two categories inputs without values. The category
 * inputs are required. If both have been touched, only one "required" error message
 * will be shown.
 */
// const getErrors = (
//   touched: Array<FormikTouched<CategoryEntry>> | undefined,
//   errors:
//     | string
//     | Array<string>
//     | Array<FormikErrors<CategoryEntry>>
//     | undefined
// ) =>
//   touched &&
//   errors &&
//   touched.reduce((errs, item, index) => {
//     const getError = (field) =>
//       item && item[field] ? get(errors, `[${index}].${field}`) : null;
//
//     return uniq([
//       ...errs,
//       ...compact([
//         getError(CATEGORY),
//         getError(FIELD_MIN_QUANTITY),
//         getError(FIELD_MAX_QUANTITY),
//       ]),
//     ]);
//   }, []);

interface CategoryFieldProps {
  name?: string;
  title?: string | React.ReactNode;
  hint?: string | React.ReactNode;
  isRequired?: boolean;
  showAdditionalCharge?: boolean;
  push(category: CategoryEntry): unknown;
  remove(index: number): unknown;
}
const CategoryField: FC<CategoryFieldProps> = ({
  name,
  hint,
  title,
  showAdditionalCharge,
  isRequired,
  push,
  remove,
}) => {
  const intl = useIntl();
  const formik = useFormikContext<Row>();
  // const fieldErrors = getErrors(formik.touched, formik.errors);

  return (
    <Spacings.Stack scale="s">
      <Spacings.Inline alignItems="center" justifyContent="space-between">
        <FieldLabel
          title={title}
          hint={hint}
          hasRequiredIndicator={isRequired}
        />
        <SecondaryButton
          data-testid={`add-category`}
          iconLeft={<PlusBoldIcon />}
          label={intl.formatMessage(messages.addCategoryLabel)}
          onClick={() =>
            push({
              category: null,
              minQuantity: '',
              maxQuantity: '',
              additionalCharge: false,
            })
          }
        />
      </Spacings.Inline>
      <Spacings.Stack scale="s">
        {formik.values.categories.map(
          ({ category, minQuantity, maxQuantity, additionalCharge }, index) => (
            <Spacings.Inline key={index} alignItems="center">
              <div className={styles['category-search']}>
                <CategorySearchInput
                  name={`${name}.${index}.${CATEGORY}`}
                  value={category}
                  placeholder={intl.formatMessage(messages.categoryPlaceholder)}
                  showProductCount
                  hasError={hasError(
                    formik.touched.categories,
                    formik.errors.categories,
                    index,
                    CATEGORY
                  )}
                />
              </div>
              <div className={styles['category-quantity']}>
                <NumberInput
                  name={`${name}.${index}.${FIELD_MIN_QUANTITY}`}
                  value={minQuantity || ''}
                  placeholder={intl.formatMessage(
                    messages.minQuantityPlaceholder
                  )}
                  hasError={hasError(
                    formik.touched.categories,
                    formik.errors.categories,
                    index,
                    FIELD_MIN_QUANTITY
                  )}
                  min={0}
                  step={1}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className={styles['category-quantity']}>
                <NumberInput
                  name={`${name}.${index}.${FIELD_MAX_QUANTITY}`}
                  value={maxQuantity || ''}
                  placeholder={intl.formatMessage(
                    messages.maxQuantityPlaceholder
                  )}
                  hasError={hasError(
                    formik.touched.categories,
                    formik.errors.categories,
                    index,
                    FIELD_MAX_QUANTITY
                  )}
                  min={0}
                  step={1}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {showAdditionalCharge && (
                <div className={styles['category-quantity']}>
                  <CheckboxInput
                    name={`${name}.${index}.${FIELD_ADDITIONAL_CHARGE}`}
                    value={JSON.stringify(additionalCharge)}
                    isChecked={additionalCharge}
                    onChange={formik.handleChange}
                  >
                    <FormattedMessage {...messages.additionalChargeLabel} />
                  </CheckboxInput>
                </div>
              )}
              <IconButton
                data-testid={`remove-category.${index}`}
                icon={<CloseBoldIcon />}
                label={intl.formatMessage(messages.addCategoryLabel)}
                isDisabled={formik.values.categories.length === 1}
                onClick={() => remove(index)}
              />
            </Spacings.Inline>
          )
        )}
        {/*{fieldErrors && (*/}
        {/*  <>*/}
        {/*    {fieldErrors.map((error, index) => (*/}
        {/*      <ErrorMessage key={index}>{error}</ErrorMessage>*/}
        {/*    ))}*/}
        {/*  </>*/}
        {/*)}*/}
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

CategoryField.displayName = 'CategoryField';
export default CategoryField;
