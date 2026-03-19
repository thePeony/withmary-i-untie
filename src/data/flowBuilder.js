/**
 * flowBuilder.js
 * JSON 데이터를 읽어 기도 전체 흐름(blocks 배열)을 생성한다.
 * 각 block은 화면에 표시되는 하나의 카드 단위.
 */

import pack from './undoer_pack.json'

const { texts, mysteries, novenaDays } = pack

// ─── 요일 → 신비 키 ─────────────────────────────────────────
const WEEKDAY_MAP = pack.mysteryRule.weekdayMap
const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export function getMysteryKeyForDate(date = new Date()) {
  const key = WEEKDAY_KEYS[date.getDay()]
  return WEEKDAY_MAP[key]
}

// ─── 블록 생성 헬퍼 ──────────────────────────────────────────
let _idSeq = 0
function makeId(prefix) {
  return `${prefix}_${++_idSeq}`
}

function textBlock({ id, title, body, section, collapsible = false, defaultOpen = true }) {
  return { id: id || makeId('text'), type: 'text', title, body, section, collapsible, defaultOpen }
}

function rosaryBlock({ id, title, count = 10, section, collapsible = true, defaultOpen = true }) {
  return { id: id || makeId('rosary'), type: 'rosary', title, count, section, collapsible, defaultOpen }
}

// ─── 섹션별 블록 생성 ────────────────────────────────────────

function openingBlocks() {
  const t = texts.opening
  return [
    textBlock({ id: 'opening_startGuide',          title: t.startGuide.title,            body: t.startGuide.body,            section: '공통 시작기도' }),
    textBlock({ id: 'opening_signOfCross',          title: t.signOfCrossGuide.title,      body: t.signOfCrossGuide.body,      section: '공통 시작기도' }),
    textBlock({ id: 'opening_holySpiritHymn',       title: t.holySpiritHymn.title,        body: t.holySpiritHymn.body,        section: '공통 시작기도' }),
    textBlock({ id: 'opening_creedInstruction',     title: t.apostlesCreedInstruction.title, body: t.apostlesCreedInstruction.body, section: '공통 시작기도' }),
    textBlock({ id: 'opening_creed',                title: t.apostlesCreed.title,         body: t.apostlesCreed.body,         section: '공통 시작기도' }),
    textBlock({ id: 'opening_reflection',           title: t.prayerReflection.title,      body: t.prayerReflection.body,      section: '공통 시작기도' }),
    textBlock({ id: 'opening_contrition',           title: t.actOfContrition.title,       body: t.actOfContrition.body,       section: '공통 시작기도' }),
    textBlock({ id: 'opening_undoer',               title: t.undoerPrayer.title,          body: t.undoerPrayer.body,          section: '공통 시작기도' }),
  ]
}

function rosaryIntroBlocks() {
  const t = texts.rosaryIntro
  return [
    textBlock({ id: 'intro_lordsPrayer',   title: t.lordsPrayer.title,  body: t.lordsPrayer.body,  section: '묵주 준비 기도' }),
    textBlock({ id: 'intro_hailMary_1',    title: `${t.hailMary.title} 1`, body: t.hailMary.body, section: '묵주 준비 기도' }),
    textBlock({ id: 'intro_hailMary_2',    title: `${t.hailMary.title} 2`, body: t.hailMary.body, section: '묵주 준비 기도' }),
    textBlock({ id: 'intro_hailMary_3',    title: `${t.hailMary.title} 3`, body: t.hailMary.body, section: '묵주 준비 기도' }),
    textBlock({ id: 'intro_gloryInstruct', title: t.gloryBeInstruction.title, body: t.gloryBeInstruction.body, section: '묵주 준비 기도' }),
    textBlock({ id: 'intro_gloryBe',       title: t.gloryBe.title,      body: t.gloryBe.body,      section: '묵주 준비 기도' }),
  ]
}

