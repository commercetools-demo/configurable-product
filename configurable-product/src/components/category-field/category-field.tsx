import { FormattedMessage, useIntl } from 'react-intl';
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
import uniq from 'lodash/uniq';
import { ErrorMessage } from '@commercetools-uikit/messages';
import { renderCategoryError } from '../row-form/validation';
import { notEmpty } from '../../helpers';

export interface CategoryValue extends Record<string, unknown> {
  id?: string;
  name: string;
}

export type CategoryEntry = {
  category?: CategoryValue | null;
  minQuantity?: string;
  maxQuantity?: string;
  additionalCharge?: boolean;
};

const CATEGORY = 'category';
const FIELD_ADDITIONAL_CHARGE = 'additionalCharge';
const FIELD_MIN_QUANTITY = 'minQuantity';
const FIELD_MAX_QUANTITY = 'maxQuantity';

const getError = (
  errors:
    | string
    | Array<string>
    | Array<FormikErrors<CategoryEntry>>
    | undefined,
  field: keyof CategoryEntry,
  item: FormikTouched<CategoryEntry>,
  index: number
): { [key: string]: boolean } =>
  // @ts-ignore
  item && item[field]
    ? (errors as Array<FormikErrors<CategoryEntry>>)?.[index]?.[field]
    : null;

const hasError = (
  touched: Array<FormikTouched<CategoryEntry>> | undefined,
  errors:
    | string
    | Array<string>
    | Array<FormikErrors<CategoryEntry>>
    | undefined,
  index: number,
  field: keyof CategoryEntry
) => {
  return (
    !!touched?.[index]?.[field] &&
    Array.isArray(errors) &&
    !!(errors as Array<FormikErrors<CategoryEntry>>)?.[index]?.[field]
  );
};

/*
 * Retrieve the unique (`uniq`), non-null (`compact`) errors for the inputs of each
 * value in the field based on the currently touched inputs.
 *
 * Example: The field contains two categories inputs without values. The category
 * inputs are required. If both have been touched, only one "required" error message
 * will be shown.
 */
const getErrors = (
  touched: Array<FormikTouched<CategoryEntry>> | undefined,
  errors:
    | string
    | Array<string>
    | Array<FormikErrors<CategoryEntry>>
    | undefined
) => {
  let result: Array<{ [key: string]: boolean }> = [];
  if (touched && errors) {
    result = touched.reduce<Array<{ [key: string]: boolean }>>(
      (errs, item, index) => {
        let array: Array<{ [key: string]: boolean }> = [
          getError(errors, CATEGORY, item, index),
          getError(errors, FIELD_MIN_QUANTITY, item, index),
          getError(errors, FIELD_MAX_QUANTITY, item, index),
        ].filter(notEmpty);
        return uniq([...errs, ...array]);
      },
      []
    );
  }
  return result;
};

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
  const fieldErrors = getErrors(
    formik.touched.categories,
    formik.errors.categories
  );

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
        {fieldErrors && (
          <>
            {fieldErrors.map((error, index) => {
              return (
                <ErrorMessage key={index}>
                  {renderCategoryError(Object.keys(error)[0])}
                </ErrorMessage>
              );
            })}
          </>
        )}
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

CategoryField.displayName = 'CategoryField';
export default CategoryField;
