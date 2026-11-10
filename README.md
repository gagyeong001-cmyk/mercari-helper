# 식완허브 메루카리 탐색

Node.js 18+ / Express 앱입니다.

Render Web Service 설정:
- Build command: `npm install`
- Start command: `npm start`
- 환경변수: `APIFY_TOKEN` (Apify API 토큰)

주의: 외부 Apify actor의 실제 입력 스키마와 반환값은 아직 검증되지 않았습니다. 토큰을 설정한 뒤 실제 메루카리 링크로 테스트해야 합니다. 외부 서비스 이용료가 발생할 수 있습니다.

목록은 브라우저 localStorage에 저장되며 CSV로 백업할 수 있습니다.