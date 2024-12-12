import { FC } from 'react';
import {
  TCustomObject,
  TProduct,
  TProductVariant,
} from '../../types/generated/ctp';
import {
  useProductUpdater,
  useRetrieveCustomObjectForProduct,
} from '../../hooks/use-product-connector';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { getErrorMessage } from '../../helpers';
import { FormattedMessage, useIntl } from 'react-intl';
import messages from '../customizable-product/messages';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import Spacings from '@commercetools-uikit/spacings';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useCustomObjectUpdater } from '../../hooks/use-custom-object-connector/use-custom-object-connector';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';

export type FormProps = {
  resource: TCustomObject;
  variant: TProductVariant;
  product: TProduct;
};

export type Props = {
  productId: string;
  variantId: string;
  children: ({ resource, variant }: FormProps) => JSX.Element;
};
const configuration = 'configuration';
const DEFAULT_SUPPORTED_PRODUCT_TYPE = 'configurable';
const CustomizableProductLoader: FC<Props> = ({
  productId,
  variantId,
  children,
}) => {
  const intl = useIntl();
  const showNotification = useShowNotification();
  const customObjectUpdater = useCustomObjectUpdater();
  const productUpdater = useProductUpdater();
  // @ts-ignore
  const { supportedProductTypeList } = useCustomViewContext(
    (context) => context.environment
  );
  const supportedProductTypes = supportedProductTypeList
    ? supportedProductTypeList.split(',').map((value: string) => value.trim())
    : [DEFAULT_SUPPORTED_PRODUCT_TYPE];

  const { product, error, loading, refetch } =
    useRetrieveCustomObjectForProduct({
      id: productId,
    });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  if (!loading && !product) {
    return (
      <ContentNotification type="info">
        <Text.Body>
          <FormattedMessage
            {...messages.noProduct}
            values={{ id: productId }}
          />
        </Text.Body>
      </ContentNotification>
    );
  }
  if (!supportedProductTypes.includes(product?.productType?.key)) {
    return (
      <ContentNotification type="info">
        <Text.Body>
          <FormattedMessage
            {...messages.wrongProductType}
            values={{ productType: supportedProductTypeList }}
          />
        </Text.Body>
      </ContentNotification>
    );
  }
  const variant = product?.masterData.staged?.allVariants.find(
    (value) => value.id === Number(variantId)
  );

  if (!variant) {
    return (
      <ContentNotification type="info">
        <Text.Body>
          <FormattedMessage
            {...messages.noVariant}
            values={{ id: productId, variantId: variantId }}
          />
        </Text.Body>
      </ContentNotification>
    );
  }

  let customObjectKey = '';
  if (product.key && variant.key) {
    customObjectKey = product.key + '-' + variant.key;
  } else if (product.key && variant.sku) {
    customObjectKey = product.key + '-' + variant.sku;
  } else {
    customObjectKey = product.id + '-' + variant.sku;
  }
  const onSubmit = async () => {
    const result = await customObjectUpdater.execute({
      draft: {
        container: 'configurable-product',
        key: customObjectKey,
        value: JSON.stringify({}),
      },
      onCompleted() {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.editSuccess),
        });
      },
      onError(message) {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.error,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.editError, { message: message }),
        });

        refetch();
      },
    });
    await productUpdater.execute({
      actions: [
        {
          setAttribute: {
            name: configuration,
            variantId: Number.parseInt(variantId),
            value: JSON.stringify({
              id: result.data?.createOrUpdateCustomObject?.id,
              typeId: 'key-value-document',
            }),
          },
        },
      ],
      version: product.version,
      id: product.id,
    });
    refetch();
  };

  const attribute = variant.attributesRaw.find(
    (attribute) => attribute.name === configuration
  );
  if (!attribute) {
    return (
      <Spacings.Stack alignItems={'flexStart'}>
        <ContentNotification type="info">
          <Text.Body>
            <FormattedMessage
              {...messages.missingAttribute}
              values={{ attributeName: configuration }}
            />
          </Text.Body>
        </ContentNotification>
        <PrimaryButton
          label={intl.formatMessage(messages.createAndLink, {
            attributeName: configuration,
          })}
          onClick={onSubmit}
        />
      </Spacings.Stack>
    );
  }
  const referencedResource = attribute.referencedResource;
  if (!referencedResource) {
    return (
      <ContentNotification type="info">
        <Text.Body intlMessage={messages.noResults} />
      </ContentNotification>
    );
  }
  if (
    !('__typename' in referencedResource) ||
    referencedResource.__typename !== 'CustomObject'
  ) {
    return (
      <ContentNotification type="info">
        <Text.Body intlMessage={messages.noResults} />
      </ContentNotification>
    );
  }

  const resource = referencedResource as TCustomObject;
  return children({ resource, variant, product });
};

CustomizableProductLoader.displayName = 'Customizable Product Loader';

export default CustomizableProductLoader;
