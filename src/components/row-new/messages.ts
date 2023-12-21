import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'RowNew.title',
    description: 'The page title of create new object',
    defaultMessage: 'Create a new row',
  },
  backButton: {
    id: 'RowNew.button.back',
    description: 'Label for back button',
    defaultMessage: 'To Overview',
  },
  editSuccess: {
    id: 'EditCustomObject.form.message.edit.success',
    description: 'Success message for editing custom object',
    defaultMessage: 'Your row has been saved.',
  },
  editError: {
    id: 'EditCustomObject.form.message.edit.error',
    description: 'Error message for editing custom object',
    defaultMessage:
      'Something went wrong. Your row update was not saved. {message}',
  },
});
