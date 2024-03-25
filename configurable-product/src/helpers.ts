import { ApolloError } from '@apollo/client';
import { TCustomObject } from './types/generated/ctp';
import { Row } from './components/row-form/row-form';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { transformLocalizedFieldToLocalizedString } from '@commercetools-frontend/l10n';

export const getErrorMessage = (error: ApolloError) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

export const extractErrorFromGraphQlResponse = (graphQlResponse: unknown) => {
  if (graphQlResponse instanceof ApolloError) {
    return getErrorMessage(graphQlResponse);
  }

  return graphQlResponse;
};

export const mapCustomObject = (customObject?: TCustomObject): Array<Row> => {
  if (Array.isArray(customObject?.value)) {
    return customObject?.value as Array<Row>;
  }
  return [];
};

export const customObjectToConfigRow = (
  projectLanguages: Array<string>,
  key?: string,
  customObject?: TCustomObject
): Row => {
  const template: Row = {
    key: key || '',
    values: [],
    config: { isRequired: false },
    title: LocalizedTextInput.createLocalizedString(
      projectLanguages,
      transformLocalizedFieldToLocalizedString([]) ?? {}
    ),
    text: LocalizedTextInput.createLocalizedString(
      projectLanguages,
      transformLocalizedFieldToLocalizedString([]) ?? {}
    ),
    unit: LocalizedTextInput.createLocalizedString(
      projectLanguages,
      transformLocalizedFieldToLocalizedString([]) ?? {}
    ),
    products: [{ product: undefined }],
    categories: [{ category: undefined }],
  };
  let row = mapCustomObject(customObject).find((entry) => entry.key === key);
  return { ...template, ...(row || {}) };
};
