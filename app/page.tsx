"use client";

import { useEffect, useMemo, useState } from "react";
import { getBookTestImage } from "./book-content";
import { audioSrc, captionsSrc, courseTests, lessons, type CourseLesson, type CourseTest } from "./course-data";
import LessonExercises from "./lesson-exercises";
import VoiceRecorder from "./voice-recorder";
import VocabularyImage from "./vocabulary-image";

type View = "home" | "lessons" | "lesson" | "test" | "vocabulary" | "cards" | "scenarios" | "exam" | "progress" | "settings";
type Progress = { lessons: string[]; tests: string[]; exercises: string[]; words: string[]; streak: number; minutes: number };
const emptyProgress: Progress = { lessons: [], tests: [], exercises: [], words: [], streak: 3, minutes: 68 };
const vocab = lessons.flatMap(lesson => lesson.words.map(([term, tr], i) => ({
  id: `${lesson.id}-w${i + 1}`, term, tr, imageIndex: i, unit: lesson.n,
  context: `Vocabulary Check · Unit ${lesson.n}: ${lesson.title}`,
  example: `Practice: explain “${term}” in the context of ${lesson.title.toLowerCase()}.`,
  cat: `Unit ${lesson.n}`,
})));

const scenarios = lessons.map(lesson => ({
  title: lesson.title, tag: `Unit ${lesson.n}`,
  situation: `${lesson.ru}. Отработайте учебную ситуацию: ${lesson.radioFocus}.`, roles: "Pilot ↔ ATC",
  lines: lesson.phrases.map((line,i)=>[i % 2 ? "ATC" : "PILOT",line]),
  task: `Продолжите обмен репликами: уточните проблему, подтвердите критические данные и сообщите намерения. Цель: ${lesson.objective}`,
  checks: ["Назвал позывной","Проблема сформулирована ясно","Критические данные подтверждены","Намерения и результат сообщены"],
}));

const criteria = [
  ["PR", "Pronunciation", "Произношение", "Речь понятна международному собеседнику; акцент редко мешает смыслу."],
  ["ST", "Structure", "Структура", "Базовые конструкции контролируются; ошибки не искажают смысл."],
  ["VO", "Vocabulary", "Лексика", "Запаса хватает для знакомых и неожиданных рабочих ситуаций."],
  ["FL", "Fluency", "Беглость", "Темп устойчивый, переход от заученной речи к спонтанной возможен."],
  ["CO", "Comprehension", "Понимание", "Основной смысл и детали обычно понимаются, включая усложнение ситуации."],
  ["IN", "Interactions", "Взаимодействие", "Ответы быстрые, уместные; проверка и уточнение понимания эффективны."],
];

