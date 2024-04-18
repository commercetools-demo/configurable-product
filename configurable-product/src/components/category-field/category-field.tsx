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
import { ErrorMessage } from '@commercetools-uikit/messages';
import { renderCategoryError, TCategoryErrors } from '../row-form/validation';
import { notEmpty } from '../../helpers';

export interface CategoryValue extends Record<string, unknown> {
  id?: string;
  name: string;
  key?: string | null;
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

const toFieldErrors = (
  errors: string | string[] | FormikErrors<CategoryEntry>[] | undefined
) => {
  return errors as TCategoryErrors | undefined;
};
const getError = (
  errors: TCategoryErrors | undefined,
  field: keyof CategoryEntry,
  item: FormikTouched<CategoryEntry>,
  index: number
): { [key: string]: boolean } | undefined => {
  return item && item[field] ? errors?.[index]?.[field] : undefined;
};

const hasError = (
  touched: Array<FormikTouched<CategoryEntry>> | undefined,
  errors: TCategoryErrors | undefined,
  index: number,
  field: keyof CategoryEntry
): boolean => {
  if (touched?.[index] && Object.keys(touched?.[index]).indexOf(field) >= 0) {
    const isTouched = Object.values(touched?.[index])[
      Object.keys(touched?.[index]).indexOf(field)
    ];
    if (isTouched && errors?.[index]?.[field]) {
      return true;
    }
  }
  return false;
};

const getErrors = (
  touched: Array<FormikTouched<CategoryEntry>> | undefined,
  errors: TCategoryErrors | undefined
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
        return [...errs, ...array];
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
  const categoryErrors = toFieldErrors(formik.errors.categories);
  const fieldErrors = getErrors(formik.touched.categories, categoryErrors);

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
                    categoryErrors,
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
                    categoryErrors,
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
                    categoryErrors,
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
