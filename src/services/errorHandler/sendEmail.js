// @flow
import SES from 'aws-sdk/clients/ses';
import moment from 'moment';
import {promisify} from 'bluebird';
import {sesOption, sesToAddresses} from '../config/';
import {createErrorMessage} from './index';
import type {TErrorResults} from './index';
import type {TS3Object, TS3Data} from '../../getUploadData';
import {GMT} from '../../constants';

const createErrorEmailText = (s3Object: TS3Object | TS3Data, errorResults: TErrorResults) => {
  const s3DateTime = new Date(s3Object.datetime);
  const dateTime = moment(s3DateTime).add(GMT, 'hour').format('YYYY年MM月DD日 HH:mm');
  return `
    日時;
    ${dateTime}

    XMLファイル名;
    ${s3Object.fileName}

    エラーメッセージ詳細;
    ${createErrorMessage(errorResults)}
  `;
};

export const createDeleteErrorEmailText = (s3Object: TS3Object, errorResults: TErrorResults) => {
  const mainText = createErrorEmailText(s3Object, errorResults);
  return `
    落札済在庫の取り込みに失敗しました。下記にエラー内容の詳細をお知らせいたします。

    ${mainText}

    XMLファイル;
    \`\`\`xml
    ${s3Object.fileContent}
    \`\`\`
  `;
};

export const createXmlParseErrorEmailText = (s3Object: TS3Object, errorResults: TErrorResults) => {
  const mainText = createErrorEmailText(s3Object, errorResults);
  return `
    XMLファイルのパースに失敗しました。下記にエラー内容の詳細をお知らせいたします。

    ${mainText}

    XMLファイル;
    \`\`\`xml
    ${s3Object.fileContent}
    \`\`\`
  `;
};

export const createS3GetErrorEmailText = (s3Data: TS3Data, errorResults: TErrorResults) => {
  const mainText = createErrorEmailText(s3Data, errorResults);
  return `
    XMLファイルの取得に失敗しました。下記にエラー内容の詳細をお知らせいたします。

    ${mainText}
  `;
};

export const sendEmail = (emailText: string) => {
  console.log('下記アドレスへメール送信開始');
  console.log(sesToAddresses());

  const ses = new SES(sesOption());
  const send = promisify(ses.sendEmail, {context: ses});
  const params = {
    Destination: {
      ToAddresses: sesToAddresses(),
    },
    Source: process.env.SES_SOURCE,
    Message: {
      Subject: {
        Data: '落札済在庫の取り込みに失敗しました',
      },
      Body: {
        Text: {
          Data: emailText,
          Charset: 'utf-8',
        },
      },
    },
  };

  return send(params)
    .then((result) => {
      console.log('メール送信完了');
      return result;
    })
    .catch((sesError) => {
      console.log('メール送信失敗');
      console.error(sesError);
      return sesError;
    })
    ;
};
