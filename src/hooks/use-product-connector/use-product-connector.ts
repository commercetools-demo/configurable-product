/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import type { ApolloError } from '@apollo/client';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import RetrieveCustomObject from './fetch-product.ctp.graphql';
import { TProduct, TQuery, TQuery_ProductArgs} from "../../types/generated/ctp";

type RetrieveCustomObjectProps = {
  id?: string;
  key?: string;
};

type TUseRetrieveCustomObjectFetcher = (
    retrieveCustomObjectProps: RetrieveCustomObjectProps
) => {
  product: TProduct|undefined|null;
  error?: ApolloError;
  loading: boolean;
};
export const useRetrieveCustomObject:TUseRetrieveCustomObjectFetcher = ({id, key}) => {
  const { data, error, loading } = useMcQuery<
      TQuery,
      TQuery_ProductArgs
  >(RetrieveCustomObject, {
    variables: {
      id: id,
      key: key
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    product: data?.product,
    error,
    loading,
  };
};
