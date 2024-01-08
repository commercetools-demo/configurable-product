import { defineMessages } from 'react-intl';

export default defineMessages({
  generalInformationTitle: {
    id: 'CustomObject.form.panel.general.title',
    description: 'Title for general information panel',
    defaultMessage: 'General Information',
  },
  customObjectInformationTitle: {
    id: 'CustomObject.form.panel.container.title',
    description: 'Title for custom object information panel',
    defaultMessage: 'Custom Object Information',
  },
  containerTitle: {
    id: 'CustomObject.form.container.title',
    description: 'Title for container field',
    defaultMessage: 'Container',
  },
  keyTitle: {
    id: 'CustomObject.form.key.title',
    description: 'Title for key field',
    defaultMessage: 'Custom object key',
  },
  titleTitle: {
    id: 'CustomObject.form.title.title',
    description: 'Title for title field',
    defaultMessage: 'Title',
  },
  titleText: {
    id: 'CustomObject.form.text.title',
    description: 'Title for text field',
    defaultMessage: 'Text',
  },
  addLabel: {
    id: 'CustomObject.form.add.button',
    description: 'Label for add button',
    defaultMessage: 'Add',
  },
  removeLabel: {
    id: 'CustomObject.form.remove.button',
    description: 'Label for remove button',
    defaultMessage: 'Remove',
  },
  referenceLabel: {
    id: 'CustomObject.form.reference.hint',
    description: 'Label for reference hint',
    defaultMessage: 'Reference',
  },
  submitButton: {
    id: 'Container.form.button.submit',
    description: 'Label for submit button',
    defaultMessage: 'Save',
  },
  requiredFieldError: {
    id: 'Container.form.error.required',
    description: 'The error message for required fields',
    defaultMessage: 'This field is required. Provide a value.',
  },
  attributeTypeTitle: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.attributeTypeTitle',
    description: '',
    defaultMessage: 'Attribute type',
  },
  attributeTypeWarning: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.attributeTypeWarning',
    description: '',
    defaultMessage:
      'Once a product type attribute is saved, the type of attribute cannot be changed.',
  },
  colorChooser: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.localizedLabel',
    defaultMessage: 'Color Chooser',
  },
  dropdown: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.localizedLabel',
    defaultMessage: 'Dropdown',
  },
  radio: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.localizedLabel',
    defaultMessage: 'Radio',
  },

  requiredLabel: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.isRequired',
    defaultMessage: 'is Required',
  },
  attributeSettingsTitle: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.attributeSettingsTitle',
    description: '',
    defaultMessage: 'Attribute settings',
  },
  addEnumButtonLabel: {
    id: 'ProjectSettings.ProductType.AttributeDefinitions.Details.EnumTable.addEnumButton.label',
    description:
      'The label of the button adding a new enum-value in the footer of the enum-table',
    defaultMessage: 'Add New List Item',
  },
  tableHeaderLabelKey: {
    id: 'ProjectSettings.ProductType.AttributeDefinitions.Details.EnumTable.headers.key',
    description:
      'The column title of the enumeration key in the table displaying enums on the attributed-detail page in product-types administration',
    defaultMessage: 'Enumeration Key',
  },
  tableHeaderLabelLabel: {
    id: 'ProjectSettings.ProductType.AttributeDefinitions.Details.EnumTable.headers.label',
    description:
      'The column title of the enumeration label for plain enums in the table displaying enums on the attributed-detail page in product-types administration',
    defaultMessage: 'List Item Label',
  },
  editEnumButtonLabel: {
    id: 'ProjectSettings.ProductType.AttributeDefinitions.Details.EnumTable.editEnumButton.label',
    description:
      'The label of the button adding a new enum-value in the footer of the enum-table',
    defaultMessage: 'Edit List Items',
  },
  tableHeaderLocalizedLabelLabel: {
    id: 'ProjectSettings.ProductType.AttributeDefinitions.Details.EnumTable.headers.label.localized',
    description:
      'The column title of the enumeration label for localized enums in the table displaying enums on the attributed-detail page in product-types administration',
    defaultMessage: 'List Item Label ({language})',
  },
  areAllEnumValuesEmpty: {
    id: 'ProjectSettings.ProductType.AttributeDefinitions.Details.EnumTable.enum.empty',
    description:
      'The error message displayed when a user attempts to add an attribute with empty values for both key and label(s) of the first enum value',
    defaultMessage: 'Add enum key and/or label',
  },
});