const nav: { id: View; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "⌂" }, { id: "lessons", label: "Уроки", icon: "▤" },
  { id: "vocabulary", label: "Лексика", icon: "A" }, { id: "scenarios", label: "Сценарии", icon: "◌" },
  { id: "exam", label: "Экзамен", icon: "✦" }, { id: "progress", label: "Прогресс", icon: "↗" },
];

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);
  const [selectedTest, setSelectedTest] = useState(courseTests[0]);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [card, setCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [examStep, setExamStep] = useState(0);
  const [dark, setDark] = useState(false);
  const [audio, setAudio] = useState(true);

  useEffect(() => { const saved = localStorage.getItem("icao-progress"); if (saved) {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate device-local progress once
    setProgress({...emptyProgress, ...JSON.parse(saved)});
  } }, []);
  useEffect(() => { localStorage.setItem("icao-progress", JSON.stringify(progress)); }, [progress]);
  const completion = Math.round(((progress.lessons.length + progress.tests.length + progress.words.length / vocab.length) / (lessons.length + courseTests.length + 1)) * 100);
  const markLesson = (id: string) => setProgress(p => ({ ...p, lessons: p.lessons.includes(id) ? p.lessons.filter(x => x !== id) : [...p.lessons, id] }));
  const openLesson = (lesson: CourseLesson) => { setSelectedLesson(lesson); setView("lesson"); };
  const openTest = (test: CourseTest) => { setSelectedTest(test); setView("test"); };
  const title = useMemo(() => nav.find(n => n.id === view)?.label ?? (view === "test" ? selectedTest.title : selectedLesson.title), [view, selectedLesson, selectedTest]);
  const selectedLessonIndex=lessons.findIndex(lesson=>lesson.id===selectedLesson.id);

  return <div className={dark ? "app dark" : "app"}>
    <aside className="sidebar">
      <button className="brand" onClick={() => setView("home")}><span className="brand-mark">A4</span><span><b>AERO ENGLISH</b><small>ICAO LEVEL 4</small></span></button>
      <nav>{nav.map(item => <button key={item.id} className={view === item.id || ((view === "lesson" || view === "test") && item.id === "lessons") || (view === "cards" && item.id === "vocabulary") ? "active" : ""} onClick={() => setView(item.id)}><i>{item.icon}</i><span>{item.label}</span></button>)}</nav>
      <div className="sidebar-progress"><div className="tiny-label">НЕДЕЛЬНАЯ ЦЕЛЬ <b>4/5</b></div><div className="bar"><span style={{width:"80%"}} /></div><small>Ещё одна практика до цели</small></div>
      <button className="settings-link" onClick={() => setView("settings")}>⚙ <span>Настройки</span></button>
    </aside>
    <main>
      <header><div><button className="mobile-logo" onClick={() => setView("home")}>A4</button><span className="eyebrow">ICAO LEVEL 4 TRAINER</span><h1>{title}</h1></div><div className="header-actions"><span className="streak">◆ {progress.streak} дня</span><button className="avatar" onClick={() => setView("settings")}>AK</button></div></header>

      {view === "home" && <Dashboard progress={progress} completion={completion} openLesson={openLesson} setView={setView} />}
      {view === "lessons" && <section className="page"><div className="course-summary"><b>30</b><span>тематических units</span><b>300</b><span>учебных заданий</span><b>8</b><span>контрольных тестов</span><b>{vocab.length}</b><span>терминов</span></div><div className="section-heading"><div><span className="eyebrow">ПОЛНЫЙ КУРС · UNITS 1-30</span><h2>Все разделы книги</h2></div><span className="pill">{progress.lessons.length}/{lessons.length} завершено</span></div><div className="lesson-list">{lessons.map(l => <button className="lesson-row" key={l.id} onClick={() => openLesson(l)}><span className={progress.lessons.includes(l.id) ? "lesson-num done" : "lesson-num"}>{progress.lessons.includes(l.id) ? "✓" : l.n}</span><span className="lesson-main"><b>{l.title}</b><small>{l.ru} · стр. {l.pages} · CD{l.cd}: {l.tracks.map(t=>`${l.cd}.${t}`).join(", ")}</small></span><span className="lesson-meta"><small>{l.time} мин</small><em>10 ЗАДАНИЙ</em></span><span className="arrow">→</span></button>)}</div><div className="section-heading"><div><span className="eyebrow">КОНТРОЛЬ</span><h2>Progress & review tests</h2></div><span className="pill">{progress.tests.length}/{courseTests.length} завершено</span></div><div className="test-grid">{courseTests.map(t=><button key={t.id} onClick={()=>openTest(t)} className={progress.tests.includes(t.id)?"done":""}><span>{progress.tests.includes(t.id)?"✓":"TEST"}</span><b>{t.title}</b><small>{t.scope} · стр. {t.pages}</small><em>CD{t.cd}: {t.tracks.map(x=>`${t.cd}.${x}`).join(", ")}</em></button>)}</div><SourceNote /></section>}
      {view === "lesson" && <Lesson lesson={selectedLesson} progress={progress} setProgress={setProgress} completed={progress.lessons.includes(selectedLesson.id)} onComplete={() => markLesson(selectedLesson.id)} back={() => setView("lessons")} audio={audio} previous={selectedLessonIndex>0?()=>openLesson(lessons[selectedLessonIndex-1]):undefined} next={selectedLessonIndex<lessons.length-1?()=>openLesson(lessons[selectedLessonIndex+1]):undefined} />}
      {view === "test" && <CourseTestPage test={selectedTest} progress={progress} setProgress={setProgress} audio={audio} back={()=>setView("lessons")} />}
      {view === "vocabulary" && <Vocabulary progress={progress} setProgress={setProgress} startCards={() => {setCard(0); setFlipped(false); setView("cards")}} />}
      {view === "cards" && <Cards card={card} flipped={flipped} setFlipped={setFlipped} progress={progress} setProgress={setProgress} next={() => {setCard((card+1)%vocab.length);setFlipped(false)}} />}
      {view === "scenarios" && <Scenarios />}
      {view === "exam" && <Exam step={examStep} setStep={setExamStep} />}
      {view === "progress" && <ProgressPage progress={progress} completion={completion} />}
      {view === "settings" && <Settings dark={dark} setDark={setDark} audio={audio} setAudio={setAudio} reset={() => setProgress({...emptyProgress,streak:0,minutes:0})} />}
    </main>
    <nav className="bottom-nav">{nav.slice(0,5).map(item => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}><i>{item.icon}</i><span>{item.label}</span></button>)}</nav>
  </div>;
}

