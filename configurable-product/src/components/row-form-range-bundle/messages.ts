import { defineMessages } from 'react-intl';

export default defineMessages({
  bundleProductsTitle: {
    id: 'StaticBundle.form.products.title',
    description: 'Title for bundle products field',
    defaultMessage: 'Product Variants',
  },
  bundleProductsDescription: {
    id: 'StaticBundle.form.products.description',
    description: 'Description for bundle products field',
    defaultMessage: 'Select variants to include in bundle.',
  },
  bundleQuantityTitle: {
    id: 'DynamicBundle.form.quantity.title',
    description: 'Title for bundle quantity fields',
    defaultMessage: 'Range',
  },
  bundleMinQuantityPlaceholder: {
    id: 'DynamicBundle.form.minQuantity.placeholder',
    description: 'Placeholder for bundle min quantity field',
    defaultMessage: 'Minimum',
  },
  bundleMaxQuantityPlaceholder: {
    id: 'DynamicBundle.form.maxQuantity.placeholder',
    description: 'Placeholder for bundle max quantity field',
    defaultMessage: 'Maximum',
  },
});
