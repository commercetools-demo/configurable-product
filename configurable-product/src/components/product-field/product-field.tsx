import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import { CloseBoldIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import FieldLabel from '@commercetools-uikit/field-label';
import IconButton from '@commercetools-uikit/icon-button';
import NumberInput from '@commercetools-uikit/number-input';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';

import { PRODUCT, QUANTITY } from './constants';
import messages from './messages';
import styles from './product-field.mod.css';
import { ProductSearchInput } from '../product-search-input';
import { useFormikContext } from 'formik';
import { Row } from '../row-form/row-form';
import { FormikErrors, FormikTouched } from 'formik/dist/types';

export interface ProductValue extends Record<string, unknown> {
  id: number;
  name: { [locale: string]: string };
  productId: string;
  sku: string;
}

export interface ProductEntry {
  product?: ProductValue;
  quantity?: string;
}

const hasError = (
  touched: Array<FormikTouched<ProductEntry>> | undefined,
  errors:
    | string
    | Array<string>
    | Array<FormikErrors<ProductEntry>>
    | undefined,
  index: number,
  field: string
) =>
  !!get(touched, `[${index}].${field}`) && !!get(errors, `[${index}].${field}`);

// /*
//  * Retrieve the unique (`uniq`), non-null (`compact`) errors for the inputs of each
//  * value in the field based on the currently touched inputs.
//  *
//  * Example: The field contains two product inputs without values. The product inputs
//  * are required. If both have been touched, only one "required" error message
//  * will be shown.
//  */
// const getErrors = (
//   touched: Array<FormikTouched<ProductEntry>> | undefined,
//   errors: string | Array<string> | Array<FormikErrors<ProductEntry>> | undefined
// ) =>
//   touched &&
//   errors &&
//   Array.isArray(touched) &&
//   Array.isArray(errors) &&
//   touched.reduce((errs, item, index) => {
//     const getError = (field: string) =>
//       item && item[field] ? get(errors, `[${index}].${field}`) : null;
//
//     return uniq([...errs, ...compact([getError(PRODUCT), getError(QUANTITY)])]);
//   }, []);

interface ProductFieldProps {
  name?: string;
  title?: string | React.ReactNode;
  hint?: string | React.ReactNode;
  isRequired?: boolean;
  withQuantity?: boolean;
  onFocus?(...args: unknown[]): unknown;
  push(...args: unknown[]): unknown;
  remove(...args: unknown[]): unknown;
}

const ProductField: FC<ProductFieldProps> = ({
  name,
  hint,
  title,
  isRequired,
  withQuantity = true,
  push,
  remove,
}) => {
  const intl = useIntl();

  const formik = useFormikContext<Row>();
  // const fieldErrors = getErrors(
  //   formik.touched.products,
  //   formik.errors.products
  // );

  return (
    <Spacings.Stack scale="s">
      <Spacings.Inline alignItems="center" justifyContent="space-between">
        <FieldLabel
          title={title}
          hint={hint}
          hasRequiredIndicator={isRequired}
        />
        <SecondaryButton
          data-testid={`add-product`}
          iconLeft={<PlusBoldIcon />}
          label={intl.formatMessage(messages.addProductLabel)}
          onClick={() => push({ product: null, quantity: '' })}
        />
      </Spacings.Inline>
      <Spacings.Stack scale="s">
        {formik.values.products.map(({ product, quantity }, index) => (
          <Spacings.Inline key={index} alignItems="center">
            <div className={styles['product-search']}>
              <ProductSearchInput
                name={`${name}.${index}.${PRODUCT}`}
                value={product}
                placeholder={intl.formatMessage(messages.productPlaceholder)}
                hasError={hasError(
                  formik.touched.products,
                  formik.errors.products,
                  index,
                  PRODUCT
                )}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {withQuantity && (
              <div className={styles['product-quantity']}>
                <NumberInput
                  name={`${name}.${index}.${QUANTITY}`}
                  value={quantity || 0}
                  placeholder={intl.formatMessage(messages.quantityPlaceholder)}
                  hasError={hasError(
                    formik.touched.products,
                    formik.errors.products,
                    index,
                    QUANTITY
                  )}
                  min={1}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            )}
            <IconButton
              data-testid={`remove-product.${index}`}
              icon={<CloseBoldIcon />}
              label={intl.formatMessage(messages.addProductLabel)}
              isDisabled={formik.values.products.length === 1}
              onClick={() => remove(index)}
            />
          </Spacings.Inline>
        ))}
        {/*{fieldErrors && (*/}
        {/*  <>*/}
        {/*    {fieldErrors.map((error: string, index: number) => (*/}
        {/*      <ErrorMessage key={index}>{error}</ErrorMessage>*/}
        {/*    ))}*/}
        {/*  </>*/}
        {/*)}*/}
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

export default ProductField;
