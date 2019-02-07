// @flow
import {assign} from 'lodash';
import {TIMEOUT} from '../../constants/';

export * from './database';

export const errorNotificationUri = () => {
  let uri;
  switch (process.env.NODE_ENV) {
    case 'development':
    case 'staging':
      uri = process.env.ERROR_NOTIFICATION_URI_LOCAL;
      break;
    case 'production':
      uri = process.env.ERROR_NOTIFICATION_URI_PRODUCTION;
      break;
    default:
  }
  return uri;
};

export const elasticsearchEndpoint = (): string => {
  let uri;
  switch (process.env.NODE_ENV) {
    case 'development':
      uri = process.env.ELASTICSEARCH_ENDPOINT_LOCAL;
      break;
    case 'staging':
      uri = process.env.ELASTICSEARCH_ENDPOINT_STAGING;
      break;
    case 'production':
      uri = process.env.ELASTICSEARCH_ENDPOINT_PRODUCTION;
      break;
    default:
  }
  return String(uri);
};

export const sesOption = () => {
  let option = {
    region: 'us-east-1',
    httpOptions: {timeout: TIMEOUT},
  };
  switch (process.env.NODE_ENV) {
    case 'development':
      option = assign({}, option, {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_LOCAL,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_LOCAL,
      });
      break;
    // no default
  }
  return option;
};

export const s3Option = () => {
  return {
    httpOptions: {timeout: TIMEOUT},
  };
};

export const sesToAddresses = () => {
  let addresses = [];
  switch (process.env.NODE_ENV) {
    case 'development':
      addresses = ((process.env.SES_TO_ADDRESSES_LOCAL: any): string).split(' ');
      break;
    case 'staging':
      addresses = ((process.env.SES_TO_ADDRESSES_STAGING: any): string).split(' ');
      break;
    case 'production':
      addresses = ((process.env.SES_TO_ADDRESSES_PRODUCTION: any): string).split(' ');
      break;
    // no default
  }
  return addresses;
};

export const s3BucketNameForError = () => {
  let name = [];
  switch (process.env.NODE_ENV) {
    case 'development':
      name = process.env.S3_BUCKET_NAME_FOR_ERROR_LOCAL;
      break;
    case 'staging':
      name = process.env.S3_BUCKET_NAME_FOR_ERROR_STAGING;
      break;
    case 'production':
      name = process.env.S3_BUCKET_NAME_FOR_ERROR_PRODUCTION;
      break;
    // no default
  }
  return name;
};
