// @flow
import test from 'ava';
import nock from 'nock';
import stringify from 'json-stringify-safe';
import {errorNotificationUri} from '../config';
import {createErrorMessage, errorNotification, putErrorObject} from './index';

const errorMock = {
  data: 'error',
};

const errorArrayMock = ['error', 'error', 'error'];

const errorObject = new Error('error');

const PUT_ERROR_DATA_SUCCESS = {
  ETag: '"3835cfa3f25de08c4a351b7a47373a55"',
};

const s3 = {
  putObject: (param, callback) => {
    callback('', PUT_ERROR_DATA_SUCCESS);
  },
};

test('エラーメッセージを生成できる', (t) => {
  const result = createErrorMessage(errorMock);
  t.deepEqual(result, stringify(errorMock, null, 2));
});

test('配列からエラーメッセージが生成できる', (t) => {
  const result = createErrorMessage(errorArrayMock);
  t.is(result, stringify(errorArrayMock, null, 2));
});

test('エラーオブジェクトの場合はメッセージを返却', (t) => {
  const result = createErrorMessage(errorObject);
  t.is(result, errorObject.message);
});

test('Slackへの通知POSTリクエストを投げることができる', async (t) => {
  const dataMock = {
    username: 'idom-DN-car',
    icon_emoji: ':ghost:',
    text: stringify(errorMock, null, 2),
  };
  nock(errorNotificationUri()).post('', dataMock).reply(200, 'ok');
  const result = await errorNotification(errorMock);
  t.is(result, 'ok');
});

test('エラー発生時に別バケットにXMLファイルをPUTできる', async (t) => {
  const errorDataMock = 'string';
  const result = await putErrorObject(errorDataMock, s3);
  t.is(result, PUT_ERROR_DATA_SUCCESS);
});
