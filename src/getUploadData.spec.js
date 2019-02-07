import test from 'ava';
import getUploadData from './getUploadData';
import {XML_DATA} from '../test/mock/';

const GET_UPLOAD_DATA_SUCCESS = {
  Body: XML_DATA,
};

const event = {
  Records: [
    {
      s3: {
        bucket: {
          name: 'idom-dn-car-integration',
        },
        object: {
          key: '20170331114705_realtime_status_list.xml',
        },
      },
    },
  ],
};

const s3 = {
  getObject: (param, callback) => {
    callback('', GET_UPLOAD_DATA_SUCCESS);
  },
};

test('XMLファイルが正常に取得できること', async (t) => {
  const result = await getUploadData(event, s3);
  t.is(result.fileContent, XML_DATA);
});