function Dashboard({progress,completion,openLesson,setView}:{progress:Progress;completion:number;openLesson:(l:CourseLesson)=>void;setView:(v:View)=>void}) {
  return <section className="page dashboard">
    <div className="hero-grid"><div className="welcome"><span className="eyebrow">ДОБРЫЙ ВЕЧЕР, ALEX</span><h2>Продолжим держать<br/>курс на Level 4.</h2><p>Сегодня — опасное сближение и точные способы уточнить информацию.</p><button className="primary" onClick={() => openLesson(lessons[0])}>Начать практику <span>→</span></button><div className="radar" aria-hidden="true"><span/><i>✈</i></div></div>
      <div className="score-card"><div className="score-top"><span className="eyebrow">ОБЩИЙ ПРОГРЕСС</span><b>{completion}%</b></div><div className="ring" style={{"--p":`${completion*3.6}deg`} as React.CSSProperties}><div><b>{completion}</b><small>процентов</small></div></div><div className="score-stats"><span><b>{progress.lessons.length}/30</b><small>units</small></span><span><b>{progress.words.length}</b><small>слов</small></span><span><b>{progress.tests.length}/8</b><small>тестов</small></span></div></div></div>
    <div className="section-heading"><div><span className="eyebrow">СЛЕДУЮЩИЙ ШАГ</span><h2>Рекомендовано сегодня</h2></div><button className="text-btn" onClick={() => setView("lessons")}>Все уроки →</button></div>
    <button className="next-lesson" onClick={() => openLesson(lessons.find(l=>!progress.lessons.includes(l.id)) ?? lessons[0])}><span className="lesson-index">{(lessons.find(l=>!progress.lessons.includes(l.id)) ?? lessons[0]).n}<small>UNIT</small></span><span className="lesson-copy"><em>10 ЗАДАНИЙ · LISTENING + SPEAKING</em><b>{(lessons.find(l=>!progress.lessons.includes(l.id)) ?? lessons[0]).title}</b><small>{(lessons.find(l=>!progress.lessons.includes(l.id)) ?? lessons[0]).objective}</small><span><mark>COMPREHENSION</mark><mark>INTERACTIONS</mark></span></span><span className="play">▶</span></button>
    <div className="quick-grid"><button onClick={() => setView("vocabulary")}><i>Aa</i><span><b>Лексика</b><small>{vocab.length-progress.words.length} слов к повторению</small></span><em>→</em></button><button onClick={() => setView("scenarios")}><i>↔</i><span><b>Сценарии</b><small>Диалоги Pilot — ATC</small></span><em>→</em></button><button onClick={() => setView("exam")}><i>✦</i><span><b>Экзамен</b><small>Пробная сессия</small></span><em>→</em></button></div>
    <section className="criteria"><div className="section-heading"><div><span className="eyebrow">ШКАЛА ICAO</span><h2>Шесть навыков Level 4</h2></div></div><div className="criteria-grid">{criteria.map(c=><div key={c[0]}><span>{c[0]}</span><b>{c[1]}</b><small>{c[2]}</small><p>{c[3]}</p></div>)}</div><p className="method-note">ⓘ Краткие формулировки критериев — методическое резюме, не официальный текст шкалы ICAO.</p></section>
  </section>;
}

