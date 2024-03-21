import { FC } from 'react';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import ProductSearch from './product-search.rest.graphql';
import {
  useCustomViewContext,
  useApplicationContext,
} from '@commercetools-frontend/application-shell-connectors';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import { useIntl } from 'react-intl';
import Spacings from '@commercetools-uikit/spacings';
import messages from './messages';
import { formatLocalizedString } from '@commercetools-frontend/l10n';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { SingleValueProps, OptionProps } from 'react-select';
import { ProductValue } from '../product-field/product-field';
import { SearchIcon } from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';

export const ProductSearchSingleValue: FC<SingleValueProps<ProductValue>> = (
  props
) => {
  const { dataLocale, languages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    languages: context.project?.languages ?? [],
  }));
  return (
    <AsyncSelectInput.SingleValue {...props}>
      {formatLocalizedString(props.data, {
        key: 'name',
        locale: dataLocale,
        fallbackOrder: languages,
        fallback: NO_VALUE_FALLBACK,
      })}
    </AsyncSelectInput.SingleValue>
  );
};

const ProductSearchOption: FC<OptionProps<ProductValue>> = (props) => {
  const intl = useIntl();
  const { dataLocale, languages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    languages: context.project?.languages ?? [],
  }));
  const variant = props.data;

  return (
    <AsyncSelectInput.Option {...props}>
      <Spacings.Stack scale="xs">
        <Text.Detail isBold>
          {formatLocalizedString(variant, {
            key: 'name',
            locale: dataLocale,
            fallbackOrder: languages,
            fallback: NO_VALUE_FALLBACK,
          })}
        </Text.Detail>
        {variant?.id && (
          <Text.Detail>{`${intl.formatMessage(messages.id)}: ${
            variant?.id
          }`}</Text.Detail>
        )}
        {variant?.sku && (
          <Text.Detail>{`${intl.formatMessage(messages.sku)}: ${
            variant?.sku
          }`}</Text.Detail>
        )}
      </Spacings.Stack>
    </AsyncSelectInput.Option>
  );
};
ProductSearchOption.displayName = 'ProductSearchOption';

interface ProductSearchInputProps {
  name: string;
  value?: ProductValue;
  filter?: string;
  placeholder?: string;
  touched?: boolean;
  errors?: object;
  hasError?: boolean;
  onBlur?(...args: unknown[]): unknown;
  onChange(...args: unknown[]): unknown;
  renderError?(...args: unknown[]): unknown;
}

type ProductVariantResponse = {
  id: number;
  sku: string;
  isMatchingVariant: boolean;
  price: number;
};
type ProductResponse = {
  id: string;
  name: { [locale: string]: string };
  masterVariant: ProductVariantResponse;
  variants: Array<ProductVariantResponse>;
};

const ProductSearchInput: FC<ProductSearchInputProps> = ({
  name,
  value,
  filter = '',
  placeholder,
  touched,
  errors,
  hasError,
  onBlur,
  onChange,
  renderError,
}) => {
  const { dataLocale } = useCustomViewContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const intl = useIntl();

  const { refetch } = useMcQuery<
    {
      products: {
        results: Array<ProductResponse>;
      };
    },
    { locale: string; text: string; filter: string }
  >(ProductSearch, {
    variables: {
      locale: dataLocale,
      text: '',
      filter,
    },
    context: {
      skipGraphQlTargetCheck: true,
      target: 'ctp',
    },
  });

  const getMatchingVariants = (
    result: Array<ProductValue>,
    product: ProductResponse
  ) => {
    const base = {
      productId: product.id,
      name: product.name,
    };

    const addMatchingVariant = (variant: ProductVariantResponse) => {
      const { id, sku, price, isMatchingVariant } = variant;
      if (isMatchingVariant) {
        const item = {
          ...base,
          id,
          sku,
          price,
        };
        result.push(item);
      }
    };

    addMatchingVariant(product.masterVariant);

    product.variants.forEach((variant) => {
      addMatchingVariant(variant);
    });

    return result;
  };

  const loadOptions = (text: string) =>
    refetch({ text }).then((response) => {
      return response.data.products.results.reduce<Array<ProductValue>>(
        getMatchingVariants,
        []
      );
    });

  return (
    <AsyncSelectInput
      name={name}
      value={{ ...value }}
      placeholder={placeholder}
      isClearable
      isSearchable
      defaultOptions={[]}
      loadOptions={loadOptions}
      components={{
        // @ts-ignore
        SingleValue: ProductSearchSingleValue,
        // @ts-ignore
        Option: ProductSearchOption,
        DropdownIndicator: () => <SearchIcon color="primary" />,
      }}
      hasError={hasError}
      touched={touched}
      errors={errors}
      onBlur={onBlur}
      onChange={onChange}
      renderError={renderError}
      noOptionsMessage={() => intl.formatMessage(messages.noProductsFound)}
    />
  );
};
ProductSearchInput.displayName = 'ProductSearchInput';

export default ProductSearchInput;
