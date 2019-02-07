// @flow
import axios from 'axios';
import moment from 'moment';
import {isString} from 'lodash';
import {promisify} from 'bluebird';
import S3 from 'aws-sdk/clients/s3';
import stringify from 'json-stringify-safe';
import {errorNotificationUri, s3Option, s3BucketNameForError} from '../config/';
import {TIMEOUT, GMT} from '../../constants/';

export * from './sendEmail';

export type TErrorResults = Array<any> | Object | string;

export const createErrorMessage = (errorResults: TErrorResults) => {
  if (errorResults instanceof Error) {
    return errorResults.message;
  }
  if (isString(errorResults)) {
    return ((errorResults: any): string);
  }
  return stringify(errorResults, null, 2);
};

export const errorLogger = (errorResults: TErrorResults) => {
  const errorMessage = createErrorMessage(errorResults);
  console.error(errorMessage);
};

export const errorNotification = (errorResults: TErrorResults) => {
  const errorMessage = createErrorMessage(errorResults);
  const data = {
    username: 'idom-DN-car',
    icon_emoji: ':ghost:',
    text: errorMessage,
  };
  const config = {
    timeout: TIMEOUT,
  };
  return axios.post(errorNotificationUri(), data, config)
    .then(response => response.data)
    .catch((error) => {
      console.error(error);
      return error;
    })
    ;
};

export const getErrorParams = (errorData: string) => {
  const date = moment().add(GMT, 'hour').format('YYYY-MM-DD-HH-mm');

  const params = {
    ACL: 'authenticated-read',
    Body: errorData,
    Bucket: s3BucketNameForError(),
    Key: `${date}.xml`,
  };

  return params;
};

const s3Instance = new S3(s3Option());

export const putErrorObject = (errorResults: TErrorResults, s3: any = s3Instance) => {
  console.log('エラー時のXMLファイルをS3へバックアップ開始');
  const putObject = promisify(s3.putObject, {context: s3});
  const errorMessage = createErrorMessage(errorResults);
  const params = getErrorParams(errorMessage);
  return putObject(params)
    .then((data) => {
      console.log('エラー時のXMLファイルをS3へバックアップ開始完了');
      return data;
    })
    .catch((error) => {
      console.log('エラー時のXMLファイルをS3へバックアップ開始失敗');
      errorLogger(error);
      errorNotification(error);
      return error;
    })
    ;
};