function Lesson({lesson,completed,onComplete,back,audio,progress,setProgress,previous,next}:{lesson:CourseLesson;completed:boolean;onComplete:()=>void;back:()=>void;audio:boolean;progress:Progress;setProgress:React.Dispatch<React.SetStateAction<Progress>>;previous?:()=>void;next?:()=>void}) {
  const toggleTask=(id:string)=>setProgress(p=>({...p,exercises:p.exercises.includes(id)?p.exercises.filter(x=>x!==id):[...p.exercises,id]}));
  const done=Array.from({length:10},(_,i)=>progress.exercises.includes(`${lesson.id}-e${i+1}`)).filter(Boolean).length;
  return <section className="page narrow"><button className="back" onClick={back}>← К полному курсу</button><div className="lesson-hero"><span>{lesson.n}</span><div><em>Книга, стр. {lesson.pages} · CD{lesson.cd}: {lesson.tracks.map(t=>`${lesson.cd}.${t}`).join(", ")}</em><h2>{lesson.title}</h2><p>{lesson.objective}</p></div></div>
    <div className="unit-status"><span><b>{done}/10</b> заданий выполнено</span><div><i style={{width:`${done*10}%`}}/></div></div>
    <LessonExercises key={lesson.id} lesson={lesson} audio={audio} completedIds={progress.exercises} onToggle={toggleTask}/>
    <div className="complete-unit"><span>{done}/10 заданий отмечено</span><button className={completed?"secondary complete":"primary"} onClick={onComplete}>{completed?"✓ Unit завершён":"Завершить unit"}</button></div>
    <nav className="unit-navigation" aria-label="Навигация между разделами"><button disabled={!previous} onClick={previous}>← {previous?`Unit ${String(Number(lesson.n)-1).padStart(2,"0")}`:"Первый unit"}</button><button disabled={!next} onClick={next}>{next?`Unit ${String(Number(lesson.n)+1).padStart(2,"0")} →`:"Последний unit"}</button></nav><SourceNote /></section>
}

function CourseTestPage({test,progress,setProgress,audio,back}:{test:CourseTest;progress:Progress;setProgress:React.Dispatch<React.SetStateAction<Progress>>;audio:boolean;back:()=>void}) {
  const complete=progress.tests.includes(test.id);
  const testIndex=courseTests.findIndex(item=>item.id===test.id);
  const toggle=()=>setProgress(p=>({...p,tests:complete?p.tests.filter(x=>x!==test.id):[...p.tests,test.id]}));
  const activities=["Describe the picture: 90 секунд без подготовки","Plain English: определить главную мысль","Listening for detail: записать факты и последовательность","Radiotelephony: восстановить проблему, инструкцию и readback","Clarification role-play и Vocabulary Check"];
  return <section className="page narrow"><button className="back" onClick={back}>← К списку тестов</button><div className="lesson-hero test-hero"><span>✓</span><div><em>Книга, стр. {test.pages} · {test.scope}</em><h2>{test.title}</h2><p>Контрольная работа по структуре книги: picture, Plain English, radiotelephony, clarification, vocabulary и discussion.</p></div></div><figure className="book-visual test-visual"><img src={getBookTestImage(testIndex)} alt={`Aviation situation for ${test.title}`}/><figcaption>Иллюстрация из {test.title} · стр. {test.pages}</figcaption></figure>{audio&&<div className="audio-playlist">{test.tracks.map((track,i)=><div className="audio-block" key={track}><div><span>▶</span><div><b>{test.cd}.{track}</b><small>{i===0?"Sample answer":i===1?"Plain English":"Radiotelephony"}</small></div></div><audio controls preload="none" src={audioSrc(test.cd,track)}><track kind="captions" srcLang="en" src={captionsSrc} label="Listening Script"/></audio></div>)}</div>}<div className="content-card"><span className="eyebrow">ЧЕК-ЛИСТ ТЕСТА</span>{activities.map((x,i)=><label className="test-activity" key={x}><input type="checkbox"/> <b>{i+1}.</b> {x}</label>)}</div><div className="content-card"><span className="eyebrow">SELF-ASSESSMENT</span><p>Оцените Pronunciation, Structure, Vocabulary, Fluency, Comprehension и Interactions. Это самооценка, а не официальный результат ICAO.</p><button className={complete?"secondary complete":"primary"} onClick={toggle}>{complete?"✓ Тест завершён":"Завершить тест"}</button></div></section>
}

