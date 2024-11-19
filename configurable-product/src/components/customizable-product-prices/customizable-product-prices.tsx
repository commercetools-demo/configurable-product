import { FC, useEffect, useState } from 'react';
import {
  TCustomObject,
  TProduct,
  TProductVariant,
} from '../../types/generated/ctp';
import {
  createGraphQlUpdateActions,
  mapCustomObject,
  notEmpty,
} from '../../helpers';
import { ProductEntry } from '../product-field/product-field';
import {
  useLazyProduct,
  useProductUpdater,
} from '../../hooks/use-product-connector';
import ProductPricesTable, {
  Config,
  PriceRow,
} from '../product-prices-table/product-prices-table';
import { FormMainPage } from '@commercetools-frontend/application-components';
import NumberField from '@commercetools-uikit/number-field';
import { FormikProvider, useFormik } from 'formik';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useIntl } from 'react-intl';
import { findSyncActions } from '../../hooks/use-product-connector/use-product-connector';
import {
  showApiErrorNotification,
  TApiErrorNotificationOptions,
  useShowNotification,
} from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';
import messages from './messages';
import { transformErrors } from './transform-errors';

export type FormData = {
  prices: Array<{ currency: string; country?: string; centAmount: number }>;
};

export type Props = {
  variant: TProductVariant;
  product: TProduct;
  resource: TCustomObject;
};
const CustomizableProductPrices: FC<Props> = ({
  resource,
  variant,
  product,
}) => {
  const [prices, setPrices] = useState<Array<PriceRow>>();
  const [config, setConfig] = useState<Array<Config>>();
  const [discount, setDiscount] = useState<number>(10);
  const lazyProductLoader = useLazyProduct();
  const productUpdater = useProductUpdater();
  const intl = useIntl();
  const showNotification = useShowNotification();

  useEffect(() => {
    const fetchData = async () => {
      let productEntries: Array<ProductEntry> = [];
      mapCustomObject(resource).forEach((row) => {
        if (row.config.type === 'static-bundle') {
          productEntries = productEntries.concat(row.products);
        }
      });

      return await Promise.all(
        productEntries.map(async (product) => {
          return {
            quantity: product.quantity,
            product: await lazyProductLoader.execute({
              id: product.product?.productId,
            }),
          };
        })
      );
    };
    fetchData()
      .then((items) => {
        const prices: Array<PriceRow> = [];
        const config: Array<Config> = [];

        items
          .map((item) => {
            item.product.data?.product &&
              item.quantity &&
              config.push({
                product: item.product.data.product,
                quantity: item.quantity,
              });
            return item.product.data?.product;
          })
          .filter(notEmpty)
          .map((product) => {
            product.masterData.staged?.allVariants.map((variant) =>
              variant.prices?.forEach((price) => {
                const index = prices.findIndex(
                  (entry) =>
                    entry.country === (price.country || 'not-set') &&
                    entry.currency === price.value.currencyCode
                );
                if (index < 0) {
                  prices.push({
                    currency: price.value.currencyCode,
                    country: price.country || 'not-set',
                    entry: [
                      {
                        centAmount: new Set<number>([price.value.centAmount]),
                        product: product,
                      },
                    ],
                  });
                } else {
                  //check if entry for product exists
                  const indexOfProduct = prices[index].entry.findIndex(
                    (e) => e.product.id === product.id
                  );
                  if (indexOfProduct >= 0) {
                    prices[index].entry[indexOfProduct].centAmount.add(
                      price.value.centAmount
                    );
                  } else {
                    prices[index].entry.push({
                      centAmount: new Set<number>([price.value.centAmount]),
                      product: product,
                    });
                  }
                }
              })
            );
            return prices;
          });
        setPrices(prices);
        setConfig(config);
      })
      .catch(console.error);
  }, [resource]);

  const handleSubmit = async (values: FormData) => {
    try {
      const actions = findSyncActions(variant, values.prices);
      const mappedActions = createGraphQlUpdateActions(actions, {
        staged: false,
      });

      await productUpdater.execute({
        actions: mappedActions,
        version: product.version,
        id: product.id,
      });
      showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.updateSuccess),
      });
    } catch (graphQLErrors) {
      const transformedErrors = transformErrors(graphQLErrors);
      if (transformedErrors.unmappedErrors.length > 0) {
        showApiErrorNotification({
          errors:
            transformedErrors.unmappedErrors as TApiErrorNotificationOptions['errors'],
        });
      }
    }
  };

  const formik = useFormik<FormData>({
    initialValues: {
      prices:
        variant?.prices?.map((price) => {
          return {
            country: price.country || undefined,
            currency: price.value.currencyCode,
            centAmount: price.value.centAmount,
          };
        }) || [],
    },
    onSubmit: handleSubmit,
  });

  return (
    <FormMainPage
      title={'Bundle Price Generator'}
      subtitle={'Define your bundle price.'}
      onSecondaryButtonClick={() => formik.resetForm()}
      onPrimaryButtonClick={() => formik.submitForm()}
      hideControls={false}
      labelPrimaryButton={intl.formatMessage(FormMainPage.Intl.save)}
      labelSecondaryButton={intl.formatMessage(FormMainPage.Intl.revert)}
      isPrimaryButtonDisabled={formik.isSubmitting || !formik.dirty}
      isSecondaryButtonDisabled={formik.isSubmitting || !formik.dirty}
    >
      <FormikProvider value={formik}>
        <Spacings.Stack scale={'l'}>
          <Spacings.Inline scale={'s'} alignItems={'center'}>
            <Text.Body>Discount of</Text.Body>
            <NumberField
              name={'discount'}
              value={discount || ''}
              title={''}
              onChange={(event) => {
                setDiscount(event.target.value as any as number);
              }}
              horizontalConstraint={3}
            />
            <Text.Body>%</Text.Body>
          </Spacings.Inline>
          {prices && config && (
            <ProductPricesTable
              prices={prices}
              config={config}
              discount={discount}
            />
          )}
        </Spacings.Stack>
      </FormikProvider>
    </FormMainPage>
  );
};

CustomizableProductPrices.displayName = 'Customizable Product Prices';

export default CustomizableProductPrices;
