/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomView}
 */
const config = {
  name: 'Configurable Product',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
      hostUriPath:
        '/tech-sales-good-store/products/4ea7b9e8-730f-413b-953a-9cad3278d7eb/variants/2/prices',
      // '/tech-sales-good-store/products/4ea7b9e8-730f-413b-953a-9cad3278d7eb/variants/2',
    },
    production: {
      customViewId: '${env:CUSTOM_VIEW_ID}',
      url: '${env:APPLICATION_URL}',
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
  locators: [
    'products.product_variant_details.general',
    'products.product_variant_details.prices',
  ],
};

export default config;