function Vocabulary({progress,setProgress,startCards}:{progress:Progress;setProgress:React.Dispatch<React.SetStateAction<Progress>>;startCards:()=>void}) { const [q,setQ]=useState(""); const filtered=vocab.filter(v=>(v.term+v.tr+v.cat).toLowerCase().includes(q.toLowerCase())); return <section className="page"><div className="section-heading"><div><span className="eyebrow">ACTIVE VOCABULARY</span><h2>Авиационная лексика</h2></div><button className="primary" onClick={startCards}>Режим карточек →</button></div><p className="section-guide"><b>Как учить:</b> посмотрите на картинку, произнесите английское слово, затем проверьте перевод. Кружок справа отмечает слово изученным.</p><div className="toolbar"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Поиск по термину или категории…"/><span>{progress.words.length}/{vocab.length} изучено</span></div><div className="vocab-grid">{filtered.map(v=><article key={v.id} className={progress.words.includes(v.id)?"learned":""}><VocabularyImage unit={v.unit} index={v.imageIndex} alt={`Иллюстрация к слову ${v.term}`}/><div><em>{v.cat}</em><button aria-label={progress.words.includes(v.id)?`Отметить ${v.term} для повторения`:`Отметить ${v.term} изученным`} onClick={()=>setProgress(p=>({...p,words:p.words.includes(v.id)?p.words.filter(x=>x!==v.id):[...p.words,v.id]}))}>{progress.words.includes(v.id)?"✓":"○"}</button></div><h3>{v.term}</h3><b>{v.tr}</b><blockquote>“{v.example}”</blockquote></article>)}</div><SourceNote /></section> }

function Cards({card,flipped,setFlipped,progress,setProgress,next}:{card:number;flipped:boolean;setFlipped:(x:boolean)=>void;progress:Progress;setProgress:React.Dispatch<React.SetStateAction<Progress>>;next:()=>void}) { const v=vocab[card]; return <section className="page narrow flash-page"><span className="eyebrow">КАРТОЧКА {card+1} ИЗ {vocab.length}</span><p className="card-guide">1. Посмотрите на картинку и назовите слово. 2. Нажмите карточку, чтобы проверить перевод. 3. Выберите «Повторить» или «Знаю».</p><button type="button" className={flipped?"flashcard flipped":"flashcard"} onClick={()=>setFlipped(!flipped)}><VocabularyImage unit={v.unit} index={v.imageIndex} alt={`Иллюстрация к слову ${v.term}`} className="flashcard-image"/><small>{v.cat}</small><h2>{flipped?v.tr:v.term}</h2><p>{flipped?v.context:"Нажмите, чтобы увидеть перевод"}</p>{flipped&&<blockquote>“{v.example}”</blockquote>}</button><div className="flash-actions"><button onClick={next}>Повторить</button><button className="primary" onClick={()=>{setProgress(p=>({...p,words:p.words.includes(v.id)?p.words:[...p.words,v.id]}));next()}}>Знаю →</button></div><p className="center-note">Отмечено изученными: {progress.words.length}</p></section> }

function Scenarios(){
  const [active,setActive]=useState(0);
  const [answer,setAnswer]=useState("");
  const [hint,setHint]=useState(false);
  const s=scenarios[active];
  const starters=["Confirm…","Say again…","Request…","We intend to…"];
  const changeScenario=(index:number)=>{setActive(index);setAnswer("");setHint(false)};
  return <section className="page"><div className="section-heading"><div><span className="eyebrow">PILOT — ATC</span><h2>Тренировка радиообмена</h2></div></div>
    <div className="scenario-guide"><b>Что делать:</b><span><i>1</i>Выберите Unit</span><span><i>2</i>Вы — PILOT: ответьте на запрос диспетчера</span><span><i>3</i>Запишите голос, прослушайте и отметьте self-check</span></div>
    <label className="scenario-picker"><span>Ситуация</span><select value={active} onChange={event=>changeScenario(Number(event.target.value))}>{scenarios.map((x,i)=><option value={i} key={x.title}>{x.tag} · {x.title}</option>)}</select></label>
    <div className="tabs scenario-tabs">{scenarios.map((x,i)=><button className={active===i?"active":""} onClick={()=>changeScenario(i)} key={x.title}>{x.title}</button>)}</div>
    <div className="scenario-layout improved"><article className="content-card scenario-brief"><em className="tag">{s.tag}</em><h2>{s.title}</h2><p>{s.situation}</p><div className="role-badge"><b>ВАША РОЛЬ</b><span>PILOT</span></div><div className="dialogue"><small className="reference-title">ОПОРНЫЕ ФРАЗЫ ИЗ UNIT</small>{s.lines.map((l,i)=><div key={i}><b>PHRASE {i+1}</b><p>{l[1]}</p></div>)}<div className="current"><b>ATC</b><p>Confirm your problem, request and intentions.</p><small>Ответьте на этот запрос диспетчера ↓</small></div></div></article>
      <aside className="content-card scenario-workbench"><span className="eyebrow">ВАШ ОТВЕТ · PILOT</span><h3>Скажите одну короткую радиореплику</h3><p>Назовите позывной, подтвердите проблему, запросите нужное действие и сообщите намерение.</p><textarea value={answer} onChange={event=>setAnswer(event.target.value)} placeholder="Например: Tower, Speedbird 452, unsafe gear indication. Request low pass to confirm…"/><div className="starter-row"><span>Начать фразу:</span>{starters.map(x=><button key={x} onClick={()=>setAnswer(value=>`${value}${value?" ":""}${x}`)}>{x}</button>)}</div><button className="reveal standalone" onClick={()=>setHint(!hint)}>{hint?"Скрыть образец":"Показать образец ответа"}</button>{hint&&<div className="model-answer"><span>MODEL ANSWER</span><b>Speedbird 452, {s.lines[0]?.[1]} {s.lines[1]?.[1]} We intend to land as soon as practicable.</b></div>}<VoiceRecorder key={`scenario-${active}`} storageKey={`scenario-${active}`}/><hr/><span className="eyebrow">SELF-CHECK</span>{s.checks.map(x=><label key={x}><input type="checkbox"/> {x}</label>)}</aside></div><p className="method-note">ⓘ Сценарии — дополнительные методические задания, составленные по формату книги. Не являются официальной фразеологией для операционного использования.</p></section>}

function Exam({step,setStep}:{step:number;setStep:(n:number)=>void}) {
  const prompts=[{k:"PART 1 · WARM-UP",t:"Aviation experience",q:"What makes communication difficult during a high-workload phase of flight? Give an example."},{k:"PART 2 · SITUATION",t:"Unexpected traffic",q:"You see converging traffic at the same altitude. Describe what you see, explain the risk and say what you would do."},{k:"PART 3 · INTERACTION",t:"Clarify the instruction",q:"ATC transmission is partly unreadable. Respond, identify what is missing and request confirmation."}];
  const [notes,setNotes]=useState(["","",""]);
  const [notesReady,setNotesReady]=useState(false);
  useEffect(()=>{
    try {
      const saved=localStorage.getItem("icao-exam-notes");
      if(saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate device-local exam notes
        setNotes(JSON.parse(saved));
      }
    } catch { localStorage.removeItem("icao-exam-notes") }
    setNotesReady(true);
  },[]);
  useEffect(()=>{if(notesReady)localStorage.setItem("icao-exam-notes",JSON.stringify(notes))},[notes,notesReady]);
  const p=prompts[step];
  return <section className="page narrow"><div className="exam-head"><div><span className="eyebrow">ПРОБНАЯ СЕССИЯ</span><h2>ICAO speaking practice</h2></div><span>{step+1} / {prompts.length}</span></div><div className="exam-progress"><span style={{width:`${(step+1)/prompts.length*100}%`}}/></div><article className="exam-card"><em>{p.k}</em><h2>{p.t}</h2><p>{p.q}</p><div className="timer">01:30 <small>рекомендуемое время</small></div><textarea value={notes[step]??""} onChange={event=>setNotes(notes.map((value,index)=>index===step?event.target.value:value))} placeholder="Краткие заметки для ответа…"/><VoiceRecorder key={`exam-${step}`} storageKey={`exam-${step}`} showSelfAssessment/></article><div className="self-check"><span className="eyebrow">ПРОВЕРЬТЕ ОТВЕТ</span>{criteria.slice(step===2?4:0,step===2?6:3).map(c=><label key={c[0]}><input type="checkbox"/> <b>{c[1]}</b> — {c[3]}</label>)}</div><div className="exam-nav"><button disabled={step===0} onClick={()=>setStep(step-1)}>← Назад</button><button className="primary" disabled={step===prompts.length-1} onClick={()=>setStep(step+1)}>Следующая часть →</button></div></section>
}

function ProgressPage({progress,completion}:{progress:Progress;completion:number}) { return <section className="page"><div className="section-heading"><div><span className="eyebrow">ВАШ БОРТОВОЙ ЖУРНАЛ</span><h2>Прогресс подготовки</h2></div><span className="pill">{completion}% курса</span></div><div className="metrics"><div><span>▤</span><b>{progress.lessons.length}/30</b><small>units завершено</small></div><div><span>✓</span><b>{progress.exercises.length}/300</b><small>заданий выполнено</small></div><div><span>✦</span><b>{progress.tests.length}/8</b><small>тестов завершено</small></div><div><span>A</span><b>{progress.words.length}/{vocab.length}</b><small>слов изучено</small></div></div><div className="content-card"><span className="eyebrow">НАВЫКИ ICAO · САМООЦЕНКА MVP</span><div className="skill-bars">{criteria.map((c,i)=><div key={c[0]}><span>{c[1]}</span><div><i style={{width:`${35+((i*11+progress.lessons.length*8)%42)}%`}}/></div><b>{35+((i*11+progress.lessons.length*8)%42)}%</b></div>)}</div><p className="method-note">Значения показывают активность в приложении, а не официальную оценку ICAO.</p></div></section> }

function Settings({dark,setDark,audio,setAudio,reset}:{dark:boolean;setDark:(x:boolean)=>void;audio:boolean;setAudio:(x:boolean)=>void;reset:()=>void}) { return <section className="page narrow"><div className="section-heading"><div><span className="eyebrow">ПАРАМЕТРЫ</span><h2>Настройки</h2></div></div><div className="settings-card"><label htmlFor="dark-theme"><span><b>Тёмная тема</b><small>Снизить яркость интерфейса</small></span><input id="dark-theme" aria-label="Тёмная тема" type="checkbox" checked={dark} onChange={e=>setDark(e.target.checked)}/></label><label htmlFor="lesson-audio"><span><b>Аудио в уроках</b><small>Показывать локальные записи курса</small></span><input id="lesson-audio" aria-label="Аудио в уроках" type="checkbox" checked={audio} onChange={e=>setAudio(e.target.checked)}/></label><div className="settings-row"><span><b>Язык интерфейса</b><small>Русский</small></span><em>RU</em></div></div><div className="content-card danger"><h3>Сбросить прогресс</h3><p>Удалит завершённые уроки и изученные слова только на этом устройстве.</p><button onClick={reset}>Сбросить данные</button></div></section> }

function SourceNote(){return <p className="method-note">◉ Источник: все 30 units, Progress tests 1-6 и Review tests 1-2 книги <i>Check Your Aviation English</i>, стр. 8-83; аудио CD1-CD3. Формулировки заданий кратко адаптированы для приложения.</p>}
