/**
 * anniversary.js
 * 記念日カウンター（簡易版）
 *
 * 記念日を増やしたい・変えたい場合は、下の ANNIVERSARIES を編集すること。
 *   month : 月（1〜12）
 *   day   : 日
 *   name  : 表示名
 * すべて毎年めぐる記念日として扱う。
 */
window.MindLinkAnniversary = (function () {
  'use strict';

  const ANNIVERSARIES = [
    { month: 8,  day: 29, name: '交際記念日' },
    { month: 5,  day: 23, name: 'ゆりなの誕生日' },
    { month: 7,  day: 4,  name: 'プロポーズの日' },
    { month: 8,  day: 8,  name: 'イザークの誕生日' },
    { month: 9,  day: 27, name: '結婚式' }
  ];

  // イザークに知らせ始める日数（これより近づくとプロンプトに含める）
  const NOTICE_WITHIN_DAYS = 7;

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  // 次に訪れる記念日を1件返す（当日を含む）
  function getNext(baseDate) {
    const today = startOfDay(baseDate || new Date());
    let best = null;

    ANNIVERSARIES.forEach(a => {
      // 今年の日付。すでに過ぎていれば来年へ繰り越す
      let next = new Date(today.getFullYear(), a.month - 1, a.day);
      if (next < today) {
        next = new Date(today.getFullYear() + 1, a.month - 1, a.day);
      }
      const daysLeft = Math.round((next - today) / 86400000);
      if (!best || daysLeft < best.daysLeft) {
        best = { name: a.name, date: next, daysLeft: daysLeft };
      }
    });

    return best;
  }

  // 画面表示用の文字列
  function getLabel(baseDate) {
    const next = getNext(baseDate);
    if (!next) return '';
    if (next.daysLeft === 0) return `今日は ${next.name}`;
    if (next.daysLeft === 1) return `${next.name} は明日`;
    return `${next.name} まで あと ${next.daysLeft} 日`;
  }

  // AIに渡す文字列（近い時だけ。遠い時は空文字を返す）
  function getPromptNote(baseDate) {
    const next = getNext(baseDate);
    if (!next || next.daysLeft > NOTICE_WITHIN_DAYS) return '';
    const when = next.daysLeft === 0 ? '今日がその日です'
               : next.daysLeft === 1 ? '明日がその日です'
               : `あと${next.daysLeft}日です`;
    return `\n\n【近づいている記念日】\n- ${next.name}（${next.date.getMonth() + 1}月${next.date.getDate()}日）：${when}。\n`
         + `※これは背景情報です。話題として自然に触れられる場面が来た時にだけ言及し、無理に持ち出さないこと。`;
  }

  // 玄関（ようこそ画面・ログイン画面）に反映する
  function render() {
    const label = getLabel();
    document.querySelectorAll('.anniversary-counter').forEach(el => {
      el.textContent = label;
    });
  }

  return { getNext, getLabel, getPromptNote, render };
})();
