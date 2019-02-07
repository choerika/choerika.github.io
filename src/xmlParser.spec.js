import test from 'ava';

import {xmlParser} from './xmlParser';
import {createErrorMessage} from '../src/services/errorHandler';
import {XML_DATA, XML_DATA_ERROR, XML_DELETE_LIST, XML_ERROR_MESSAGE} from '../test/mock/';

const XML_DATA_MISSING_STRUCTURE = `
<?xml version="1.0" encoding="Shift_JIS"?>
<toroku_status_tbl>
  <toroku_status>
    <exhibit_no>50855462</exhibit_no>
  </toroku_status>
  <toroku_status>
  </toroku_status>
</toroku_status_tbl>`;

const XML_DATA_MISSING_STRUCTURE_MESSAGE = "Cannot read property '0' of undefined";

test('XMLファイルのパースが正常に動作すること', async (t) => {
  const result = await xmlParser(XML_DATA);
  t.deepEqual(result, XML_DELETE_LIST);
});

test('XMLファイルのパースエラー時にエラーメッセージが返却されること', async (t) => {
  const result = await xmlParser(XML_DATA_ERROR);
  t.deepEqual(createErrorMessage(result), XML_ERROR_MESSAGE);
});

test('XMLファイルの項目が一部欠けている際にエラーメッセージが返却されること', async (t) => {
  const result = await xmlParser(XML_DATA_MISSING_STRUCTURE);
  t.deepEqual(createErrorMessage(result), XML_DATA_MISSING_STRUCTURE_MESSAGE);
});
