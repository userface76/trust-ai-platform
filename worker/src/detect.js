export function analyze(text) {
  const patterns = [
    {re:/원금\s*보장|수익\s*보장|guaranteed\s*(profit|return)/i,reason:'수익 또는 원금 보장을 주장합니다.',weight:3},
    {re:/안전\s*계좌|safe\s*account|송금\s*하(세|십)요|transfer\s*(money|funds)/i,reason:'금전 송금이나 안전계좌를 요구합니다.',weight:3},
    {re:/비밀번호|인증번호|otp|seed\s*phrase|passphrase|복구\s*문구|개인키/i,reason:'민감한 인증정보를 요구하거나 언급합니다.',weight:3},
    {re:/즉시|긴급|오늘\s*안에|지금\s*바로|immediately|urgent/i,reason:'긴급성을 강조해 판단을 재촉합니다.',weight:1},
    {re:/배송\s*오류|주소\s*수정|택배|delivery\s*failed/i,reason:'배송 관련 안내로 행동을 유도할 수 있습니다.',weight:1},
    {re:/https?:\/\/[^\s]+|\b[a-z0-9-]+\.(?:com|net|org|xyz|top|click|site)\b/i,reason:'링크가 포함되어 있습니다. 링크의 실제 평판은 조회하지 않았습니다.',weight:1}
  ];
  const hits=patterns.filter(p=>p.re.test(text));
  const score=hits.reduce((s,p)=>s+p.weight,0);
  const level=score>=4?'high':score>=2?'caution':hits.length?'caution':'unknown';
  return {level,label:level==='high'?'높은 위험 징후':level==='caution'?'주의가 필요한 내용':'뚜렷한 규칙 기반 징후 미발견',summary:level==='unknown'?'일치하는 탐지 규칙이 없지만 안전함을 의미하지는 않습니다.':'아래 위험 신호가 감지되었습니다. 사기 여부가 확정된 것은 아닙니다.',reasons:hits.length?hits.map(x=>x.reason):['현재 등록된 제한적 탐지 규칙과 일치하지 않습니다.'],advice:'링크를 열거나 송금하지 말고 공식 앱·대표번호로 직접 확인하세요. 지갑 복구 문구와 OTP는 누구에게도 제공하지 마세요.',version:'rules-0.1.0'};
}