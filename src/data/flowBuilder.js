import { texts } from './content.js'
import { mysteries } from './mysteries.js'
import { novenaDays } from './novena.js'

/**
 * Build the flat flow array for a given session.
 * @param {string} mysteryKey - 'joyful' | 'luminous' | 'sorrowful' | 'glorious'
 * @param {number} novenaDay - 1..9
 */
export function buildFlow(mysteryKey, novenaDay) {
  const mysterySet = mysteries[mysteryKey]
  const novena = novenaDays[novenaDay - 1]
  const steps = []

  // ── 공통 시작기도 ──────────────────────────────────────────
  steps.push({
    id: 'start_guide',
    type: 'instruction',
    title: texts.opening.startGuide.title,
    body: texts.opening.startGuide.body,
    section: '공통 시작기도',
  })
  steps.push({
    id: 'sign_of_cross_guide',
    type: 'instruction',
    title: texts.opening.signOfCrossGuide.title,
    body: texts.opening.signOfCrossGuide.body,
    section: '공통 시작기도',
  })
  steps.push({
    id: 'holy_spirit_hymn',
    type: 'prayer',
    title: texts.opening.holySpiritHymn.title,
    body: texts.opening.holySpiritHymn.body,
    section: '공통 시작기도',
  })
  steps.push({
    id: 'apostles_creed_instruction',
    type: 'instruction',
    title: texts.opening.apostlesCreedInstruction.title,
    body: texts.opening.apostlesCreedInstruction.body,
    section: '공통 시작기도',
  })
  steps.push({
    id: 'apostles_creed',
    type: 'prayer',
    title: texts.opening.apostlesCreed.title,
    body: texts.opening.apostlesCreed.body,
    underline: texts.opening.apostlesCreed.underline,
    section: '공통 시작기도',
  })
  steps.push({
    id: 'prayer_reflection',
    type: 'instruction',
    title: texts.opening.prayerReflection.title,
    body: texts.opening.prayerReflection.body,
    section: '공통 시작기도',
  })
  steps.push({
    id: 'act_of_contrition',
    type: 'prayer',
    title: texts.opening.actOfContrition.title,
    body: texts.opening.actOfContrition.body,
    section: '공통 시작기도',
  })
  steps.push({
    id: 'undoer_prayer',
    type: 'prayer',
    title: texts.opening.undoerPrayer.title,
    body: texts.opening.undoerPrayer.body,
    section: '공통 시작기도',
  })

  // ── 묵주 준비기도 ──────────────────────────────────────────
  steps.push({
    id: 'intro_lords_prayer',
    type: 'prayer',
    title: texts.rosaryIntro.lordsPrayer.title,
    body: texts.rosaryIntro.lordsPrayer.body,
    section: '묵주 준비기도',
  })
  steps.push({
    id: 'intro_hail_mary_1',
    type: 'prayer',
    title: texts.rosaryIntro.hailMary.title,
    subtitle: '믿음을 위하여',
    body: texts.rosaryIntro.hailMary.body,
    section: '묵주 준비기도',
  })
  steps.push({
    id: 'intro_hail_mary_2',
    type: 'prayer',
    title: texts.rosaryIntro.hailMary.title,
    subtitle: '희망을 위하여',
    body: texts.rosaryIntro.hailMary.body,
    section: '묵주 준비기도',
  })
  steps.push({
    id: 'intro_hail_mary_3',
    type: 'prayer',
    title: texts.rosaryIntro.hailMary.title,
    subtitle: '사랑을 위하여',
    body: texts.rosaryIntro.hailMary.body,
    section: '묵주 준비기도',
  })
  steps.push({
    id: 'intro_glory_be_instruction',
    type: 'instruction',
    title: texts.rosaryIntro.gloryBeInstruction.title,
    body: texts.rosaryIntro.gloryBeInstruction.body,
    section: '묵주 준비기도',
  })
  steps.push({
    id: 'intro_glory_be',
    type: 'prayer',
    title: texts.rosaryIntro.gloryBe.title,
    body: texts.rosaryIntro.gloryBe.body,
    underline: texts.rosaryIntro.gloryBe.underline,
    section: '묵주 준비기도',
  })

  // ── 묵주 1~3단 ─────────────────────────────────────────────
  for (let i = 0; i < 3; i++) {
    const decade = mysterySet.decades[i]
    pushDecadeSteps(steps, decade, mysterySet, i + 1, mysteryKey)
  }

  // ── 9일기도 ────────────────────────────────────────────────
  steps.push({
    id: 'novena_title',
    type: 'novena_title',
    title: novena.title,
    mysterySetLabel: mysterySet.label,
    section: '9일기도',
  })
  steps.push({
    id: 'novena_meditation',
    type: 'novena_scripture',
    title: '성서 묵상',
    body: novena.meditation.text,
    source: novena.meditation.source,
    section: '9일기도',
  })
  steps.push({
    id: 'novena_petition',
    type: 'novena_prayer',
    title: '청원기도',
    body: novena.petition.text,
    alwaysOpen: true,
    section: '9일기도',
  })

  // ── 묵주 4~5단 ─────────────────────────────────────────────
  for (let i = 3; i < 5; i++) {
    const decade = mysterySet.decades[i]
    pushDecadeSteps(steps, decade, mysterySet, i + 1, mysteryKey)
  }

  // ── 마침기도 ───────────────────────────────────────────────
  steps.push({
    id: 'salve_regina',
    type: 'prayer',
    title: texts.closing.salveRegina.title,
    body: texts.closing.salveRegina.body,
    section: '마침기도',
  })
  steps.push({
    id: 'litany_of_loreto',
    type: 'prayer',
    title: texts.closing.litanyOfLoreto.title,
    body: texts.closing.litanyOfLoreto.body,
    section: '마침기도',
  })

  texts.closing.finalPrayers.forEach((p, idx) => {
    steps.push({
      id: `final_prayer_${idx}`,
      type: idx === texts.closing.finalPrayers.length - 1 ? 'final_sign_of_cross' : 'prayer',
      title: p.title,
      body: p.body,
      section: '마침기도',
    })
  })

  return steps
}

