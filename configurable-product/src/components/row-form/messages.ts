import { defineMessages } from 'react-intl';

export default defineMessages({
  generalInformationTitle: {
    id: 'CustomObject.form.panel.general.title',
    description: 'Title for general information panel',
    defaultMessage: 'General Information',
  },
  containerTitle: {
    id: 'CustomObject.form.container.title',
    description: 'Title for container field',
    defaultMessage: 'Container',
  },
  keyTitle: {
    id: 'CustomObject.form.key.title',
    description: 'Title for key field',
    defaultMessage: 'Row key',
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
  'int-range': {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.localizedLabel',
    defaultMessage: 'Range',
  },
  staticBundle: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.localizedLabel',
    defaultMessage: 'Static Bundle',
  },
  dynamicBundle: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.localizedLabel',
    defaultMessage: 'Dynamic Bundle',
  },
  rangeBundle: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.localizedLabel',
    defaultMessage: 'Range Bundle',
  },
  requiredLabel: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.isRequired',
    defaultMessage: 'is Required',
  },
  allowProductSelectionLabel: {
    id: 'ProjectSettings.ProductTypes.Details.AttributeDefinition.Details.isRequired',
    defaultMessage: 'Allow Product Selection',
  },
  editEnumButtonLabel: {
    id: 'ProjectSettings.ProductType.AttributeDefinitions.Details.EnumTable.editEnumButton.label',
    description:
      'The label of the button adding a new enum-value in the footer of the enum-table',
    defaultMessage: 'Edit List Items',
  },
  areAllEnumValuesEmpty: {
    id: 'ProjectSettings.ProductType.AttributeDefinitions.Details.EnumTable.enum.empty',
    description:
      'The error message displayed when a user attempts to add an attribute with empty values for both key and label(s) of the first enum value',
    defaultMessage: 'Add enum key and/or label',
  },
  quantityError: {
    id: 'DynamicBundle.form.errors.quantity.one',
    description: 'Error message for quantity',
    defaultMessage: 'Quantity must be 1 or greater.',
  },
  zeroQuantityError: {
    id: 'DynamicBundle.form.errors.quantity.zero',
    description: 'Error message for quantity',
    defaultMessage: 'Quantity must be 0 or greater.',
  },
  integerError: {
    id: 'DynamicBundle.form.errors.integer',
    description: 'Error message for quantity as an integer',
    defaultMessage: 'Quantity must be an integer.',
  },
  minGreaterThanMaxError: {
    id: 'DynamicBundle.form.errors.maxGreaterThanMin',
    description: 'Error message for maximum quantity',
    defaultMessage: 'Maximum quantity must exceed minimum quantity.',
  },
  missingRequiredField: {
    id: 'DynamicBundle.form.errors.missingRequiredField',
    description: 'Error message for missing required value',
    defaultMessage: 'This field is required. Provide a value.',
  },
  saveFirst: {
    id: 'ProjectSettings.ProductTypes.Attributes.cannotBeCreated',
    description:
      'The message explaining to the user that he cannot create attributes immediately when creating a product-type',
    defaultMessage:
      'Please save first in order to create further configuration.',
  },
});
