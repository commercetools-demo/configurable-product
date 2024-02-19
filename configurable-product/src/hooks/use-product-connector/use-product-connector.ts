/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import type { ApolloError, ApolloQueryResult } from '@apollo/client';
import {
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
  TQuery,
  TQuery_ProductArgs,
} from '../../types/generated/ctp';
import UpdateProduct from './update-product.ctp.graphql';
import { extractErrorFromGraphQlResponse } from '../../helpers';

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