function pushDecadeSteps(steps, decade, mysterySet, decadeNumber, mysteryKey) {
  const section = `${decadeNumber}단 · ${mysterySet.label}`

  steps.push({
    id: `decade_${decadeNumber}_mystery`,
    type: 'mystery_announcement',
    decadeNumber,
    mysteryKey,
    mysteryLabel: mysterySet.label,
    title: decade.title,
    section,
    // collapsible blocks embedded
    descriptionBlock: {
      title: '신비 설명',
      body: mysterySet.description,
      defaultOpen: false,
    },
    scriptureBlock: {
      title: '성서 · 묵상',
      quote: decade.scripture.quote,
      source: decade.scripture.source,
      meditation: decade.meditation.text,
      defaultOpen: false,
    },
  })

  steps.push({
    id: `decade_${decadeNumber}_lords_prayer`,
    type: 'prayer',
    title: texts.rosaryIntro.lordsPrayer.title,
    body: texts.rosaryIntro.lordsPrayer.body,
    section,
  })

  steps.push({
    id: `decade_${decadeNumber}_beads`,
    type: 'beads',
    count: 10,
    prayerTitle: texts.rosaryIntro.hailMary.title,
    prayerBody: texts.rosaryIntro.hailMary.body,
    section,
  })

  steps.push({
    id: `decade_${decadeNumber}_glory_be_instruction`,
    type: 'instruction',
    title: texts.rosaryIntro.gloryBeInstruction.title,
    body: texts.rosaryIntro.gloryBeInstruction.body,
    section,
  })

  steps.push({
    id: `decade_${decadeNumber}_glory_be`,
    type: 'prayer',
    title: texts.rosaryIntro.gloryBe.title,
    body: texts.rosaryIntro.gloryBe.body,
    underline: texts.rosaryIntro.gloryBe.underline,
    section,
  })

  steps.push({
    id: `decade_${decadeNumber}_closing`,
    type: 'prayer',
    title: texts.decadeFixed.decadeClosingPrayer.title,
    body: texts.decadeFixed.decadeClosingPrayer.body,
    section,
  })
}
