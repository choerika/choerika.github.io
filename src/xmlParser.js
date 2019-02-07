// @flow
import xml2js from 'xml2js';
import {promisify} from 'bluebird';
import {isArray} from 'lodash';
import {
  errorLogger,
  errorNotification,
  putErrorObject,
  sendEmail,
  createXmlParseErrorEmailText,
} from './services/';
import type {TS3Object} from './getUploadData';

export const noExistsID = (deleteList: any) => {
  if (!isArray(deleteList)) {
    return true;
  }
  const noExists = deleteList.every(exhibitNo => exhibitNo === '');
  return noExists;
};

export const xmlParser = (xmlData: string, s3Object: TS3Object) => {
  const parser = new xml2js.Parser();
  const parseString = promisify(parser.parseString, {context: parser});

  return parseString(xmlData)
    .then((results) => {
      // XMLデータからexhibit_noを抽出
      const deleteList = results.toroku_status_tbl.toroku_status.map((torokuStatus) => {
        return torokuStatus.exhibit_no[0];
      });
      return deleteList;
    })
    .catch(async (error) => {
      errorLogger(error);
      if (process.env.NODE_ENV !== 'development') {
        await errorNotification(error);
        await sendEmail(createXmlParseErrorEmailText(s3Object, error));
        await putErrorObject(s3Object.fileContent.toString());
      }
      return error;
    })
    ;
};
