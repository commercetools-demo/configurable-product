/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomView}
 */
const config = {
  name: 'Configurable Product',
  description: 'Configure products and store this config using a custom object',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
      hostUriPath:
        // '/tech-sales-good-store/products/013ded80-5cbe-42b3-aa4b-45c73d73c161/variants/2/prices',
        '/tech-sales-good-store/products/013ded80-5cbe-42b3-aa4b-45c73d73c161/variants/1',
    },
    production: {
      customViewId: '${env:CUSTOM_VIEW_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  additionalEnv: {
    supportedProductTypeList: '${env:SUPPORTED_PRODUCT_TYPES}',
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
