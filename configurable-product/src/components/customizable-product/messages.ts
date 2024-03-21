import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'CustomizableProduct.title',
    description: 'The page title of the customizable product list view',
    defaultMessage: 'Customizable Product Configuration',
  },
  noHostUrl: {
    id: 'CustomizableProduct.noHostUrl',
    defaultMessage: 'Cannot find hostUrl',
  },
  productsIndex: {
    id: 'CustomizableProduct.productsIndex',
    defaultMessage: 'Cannot find productsIndex in URL',
  },
  variantsIndex: {
    id: 'CustomizableProduct.variantsIndex',
    defaultMessage: 'Cannot find variantsIndex in URL',
  },
  noProduct: {
    id: 'CustomizableProduct.noProduct',
    defaultMessage: 'Cannot find product with id: {id}.',
  },
  noVariant: {
    id: 'CustomizableProduct.noVariant',
    defaultMessage:
      'Cannot find variant for product with id: {id} and variant id: {variantId}',
  },
  missingAttribute: {
    id: 'CustomizableProduct.missingAttribute',
    defaultMessage: 'Attribute with name "{attributeName}" cannot be found.',
  },
  wrongProductType: {
    id: 'CustomizableProduct.wrongProductType',
    defaultMessage:
      'This Custom View only works for products of type {productType}.',
  },
  createAndLink: {
    id: 'CustomizableProduct.createAndLink',
    defaultMessage:
      'Create and Link Custom Object to attribute with name "{attributeName}".',
  },
  editSuccess: {
    id: 'EditCustomObject.form.message.edit.success',
    defaultMessage: 'Your data has been saved.',
  },
  editError: {
    id: 'EditCustomObject.form.message.edit.error',
    defaultMessage:
      'Something went wrong. Your row update was not saved. {message}',
  },
  noResults: {
    id: 'CustomizableProduct.noResults',
    defaultMessage: 'No data found.',
  },
  createNewRow: {
    id: 'CustomizableProduct.button.createNewRow',
    description: 'Label for the button to create a new row',
    defaultMessage: 'Create new row',
  },
  columnTypeKey: {
    id: 'CustomizableProduct.ListView.column.key',
    description: 'Title of the key',
    defaultMessage: 'Key',
  },
  columnTypeType: {
    id: 'CustomizableProduct.ListView.column.type',
    description: 'Title of the type',
    defaultMessage: 'Type',
  },
  attributeLabelcolor: {
    id: 'ProjectSettings.ProductTypes.Details.labels.boolean',
    defaultMessage: 'Color',
  },
  'attributeLabelint-range': {
    id: 'ProjectSettings.ProductTypes.Details.labels.boolean',
    defaultMessage: 'Integer Range',
  },
  'attributeLabelstatic-bundle': {
    id: 'ProjectSettings.ProductTypes.Details.labels.boolean',
    defaultMessage: 'Static Bundle',
  },
  localizedLabel: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.localizedLabel',
    description: '',
    defaultMessage: 'Localized',
  },
  columnIsRequired: {
    id: 'AttributeGroups.AssignedAttributes.columnIsRequired',
    description: 'Message for the column required in the attributes table',
    defaultMessage: 'Required',
  },
});
