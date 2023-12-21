import { defineMessages } from 'react-intl';

export default defineMessages({
  backButton: {
    id: 'RowDetails.button.back',
    description: 'Label for back button',
    defaultMessage: 'To Custom Objects list',
  },
  errorLoading: {
    id: 'RowDetails.error.loading.title',
    description: 'Error title when querying for custom object fails',
    defaultMessage: 'Something went wrong loading the custom object.',
  },
  generalTab: {
    id: 'RowDetails.tabs.general',
    description: 'Label for general tab',
    defaultMessage: 'General',
  },
  deleteCustomObject: {
    id: 'RowDetails.button.deleteCustomObject',
    description: 'Label for delete custom object button',
    defaultMessage: 'Delete Custom Object',
  },
  deleteCustomObjectConfirmation: {
    id: 'RowDetails.message.deleteCustomObjectConfirm',
    description: 'Delete custom object confirmation message',
    defaultMessage: 'Are you sure you want to delete this custom object?',
  },
  deleteSuccess: {
    id: 'RowDetails.message.delete.success',
    description: 'Success message for deleting custom object',
    defaultMessage: 'Your custom object has been deleted.',
  },
  deleteError: {
    id: 'RowDetails.message.delete.error',
    description: 'Error message for deleting custom object',
    defaultMessage: 'Something went wrong. Your custom object was not deleted.',
  },
  editSuccess: {
    id: 'RowDetails.form.message.edit.success',
    description: 'Success message for editing row',
    defaultMessage: 'Your row update has been saved.',
  },
  editError: {
    id: 'RowDetails.form.message.edit.error',
    description: 'Error message for editing row',
    defaultMessage:
      'Something went wrong. Your change was not saved. {message}',
  },
});
