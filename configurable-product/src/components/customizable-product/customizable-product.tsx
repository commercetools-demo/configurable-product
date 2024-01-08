import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import messages from './messages';
import { useIntl } from 'react-intl';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import { TMergedContext } from '@commercetools-frontend/application-shell-connectors/dist/declarations/src/components/custom-view-context/custom-view-context';
import CustomizableProductEditor from './customizable-product-editor';

const CustomizableProduct = () => {
  const intl = useIntl();
  const { hostUrl } = useCustomViewContext((context: TMergedContext) => ({
    hostUrl: context.hostUrl,
  }));
  let productId: string | undefined = undefined;
  let variantId: string | undefined;
  if (hostUrl) {
    const splittedUrl = hostUrl.split('/');
    const productsIndex = splittedUrl.indexOf('products');
    const variantsIndex = splittedUrl.indexOf('variants');
    if (productsIndex === -1) {
      return (
        <ContentNotification type="error">
          <Text.Body>{intl.formatMessage(messages.productsIndex)}</Text.Body>
        </ContentNotification>
      );
    }
    if (variantsIndex === -1) {
      return (
        <ContentNotification type="error">
          <Text.Body>{intl.formatMessage(messages.variantsIndex)}</Text.Body>
        </ContentNotification>
      );
    }
    productId = splittedUrl[productsIndex + 1];
    variantId = splittedUrl[variantsIndex + 1];
  } else {
    return (
      <ContentNotification type="error">
        <Text.Body>{intl.formatMessage(messages.noHostUrl)}</Text.Body>
      </ContentNotification>
    );
  }
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
    <CustomizableProductEditor productId={productId} variantId={variantId} />
  );
};

CustomizableProduct.displayName = 'Customizable Product';

export default CustomizableProduct;
