# 네이버 메일 신규 매물 감시 (시험 버전)

1. 네이버 메일 PC 웹 설정에서 POP3/IMAP 및 SMTP 사용 설정을 확인하세요. 네이버 정책에 따라 외부 앱 비밀번호가 필요할 수 있습니다. 계정 비밀번호를 코드나 채팅에 공유하지 마세요.
2. GitHub 저장소 Settings → Secrets and variables → Actions → New repository secret에 `APIFY_TOKEN`, `NAVER_EMAIL`, `NAVER_SMTP_PASSWORD`를 등록하세요. `ALERT_EMAIL_TO`는 선택 사항이며 생략하면 같은 네이버 메일로 수신합니다.
3. `watch-config.json`에서 검색어와 최대 가격(엔), enabled:true를 설정합니다.
4. PR 병합 후 Actions → Mercari email watch → Run workflow로 수동 테스트합니다. 15분 예약 실행은 지연/누락될 수 있습니다.
5. 첫 성공 조회는 기존 매물을 기록만 하고 알림은 보내지 않습니다. 다음 조회부터 새로 발견한 조건 충족 매물을 알립니다.

**주의:** 네이버 SMTP 인증 가능 여부와 Apify 검색 입력/출력은 아직 실사용 검증되지 않았습니다. 외부 서비스 이용료, 네이버 SMTP 발송 제한, 메루카리 자동 수집 제한이 있을 수 있습니다. GitHub Actions 저장소 쓰기 권한이 필요합니다. 자동 감시는 아직 시작되지 않았습니다.
