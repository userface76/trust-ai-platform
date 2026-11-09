# Pi App Studio ↔ TRUST AI Cloudflare link integration

## Goal
Keep the existing Pi App Studio chatbot unchanged. Add an external link to the independent Cloudflare analysis website. This is a **link integration**, not an SDK, account, chat-history, or payment integration.

## Destination URL
https://trust-ai-platform.userface76.workers.dev/?source=pi

The `source=pi` parameter only displays a Pi-specific entry notice. It does not authenticate Pi users or automatically transfer their chat content. Do not append chat messages, private data, or tokens to the URL.

## Suggested Pi App Studio chatbot response (Korean)

TRUST AI에서 의심스러운 문자, 광고 또는 투자 권유를 확인하고 싶으신가요? 아래 TRUST AI 3.0 분석 페이지를 열어 내용을 직접 입력해 주세요.

🔎 TRUST AI 3.0 분석하기
https://trust-ai-platform.userface76.workers.dev/?source=pi

분석 결과는 참고용 위험 신호이며 사기 여부를 확정하거나 안전을 보증하지 않습니다. 비밀번호, 인증번호, 주민등록번호, 지갑 복구 문구는 입력하지 마세요.

## Pi App Studio steps
1. Open your existing chatbot project in Pi App Studio.
2. Add the suggested response to its instructions, welcome message, or action/link field **if available**. The exact field names depend on the current App Studio interface.
3. Save and preview in Pi Browser. Confirm that the URL is clickable and opens in the intended browser context.
4. Test chatbot question → link → web analysis → result; verify that no private chat content is transferred.
5. If Pi App Studio disallows clickable external links, keep the plain URL in the chatbot response and check the currently supported app-link mechanism. Do not claim an embedded app is supported without testing.

## Next phase (not implemented)
Pi SDK auth with server-side token validation; Cloudflare D1/R2 case storage; community moderation; user-consented case handoff. Do not expose a Pi API key or access token in frontend code.
