import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import messages from './messages';
import { useIntl } from 'react-intl';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import CustomizableProductEditor from './customizable-product-editor';
import CustomizableProductPrices from '../customizable-product-prices';
import CustomizableProductLoader from '../customizable-product-loader';

const CustomizableProduct = () => {
  const intl = useIntl();
  const { hostUrl } = useCustomViewContext((context) => ({
    hostUrl: context.hostUrl,
  }));

  if (!hostUrl) {
    return (
      <ContentNotification type="error">
        <Text.Body>{intl.formatMessage(messages.noHostUrl)}</Text.Body>
      </ContentNotification>
    );
  }
  const [__, productId, variantId, tab] =
    hostUrl.match('/products/([^/]+)/variants/([^/]+)/?([^/]+)?') || [];

  if (!productId) {
    return (
      <ContentNotification type="error">
        <Text.Body>{intl.formatMessage(messages.productsIndex)}</Text.Body>
      </ContentNotification>
    );
  }
  if (!variantId) {
    return (
      <ContentNotification type="error">
        <Text.Body>{intl.formatMessage(messages.variantsIndex)}</Text.Body>
      </ContentNotification>
    );
  }
  return (
    <CustomizableProductLoader productId={productId} variantId={variantId}>
      {(formProps) => {
        if (tab === 'prices') {
          return (
            <CustomizableProductPrices
              resource={formProps.resource}
              variant={formProps.variant}
              product={formProps.product}
            />
          );
        }
        return <CustomizableProductEditor resource={formProps.resource} />;
      }}
    </CustomizableProductLoader>
  );
};

CustomizableProduct.displayName = 'Customizable Product';

export default CustomizableProduct;
