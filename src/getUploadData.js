// @flow
import {promisify} from 'bluebird';
import type {APIResponse} from './types';
import {statusCode} from './services';
import {errorLogger, errorNotification, sendEmail, createS3GetErrorEmailText} from './services/errorHandler';

export type TS3Data = {
  datetime: string;
  fileName: string;
}

export type TS3Object = TS3Data & {fileContent: string}

export type S3APIResponse = TS3Object & APIResponse;

export default (event: Object, s3: Object) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  const datetime = event.Records[0].eventTime;
  const get = promisify(s3.getObject, {context: s3});

  return get({Bucket: bucket, Key: key})
    .then((data): S3APIResponse => {
      return {
        status: statusCode.Ok,
        message: '',
        datetime,
        fileName: key,
        fileContent: data.Body,
      };
    })
    .catch(async (error): Promise<S3APIResponse> => {
      errorLogger(error);
      if (process.env.NODE_ENV !== 'development') {
        await errorNotification(`XML取得エラー\n${error}`);
        const s3Data: TS3Data = {
          datetime,
          fileName: key,
        };
        await sendEmail(createS3GetErrorEmailText(s3Data, error));
      }
      return {
        status: statusCode.InternalError,
        message: '',
        datetime: '',
        fileName: '',
        fileContent: '',
      };
    })
    ;
};
