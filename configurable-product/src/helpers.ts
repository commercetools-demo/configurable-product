import { ApolloError } from '@apollo/client';
import { TChangeProductPrice, TCustomObject } from './types/generated/ctp';
import { Row } from './components/row-form/row-form';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { transformLocalizedFieldToLocalizedString } from '@commercetools-frontend/l10n';

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

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

export type TSyncAction = { action: string; [x: string]: unknown };
export type TGraphqlUpdateAction = Record<string, Record<string, unknown>>;

const convertAction = (
  action: TSyncAction,
  defaults?: { [x: string]: unknown }
): TGraphqlUpdateAction => {
  const { action: actionName, ...actionPayload } = action;
  let actionPL = actionPayload;
  switch (actionName) {
    case 'changePrice': {
      actionPL = {
        priceId: actionPL.priceId as string,
        price: {
          country: actionPL.price.country,
          value: {
            centPrecision: {
              currencyCode: actionPL.price.value.currencyCode,
              centAmount: actionPL.price.value.centAmount,
            },
          },
        },
      };
      break;
    }
    case 'addPrice': {
      actionPL = {
        variantId: actionPL.variantId as string,
        price: {
          country: actionPL.price.country,
          value: {
            centPrecision: {
              currencyCode: actionPL.price.value.currencyCode,
              centAmount: actionPL.price.value.centAmount,
            },
          },
        },
      };
      break;
    }
  }
  return {
    [actionName]: { ...actionPL, ...defaults },
  };
};
export const createGraphQlUpdateActions = (
  actions: TSyncAction[],
  defaults?: { [x: string]: unknown }
) =>
  actions.reduce<TGraphqlUpdateAction[]>(
    (previousActions, syncAction) => [
      ...previousActions,
      convertAction(syncAction, defaults),
    ],
    []
  );
