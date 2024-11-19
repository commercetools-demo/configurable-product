/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />
/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />

import type { ApolloError, ApolloQueryResult } from '@apollo/client';
import {
  useMcLazyQuery,
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import RetrieveCustomObject from './fetch-product.ctp.graphql';
import {
  TMutation,
  TMutation_UpdateProductArgs,
  TProduct,
  TProductUpdateAction,
  TProductVariant,
  TQuery,
  TQuery_ProductArgs,
} from '../../types/generated/ctp';
import UpdateProduct from './update-product.ctp.graphql';
import { extractErrorFromGraphQlResponse } from '../../helpers';
import { createSyncProducts } from '@commercetools/sync-actions';

const syncProducts = createSyncProducts();

type RetrieveCustomObjectProps = {
  id?: string;
  key?: string;
};

type TUseRetrieveCustomObjectFetcher = (
  retrieveCustomObjectProps: RetrieveCustomObjectProps
) => {
  product: TProduct | undefined | null;
  error?: ApolloError;
  loading: boolean;
  refetch(): Promise<ApolloQueryResult<TQuery>>;
};
export const useRetrieveCustomObjectForProduct: TUseRetrieveCustomObjectFetcher =
  ({ id, key }) => {
    const { data, error, loading, refetch } = useMcQuery<
      TQuery,
      TQuery_ProductArgs
    >(RetrieveCustomObject, {
      variables: {
        id: id,
        key: key,
      },
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    });

    return {
      product: data?.product,
      error,
      loading,
      refetch,
    };
  };

export const findSyncActions = (
  variant: TProductVariant,
  prices: Array<{ currency: string; country?: string; centAmount: number }>
) => {
  const before = {
    masterVariant: {
      sku: variant?.sku,
      id: variant?.id,
      key: variant?.key,
      prices: variant.prices?.map((p) => ({
        id: p.id,
        country: p.country,
        value: {
          currencyCode: p.value.currencyCode,
          centAmount: p.value.centAmount,
        },
      })),
    },
  };
  const now = {
    masterVariant: {
      sku: variant?.sku,
      id: variant?.id,
      key: variant?.key,
      prices: prices?.map((price) => {
        const found = variant.prices?.find(
          (p) =>
            p.value.currencyCode === price.currency &&
            p.country === price.country
        );
        if (found) {
          return {
            id: found.id,
            country: found.country,
            value: {
              currencyCode: found.value.currencyCode,
              centAmount: price.centAmount,
            },
          };
        } else {
          return {
            country: price.country,
            value: {
              centAmount: price.centAmount,
              currencyCode: price.currency,
            },
          };
        }
      }),
    },
  };
  console.log(now, before);
  return syncProducts.buildActions(now, before);
};

export const useProductUpdater = () => {
  const [updateProduct, { loading }] = useMcMutation<
    TMutation,
    TMutation_UpdateProductArgs
  >(UpdateProduct);

  const execute = async ({
    actions,
    id,
    key,
    version,
    onCompleted,
    onError,
  }: {
    actions: NonNullable<Array<TProductUpdateAction>>;
    id?: string;
    key?: string;
    version: number;
    onCompleted?: () => void;
    onError?: (message?: string) => void;
  }) => {
    try {
      return await updateProduct({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          actions: actions,
          version: version,
          id: id,
          key: key,
        },
        onCompleted() {
          onCompleted && onCompleted();
        },
        onError({ message }) {
          onError && onError(message);
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};

export const useLazyProduct = () => {
  const [getProduct, { loading }] = useMcLazyQuery<
    TQuery,
    TQuery_ProductArgs & { skus?: Array<string> }
  >(RetrieveCustomObject);

  const execute = async ({
    id,
    key,
    skus,
    onCompleted,
    onError,
  }: {
    id?: string;
    key?: string;
    skus?: Array<string>;
    onCompleted?: () => void;
    onError?: (message?: string) => void;
  }) => {
    try {
      return await getProduct({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          id: id,
          key: key,
          skus: skus,
        },
        onCompleted() {
          onCompleted && onCompleted();
        },
        onError({ message }) {
          onError && onError(message);
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};
