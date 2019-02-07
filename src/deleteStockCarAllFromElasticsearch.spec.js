// @flow
import test from 'ava';
import nock from 'nock';

import {EXHIBITION_ID, s3ObjectMock} from '../test/mock/';
import {elasticsearchEndpoint} from './services';
import {deleteStockCarFromElasticsearch} from './deleteStockCarAllFromElasticsearch';

test('個車削除を正常に実行することができる', async (t) => {
  nock(elasticsearchEndpoint() + EXHIBITION_ID).delete('').reply(200, 'ok');
  const result = await deleteStockCarFromElasticsearch(EXHIBITION_ID, s3ObjectMock);
  t.is(result.status, 200);
  t.is(result.data, 'ok');
});

test('削除対象の個車がテーブル内に存在していなかった場合のハンドリングができる', async (t) => {
  nock(elasticsearchEndpoint() + EXHIBITION_ID).delete('').reply(404, 'Not Found');
  const result = await deleteStockCarFromElasticsearch(EXHIBITION_ID, s3ObjectMock);
  t.is(result.status, 404);
  t.is(result.data.data, 'Not Found');
});

test('個車削除がエラーになった場合のハンドリングができる', async (t) => {
  nock(elasticsearchEndpoint() + EXHIBITION_ID).delete('').reply(500, 'Internal Error');
  const result = await deleteStockCarFromElasticsearch(EXHIBITION_ID, s3ObjectMock);
  t.is(result.status, 500);
  t.is(result.data.data, 'Internal Error');
});
