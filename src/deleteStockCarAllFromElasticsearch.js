// @flow
import axios from 'axios';
import type {APIResponse} from './types';
import type {TS3Object} from './getUploadData';
import {createDeleteErrorEmailText} from './services/errorHandler';
import {
  statusCode,
  elasticsearchEndpoint,
  finishDeleting,
  errorLogger,
  errorNotification,
  sendEmail,
  putErrorObject,
} from './services';
import {TIMEOUT} from './constants';

export const deleteStockCarFromElasticsearch = (
  exhibitionId: string,
  s3Object: TS3Object,
): APIResponse => {
  console.log('Elasticsearch', `exhibitionId${exhibitionId}を削除開始`);
  const config = {
    timeout: TIMEOUT,
  };
  return axios.delete(elasticsearchEndpoint() + exhibitionId, config)
    .then((response) => {
      console.log('Elasticsearch', `${exhibitionId}の削除が成功`);
      return {
        status: statusCode.Ok,
        message: '',
        data: response.data,
      };
    })
    .catch(async (error) => {
      if (error.response && error.response.status === statusCode.NotFound) {
        console.log('Elasticsearch', `${exhibitionId}はテーブル内に存在しない`);
        return {
          status: statusCode.NotFound,
          message: error.statusText,
          data: error.response,
        };
      }
      console.log('Elasticsearch', `${exhibitionId}の削除が失敗`);

      const e = error.response || error.request || error.message || error.config;

      errorLogger(e);
      if (process.env.NODE_ENV !== 'development') {
        await errorNotification(e);
        await sendEmail(createDeleteErrorEmailText(s3Object, e));
        await putErrorObject(s3Object.fileContent.toString());
      }

      return {
        status: statusCode.InternalError,
        message: '',
        data: e,
      };
    })
    .catch((error) => {
      errorLogger(error);
    })
    ;
};

export const deleteStockCarAllFromElasticsearch = (
  exhibitionIds: Array<string>,
  s3Object: TS3Object,
) => {
  const promises = exhibitionIds.map((exhibitionId) => {
    return deleteStockCarFromElasticsearch(exhibitionId, s3Object);
  });
  return finishDeleting(Promise.all(promises));
};
