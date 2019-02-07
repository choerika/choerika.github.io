// @flow

import type {APIResponse} from '../types';
import {statusCode} from './index';
import {errorLogger} from './errorHandler';

export const finishDeleting = (
  promise: Promise<Array<APIResponse>>,
  dbConnection: {end: () => void} = {end: () => {} }) => {
  return promise
    .then((results: Array<APIResponse>) => {
      const isError = results.some(result => result.status === statusCode.InternalError);
      if (isError) {
        throw results;
      }
      console.log('すべての削除が成功');
      dbConnection.end();
      return results;
    })
    .catch(async (error) => {
      console.log('いずれかの削除が失敗');
      dbConnection.end();
      return error;
    })
    .catch((error) => {
      errorLogger(error);
    })
    ;
};
