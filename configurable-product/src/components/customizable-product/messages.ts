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
