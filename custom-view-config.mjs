/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomView}
 */
const config = {
  name: 'Customizable Product',
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: 'tech-sales-good-store',
      hostUriPath: "/tech-sales-good-store/products/9c941cc8-d8ca-49ab-b0a6-252154e8dfdb/variants/1"
    },
    production: {
      customViewId: 'customizable-product',
      url: 'https://my-custom-view.com',
    },
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  type: 'CustomPanel',
  typeSettings: {
    size: 'LARGE',
  },
  locators: ['products.product_variant_details.general'],
};

export default config;
