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
import { FormikTouched } from 'formik/dist/types';
import { notEmpty } from '../../helpers';
import { ErrorMessage } from '@commercetools-uikit/messages';
import { renderProductError, TProductError } from '../row-form/validation';

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

const getError = (
  errors: { [key: number]: TProductError } | undefined,
  field: keyof ProductEntry,
  item: FormikTouched<ProductEntry>,
  index: number
): { [key: string]: boolean } =>
  // @ts-ignore
  item && item[field] ? errors?.[index]?.[field] : null;

const hasError = (
  touched: Array<FormikTouched<ProductEntry>> | undefined,
  errors: { [key: number]: TProductError } | undefined,
  index: number,
  field: string
) =>
  !!get(touched, `[${index}].${field}`) && !!get(errors, `[${index}].${field}`);

const getErrors = (
  touched: Array<FormikTouched<ProductEntry>> | undefined,
  errors: { [key: number]: TProductError } | undefined
) => {
  let result: Array<{ [key: string]: boolean }> = [];
  if (touched && errors) {
    result = touched.reduce<Array<{ [key: string]: boolean }>>(
      (errs, item, index) => {
        let array: Array<{ [key: string]: boolean }> = [
          getError(errors, PRODUCT, item, index),
          getError(errors, QUANTITY, item, index),
        ].filter(notEmpty);
        return [...errs, ...array];
      },
      []
    );
  }
  return result;
};

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
  const fieldErrors = getErrors(
    formik.touched.products,
    formik.errors.products as { [key: number]: TProductError } | undefined
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
                  formik.errors.products as
                    | { [key: number]: TProductError }
                    | undefined,
                  index,
                  PRODUCT
                )}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // touched={
                //   formik.touched.products &&
                //   formik.touched.products[index] &&
                //   formik.touched.products[index][PRODUCT]
                // }
              />
            </div>
            {withQuantity && (
              <div className={styles['product-quantity']}>
                <NumberInput
                  name={`${name}.${index}.${QUANTITY}`}
                  value={quantity || ''}
                  placeholder={intl.formatMessage(messages.quantityPlaceholder)}
                  hasError={hasError(
                    formik.touched.products,
                    formik.errors.products as
                      | { [key: number]: TProductError }
                      | undefined,
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
        {fieldErrors && (
          <>
            {fieldErrors.map((error, index) => {
              return (
                <ErrorMessage key={index}>
                  {renderProductError(Object.keys(error)[0])}
                </ErrorMessage>
              );
            })}
          </>
        )}
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

export default ProductField;