function decadeBlocks(mysteryKey, decadeIndex) {
  const mystery = mysteries[mysteryKey]
  const decade = mystery.decades[decadeIndex]
  const t = texts.rosaryIntro
  const closing = texts.decadeFixed.decadeClosingPrayer
  const section = `${mystery.label} ${decadeIndex + 1}단`

  return [
    // 신비 선포
    textBlock({
      id: `decade_${mysteryKey}_${decadeIndex}_announcement`,
      title: `${decadeIndex + 1}단`,
      body: decade.title,
      section,
    }),
    // 신비 설명 (접기)
    textBlock({
      id: `decade_${mysteryKey}_${decadeIndex}_mysteryDesc`,
      title: '신비 설명',
      body: mystery.description,
      section,
      collapsible: true,
      defaultOpen: false,
    }),
    // 성서 · 묵상 (접기)
    textBlock({
      id: `decade_${mysteryKey}_${decadeIndex}_reflection`,
      title: '성서 · 묵상',
      body: `${decade.scripture.quote}\n\n— ${decade.scripture.source}\n\n${decade.meditation.text}`,
      section,
      collapsible: true,
      defaultOpen: true,
    }),
    // 주님의 기도
    textBlock({
      id: `decade_${mysteryKey}_${decadeIndex}_lordsPrayer`,
      title: t.lordsPrayer.title,
      body: t.lordsPrayer.body,
      section,
    }),
    // 성모송 10번 (묵주알)
    rosaryBlock({
      id: `decade_${mysteryKey}_${decadeIndex}_beads`,
      title: t.hailMary.title,
      count: 10,
      section,
      collapsible: true,
      defaultOpen: true,
    }),
    // 영광송 안내
    textBlock({
      id: `decade_${mysteryKey}_${decadeIndex}_gloryInstruct`,
      title: t.gloryBeInstruction.title,
      body: t.gloryBeInstruction.body,
      section,
    }),
    // 영광송
    textBlock({
      id: `decade_${mysteryKey}_${decadeIndex}_gloryBe`,
      title: t.gloryBe.title,
      body: t.gloryBe.body,
      section,
    }),
    // 단 끝 기도
    textBlock({
      id: `decade_${mysteryKey}_${decadeIndex}_closing`,
      title: closing.title,
      body: closing.body,
      section,
    }),
  ]
}

function novenaDayBlocks(dayNumber) {
  const novena = novenaDays[dayNumber - 1]
  const section = novena.title
  return [
    textBlock({
      id: `novena_${dayNumber}_meditation`,
      title: '묵상',
      body: `${novena.meditation.text}${novena.meditation.source ? `\n\n— ${novena.meditation.source}` : ''}`,
      section,
    }),
    textBlock({
      id: `novena_${dayNumber}_petition`,
      title: '청원기도',
      body: novena.petition.text,
      section,
    }),
  ]
}

function closingBlocks() {
  const c = texts.closing
  const section = '마침기도'
  return [
    textBlock({ id: 'closing_salveRegina',   title: c.salveRegina.title,   body: c.salveRegina.body,   section }),
    textBlock({ id: 'closing_litany',         title: c.litanyOfLoreto.title, body: c.litanyOfLoreto.body, section }),
    ...c.finalPrayers.map((p, i) =>
      textBlock({ id: `closing_final_${i}`,  title: p.title, body: p.body, section })
    ),
  ]
}

// ─── 전체 흐름 생성 ──────────────────────────────────────────
/**
 * @param {number} dayNumber - 1~9일차
 * @param {Date}   date      - 기도 날짜 (요일 → 신비 결정)
 * @returns {Array} blocks   - 전체 기도 블록 배열
 */
export function buildFlow(dayNumber = 1, date = new Date()) {
  _idSeq = 0
  const mysteryKey = getMysteryKeyForDate(date)

  return [
    ...openingBlocks(),                    // 공통 시작기도
    ...rosaryIntroBlocks(),                // 묵주 준비 기도
    ...decadeBlocks(mysteryKey, 0),        // 1단
    ...decadeBlocks(mysteryKey, 1),        // 2단
    ...decadeBlocks(mysteryKey, 2),        // 3단
    ...novenaDayBlocks(dayNumber),         // 9일기도
    ...decadeBlocks(mysteryKey, 3),        // 4단
    ...decadeBlocks(mysteryKey, 4),        // 5단
    ...closingBlocks(),                    // 마침기도
  ]
}

export { pack }
