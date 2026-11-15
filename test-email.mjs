import nodemailer from 'nodemailer';

for (const key of ['NAVER_EMAIL', 'NAVER_SMTP_PASSWORD']) {
  if (!process.env[key]) throw Error('Missing GitHub Actions secret: ' + key);
}
const transport = nodemailer.createTransport({
  host: 'smtp.naver.com',
  port: 465,
  secure: true,
  auth: { user: process.env.NAVER_EMAIL, pass: process.env.NAVER_SMTP_PASSWORD },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000
});
await transport.sendMail({
  from: process.env.NAVER_EMAIL,
  to: process.env.ALERT_EMAIL_TO || process.env.NAVER_EMAIL,
  subject: '🐰 메루카리 알림 테스트 성공',
  text: '식완허브 메루카리 신규 매물 알림용 네이버 메일 발송 테스트입니다. 실제 매물 알림은 아닙니다.'
});
console.log('Test email sent successfully');
