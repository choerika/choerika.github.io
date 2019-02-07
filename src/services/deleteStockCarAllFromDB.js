// @flow
import Promise from 'bluebird';

import type {APIResponse} from '../types';
import {errorLogger, errorNotification, putErrorObject, sendEmail, createDeleteErrorEmailText} from './errorHandler';
import type {TS3Object} from '../getUploadData';
import {statusCode} from './index';

type TdeleteQuery = (exhibitionId: string) => Promise<any>;

export const deleteStockCarDependencies =
(
  exhibitionId: string,
  deleteStockCarDependenciesList: Array<TdeleteQuery>,
) => {
  const promises = deleteStockCarDependenciesList
    .map(del => del(exhibitionId))
    .map(p => p.reflect());

  return Promise.all(promises)
    .then((results) => {
      const isOK = results.every(result => result.isFulfilled());
      const data = results.map(result => result._settledValueField);
      return {
        isOK,
        data,
      };
    })
    .then((results) => {
      if (!results.isOK) {
        throw results.data;
      }
      return results.data;
    })
    ;
};

export const deletePromise =
(
  s3Object: TS3Object,
  exhibitionId: string,
  deleteStockCarDependenciesList: Array<TdeleteQuery>,
  deleteStockCar: TdeleteQuery,
) => {
  console.log('DB', `exhibitionId${exhibitionId}を削除開始`);
  return deleteStockCarDependencies(exhibitionId, deleteStockCarDependenciesList)
    .then((results) => {
      return deleteStockCar ? deleteStockCar(exhibitionId) : results;
    })
    .then((results): APIResponse => {
      console.log('DB', `${exhibitionId}の削除が成功`);
      return {
        status: statusCode.Ok,
        message: '',
        data: results,
      };
    })
    .catch(async (error): Promise<APIResponse> => {
      console.log('DB', `${exhibitionId}の削除が失敗`);

      errorLogger(error);
      if (process.env.NODE_ENV !== 'development') {
        await errorNotification(error);
        await sendEmail(createDeleteErrorEmailText(s3Object, error));
        await putErrorObject(s3Object.fileContent.toString());
      }

      return {
        status: statusCode.InternalError,
        message: '',
        data: error,
      };
    })
    .catch((error) => {
      errorLogger(error);
    })
    ;
};

export const deleteStockCarAllFromDB =
  (
    s3Object: TS3Object,
    exhibitionIds: Array<string>,
    deleteStockCarDependenciesList: Array<TdeleteQuery>,
    deleteStockCar: any = null,
  ) => {
    const promises = exhibitionIds.map((exhibitionId) => {
      return deletePromise(
        s3Object,
        exhibitionId,
        deleteStockCarDependenciesList,
        deleteStockCar,
      );
    });

    return Promise.all(promises);
  };
