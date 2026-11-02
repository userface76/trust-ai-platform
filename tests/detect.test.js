import test from 'node:test';import assert from 'node:assert/strict';import {analyze} from '../worker/src/detect.js';
test('investment guarantee flagged',()=>assert.equal(analyze('원금 보장 수익 보장 오늘 바로 송금하세요').level,'high'));
test('neutral text never certified safe',()=>assert.equal(analyze('내일 오후 3시 회의').level,'unknown'));
test('wallet secret warning',()=>assert.ok(analyze('Pi wallet seed phrase 알려주세요').reasons.some(x=>x.includes('인증정보'))));