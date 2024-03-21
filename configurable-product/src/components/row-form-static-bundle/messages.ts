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
    defaultMessage: 'Select variants with quantity to include in bundle.',
  },
  productPlaceholder: {
    id: 'ProductField.product.placeholder',
    description: 'Placeholder for product select',
    defaultMessage: 'Search by name, description, slug, or sku.',
  },
  quantityPlaceholder: {
    id: 'ProductField.quantity.placeholder',
    description: 'Placeholder for quantity input',
    defaultMessage: 'Quantity',
  },
  addProductLabel: {
    id: 'ProductField.button.add.label',
    description: 'Label for add variant button',
    defaultMessage: 'Add Variant',
  },
});
