import { FC } from 'react';
import DataTable from '@commercetools-uikit/data-table';
import { useIntl } from 'react-intl';
import messages from './messages';
import Spacings from '@commercetools-uikit/spacings';
import { TProduct } from '../../types/generated/ctp';
import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useFormikContext } from 'formik';
import { FormData } from '../customizable-product-prices/customizable-product-prices';
import NumberField from '@commercetools-uikit/number-field';

export type PriceRow = {
  currency: string;
  country?: string;
  entry: Array<{ centAmount: Set<number>; product: TProduct }>;
};

export type Config = { product: TProduct; quantity: string };

export type Props = {
  prices: Array<PriceRow>;
  config: Array<Config>;
  discount: number;
};

const ProductPricesTable: FC<Props> = ({ prices, config, discount }) => {
  const intl = useIntl();
  const formik = useFormikContext<FormData>();
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
  }));
  const products: Array<TProduct> = [];
  prices
    .map((row) => row.entry)
    .flat()
    .map((entry) => entry.product)
    .forEach((product) => {
      if (products.findIndex((p) => p.id === product.id) < 0) {
        products.push(product);
      }
    });
  return (
    <Spacings.Inline>
      <DataTable
        rows={prices.map((row, index) => ({ ...row, id: index + '' }))}
        columns={[
          { key: 'country', label: intl.formatMessage(messages.labelCountry) },
          { key: 'currency', label: intl.formatMessage(messages.labelPrice) },
        ]
          .concat(
            config.map((p) => ({
              key: 'product:' + p.product.id,
              label:
                p.quantity +
                ' x ' +
                formatLocalizedString(
                  {
                    name: transformLocalizedFieldToLocalizedString(
                      p.product.masterData.staged?.nameAllLocales ?? []
                    ),
                  },
                  {
                    key: 'name',
                    locale: dataLocale,
                    fallbackOrder: projectLanguages,
                    fallback: NO_VALUE_FALLBACK,
                  }
                ),
            }))
          )
          .concat([
            {
              key: 'recommended',
              label: intl.formatMessage(messages.labelRecommendedRetailPrice),
            },
          ])}
        itemRenderer={(item, column) => {
          const currency = item.currency;
          if (column.key.startsWith('product:')) {
            const entry = item.entry.find(
              (item) =>
                item.product.id === column.key.substring('product:'.length)
            );
            if (entry && entry.centAmount) {
              const sorted = Array.from(entry.centAmount).sort((a, b) =>
                a <= b ? 1 : 0
              );
              const firstAndLast =
                sorted.length > 1
                  ? [sorted[0], sorted[sorted.length - 1]]
                  : [sorted[0]];
              return firstAndLast
                .map((item) =>
                  intl.formatNumber(item / 100, {
                    style: 'currency',
                    currency: currency,
                  })
                )
                .join(' - ');
            }
          }
          switch (column.key) {
            case 'recommended': {
              const sum = config.map((row) => {
                const found = item.entry.find(
                  (e) => e.product.id === row.product.id
                );
                if (found) {
                  const centAmounts = Array.from(found.centAmount);
                  return (
                    Number.parseInt(row.quantity, 10) *
                    centAmounts[centAmounts.length - 1]
                  );
                }
                return 0;
              });

              let summed = sum.reduce((sum, current) => sum + current, 0);
              if (discount) {
                summed = summed - (summed * discount) / 100;
              }
              summed = Math.round((summed / 100 + Number.EPSILON) * 100) / 100;
              const possibleDefault = formik.values.prices.find(
                (price) =>
                  price.country === item.country &&
                  price.currency === item.currency
              );
              return (
                <NumberField
                  title={''}
                  placeholder={String(summed)}
                  value={
                    possibleDefault?.centAmount
                      ? String((possibleDefault?.centAmount || 0) / 100)
                      : ''
                  }
                  onChange={(event) => {
                    const newPrices = [...formik.values.prices];
                    let findIndex = newPrices.findIndex(
                      (price) =>
                        price.currency === item.currency &&
                        price.country === item.country
                    );

                    const newValue =
                      (event.target.value as any as number) * 100;
                    if (findIndex >= 0) {
                      newPrices.splice(findIndex, 1);
                      formik.setFieldValue('prices', newPrices);
                      formik.setFieldTouched('prices');
                    }
                    if (event.target.value.length > 0) {
                      newPrices.push({
                        currency: item.currency,
                        country: item.country,
                        centAmount: newValue,
                      });

                      formik.setFieldValue('prices', newPrices);
                      formik.setFieldTouched('prices');
                    }
                  }}
                />
              );
            }
            default:
              return item[column.key];
          }
        }}
      />
    </Spacings.Inline>
  );
};

export default ProductPricesTable;
