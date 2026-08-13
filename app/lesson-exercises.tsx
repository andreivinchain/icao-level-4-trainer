"use client";

import { useEffect, useMemo, useState } from "react";
import { getBookUnitContent } from "./book-content";
import { audioSrc, captionsSrc, type CourseLesson } from "./course-data";

type LessonExercisesProps = {
  lesson: CourseLesson;
  audio: boolean;
  completedIds: string[];
  onToggle: (id: string) => void;
};

type ExerciseCardProps = {
  id: string;
  number: number;
  tag: string;
  title: string;
  checked: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
};

function ExerciseCard({id,number,tag,title,checked,onToggle,children}:ExerciseCardProps) {
  return <article className={checked ? "exercise done" : "exercise"}>
    <button className="exercise-check" onClick={() => onToggle(id)} aria-label={checked ? "Отменить выполнение" : "Отметить выполненным"}>{checked ? "✓" : String(number).padStart(2,"0")}</button>
    <div className="exercise-body"><em>{tag}</em><h3>{title}</h3>{children}</div>
  </article>;
}

function LessonAudio({lesson,track,label}:{lesson:CourseLesson;track:string;label:string}) {
  return <div className="inline-audio"><span>▶</span><div><b>{lesson.cd}.{track}</b><small>{label}</small></div><audio controls preload="none" src={audioSrc(lesson.cd,track)}><track kind="captions" srcLang="en" src={captionsSrc} label="Listening Script"/></audio></div>;
}

function PhraseBuilder({phrases}:{phrases:string[]}) {
  const [phraseIndex,setPhraseIndex]=useState(0);
  const [chosen,setChosen]=useState<string[]>([]);
  const [result,setResult]=useState<"idle"|"correct"|"wrong">("idle");
  const phrase=phrases[phraseIndex] ?? "Confirm the instruction.";
  const tokens=useMemo(()=>{
    const source=phrase.split(/\s+/);
    const shift=Math.max(1,phraseIndex+2)%source.length;
    return [...source.slice(shift),...source.slice(0,shift)].map((word,index)=>({word,key:`${index}-${word}`}));
  },[phrase,phraseIndex]);
  const normalized=(value:string)=>value.toLowerCase().replace(/[^a-z0-9]/g,"");
  const check=()=>setResult(normalized(chosen.join(" "))===normalized(phrase)?"correct":"wrong");
  const next=()=>{setPhraseIndex((phraseIndex+1)%phrases.length);setChosen([]);setResult("idle")};
  return <div className="builder">
    <div className="builder-target">{chosen.length ? chosen.join(" ") : "Нажимайте слова в правильном порядке"}</div>
    <div className="token-row">{tokens.map(token=><button key={token.key} disabled={chosen.includes(token.word)} onClick={()=>{setChosen([...chosen,token.word]);setResult("idle")}}>{token.word}</button>)}</div>
    <div className="mini-actions"><button onClick={()=>{setChosen([]);setResult("idle")}}>Сбросить</button><button onClick={check}>Проверить</button><button onClick={next}>Следующая фраза →</button></div>
    {result!=="idle"&&<p className={result==="correct"?"feedback good":"feedback bad"}>{result==="correct"?"✓ Верно":"Попробуйте ещё раз"}{result==="wrong"&&<> · Образец: <b>{phrase}</b></>}</p>}
  </div>;
}

function VocabularyMatch({lesson}:{lesson:CourseLesson}) {
  const words=lesson.words.slice(0,4);
  const translations=[...words.map(([,ru])=>ru)].reverse();
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [checked,setChecked]=useState(false);
  const score=words.filter(([en,ru])=>answers[en]===ru).length;
  return <div className="match-grid">
    {words.map(([en,ru])=><label key={en}><b>{en}</b><select value={answers[en]??""} onChange={event=>{setAnswers({...answers,[en]:event.target.value});setChecked(false)}}><option value="">Выберите перевод…</option>{translations.map(option=><option key={option} value={option}>{option}</option>)}</select>{checked&&<small className={answers[en]===ru?"right":"wrong"}>{answers[en]===ru?"✓ Верно":`Ответ: ${ru}`}</small>}</label>)}
    <button className="secondary compact" onClick={()=>setChecked(true)}>Проверить совпадения</button>{checked&&<b className="match-score">{score}/4</b>}
  </div>;
}

function SpeakingTimer() {
  const [seconds,setSeconds]=useState(90);
  const [running,setRunning]=useState(false);
  const active=running&&seconds>0;
  useEffect(()=>{if(!active)return;const timer=window.setInterval(()=>setSeconds(value=>Math.max(0,value-1)),1000);return()=>window.clearInterval(timer)},[active]);
  const display=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  return <div className="speaking-timer"><b>{display}</b><button disabled={seconds===0} onClick={()=>setRunning(!active)}>{active?"Пауза":"Старт"}</button><button onClick={()=>{setSeconds(90);setRunning(false)}}>Сброс</button></div>;
}

export default function LessonExercises({lesson,audio,completedIds,onToggle}:LessonExercisesProps) {
  const content=getBookUnitContent(lesson.n);
  const [showModel,setShowModel]=useState<Record<number,boolean>>({});
  const [description,setDescription]=useState("");
  const [questionAnswers,setQuestionAnswers]=useState<string[]>(()=>content.pictureQuestions.map(()=>""));
  const [gistChoice,setGistChoice]=useState<number|null>(null);
  const [detailNotes,setDetailNotes]=useState<Record<string,string>>({});
  const [radioNotes,setRadioNotes]=useState<Record<string,string>>({});
  const [rolePlay,setRolePlay]=useState("");
  const [discussion,setDiscussion]=useState("");
  const correctPosition=Number(lesson.n)%3;
  const distractors=[
    `The report describes a routine ${lesson.title.toLowerCase()} operation with no safety concern.`,
    "The situation concerns only passenger service and requires no action from the flight crew.",
  ];
  const gistOptions=[...distractors];gistOptions.splice(correctPosition,0,content.gistSummary);
  const isDone=(number:number)=>completedIds.includes(`${lesson.id}-e${number}`);
  const toggleModel=(number:number)=>setShowModel({...showModel,[number]:!showModel[number]});
  const detailFields=["Event / situation","Evidence and numbers","Probable cause","Action and outcome"];
  const radioFields=["Problem","Request","ATC instruction","Readback / outcome"];

  return <div className="exercise-list rich-exercises">
    <ExerciseCard id={`${lesson.id}-e1`} number={1} tag="SPEAKING · BOOK 1A" title="Describe the picture" checked={isDone(1)} onToggle={onToggle}>
      <figure className="book-visual"><img src={content.image} alt={content.alt}/><figcaption>Иллюстрация из Unit {Number(lesson.n)} · стр. {lesson.pages}</figcaption></figure>
      <p>Describe only what you can see first. Then add careful hypotheses. Use: <b>{lesson.pictureWords.join(", ")}</b>.</p>
      <textarea value={description} onChange={event=>setDescription(event.target.value)} placeholder="Write or dictate your description in English…"/>
      <div className="response-meta"><span>{description.trim().split(/\s+/).filter(Boolean).length} words</span><button className="reveal" onClick={()=>toggleModel(1)}>{showModel[1]?"Скрыть образец":"Показать sample answer"}</button></div>
      {showModel[1]&&<blockquote className="model-answer"><span>MODEL ANSWER · адаптировано по аудиоскрипту {lesson.cd}.{lesson.tracks[0]}</span>{content.sampleAnswer}</blockquote>}
    </ExerciseCard>

    <ExerciseCard id={`${lesson.id}-e2`} number={2} tag="INTERACTION · BOOK 1B" title="Picture questions" checked={isDone(2)} onToggle={onToggle}>
      <div className="picture-question-layout"><img src={content.image} alt="Reference scene for the questions"/><div>{content.pictureQuestions.map((question,index)=><label key={question}><span><b>{index+1}</b>{question}</span><input value={questionAnswers[index]} onChange={event=>setQuestionAnswers(questionAnswers.map((value,i)=>i===index?event.target.value:value))} placeholder="Short answer in English…"/></label>)}</div></div>
      <div className="response-meta"><span>{questionAnswers.filter(value=>value.trim()).length}/5 answered</span><button className="reveal" onClick={()=>toggleModel(2)}>{showModel[2]?"Скрыть опору":"Показать answer frame"}</button></div>
      {showModel[2]&&<div className="answer-frame"><b>Answer frame</b><p>In the foreground I can see… · The aircraft appears to be… · This may have happened because… · The main risk is… · I expect that next…</p></div>}
    </ExerciseCard>

    <ExerciseCard id={`${lesson.id}-e3`} number={3} tag={`LISTENING ${lesson.cd}.${lesson.tracks[0]} · BOOK 1A`} title="Sample answer" checked={isDone(3)} onToggle={onToggle}>
      {audio&&<LessonAudio lesson={lesson} track={lesson.tracks[0]} label="Sample answer"/>}
      <p>Listen without reading first. On the second listening, identify three precise position descriptions and two examples of cautious speculation.</p>
      <div className="check-chips"><label><input type="checkbox"/> Position and direction</label><label><input type="checkbox"/> Visible evidence</label><label><input type="checkbox"/> May / might / appears</label><label><input type="checkbox"/> Predicted outcome</label></div>
      <button className="reveal standalone" onClick={()=>toggleModel(3)}>{showModel[3]?"Скрыть transcript":"Показать transcript и пример"}</button>
      {showModel[3]&&<blockquote className="model-answer"><span>LISTENING SCRIPT {lesson.cd}.{lesson.tracks[0]}</span>{content.sampleAnswer}</blockquote>}
    </ExerciseCard>

    <ExerciseCard id={`${lesson.id}-e4`} number={4} tag={`LISTENING ${lesson.cd}.${lesson.tracks[1]} · BOOK 2A`} title="Plain English — listening for gist" checked={isDone(4)} onToggle={onToggle}>
      {audio&&lesson.tracks[1]&&<LessonAudio lesson={lesson} track={lesson.tracks[1]} label="Plain English report"/>}
      <p>Choose the statement that best summarises the report.</p>
      <div className="quiz-options">{gistOptions.map((option,index)=><button className={gistChoice===index?(index===correctPosition?"selected correct":"selected incorrect"):""} onClick={()=>setGistChoice(index)} key={option}><span>{String.fromCharCode(65+index)}</span>{option}</button>)}</div>
      {gistChoice!==null&&<p className={gistChoice===correctPosition?"feedback good":"feedback bad"}>{gistChoice===correctPosition?"✓ Correct — this is the main operational point.":"Not quite. Listen for the problem, action and outcome."}</p>}
    </ExerciseCard>

    <ExerciseCard id={`${lesson.id}-e5`} number={5} tag={`LISTENING ${lesson.cd}.${lesson.tracks[1]} · BOOK 2B`} title="Plain English — listening for detail" checked={isDone(5)} onToggle={onToggle}>
      <p>Listen again and record concrete information. Do not write a general summary in every field.</p>
      <div className="notes-grid">{detailFields.map(field=><label key={field}><b>{field}</b><textarea value={detailNotes[field]??""} onChange={event=>setDetailNotes({...detailNotes,[field]:event.target.value})} placeholder="Names, figures, sequence or decision…"/></label>)}</div>
      <button className="reveal standalone" onClick={()=>toggleModel(5)}>{showModel[5]?"Скрыть ориентиры":"Сверить ключевые ориентиры"}</button>
      {showModel[5]&&<div className="answer-frame"><b>Key points to hear</b><p><strong>Situation:</strong> {content.gistSummary}</p><p><strong>Operational focus:</strong> {lesson.objective}</p></div>}
    </ExerciseCard>

    <ExerciseCard id={`${lesson.id}-e6`} number={6} tag={`RADIOTELEPHONY · ${lesson.tracks.slice(2).map(track=>`${lesson.cd}.${track}`).join(" / ")}`} title="Radiotelephony — listening" checked={isDone(6)} onToggle={onToggle}>
      {audio&&<div className="audio-stack">{lesson.tracks.slice(2).map(track=><LessonAudio key={track} lesson={lesson} track={track} label="Radiotelephony"/>)}</div>}
      <p><b>Scenario focus:</b> {lesson.radioFocus}. Complete the communication map while listening.</p>
      <div className="notes-grid radio-map">{radioFields.map(field=><label key={field}><b>{field}</b><input value={radioNotes[field]??""} onChange={event=>setRadioNotes({...radioNotes,[field]:event.target.value})} placeholder="What exactly was said?"/></label>)}</div>
      <div className="answer-frame"><b>Useful lines from this unit</b><ul>{lesson.phrases.map(phrase=><li key={phrase}>{phrase}</li>)}</ul></div>
    </ExerciseCard>

    <ExerciseCard id={`${lesson.id}-e7`} number={7} tag="STRUCTURE · BOOK 3B" title="Radiotelephony — phrase builder" checked={isDone(7)} onToggle={onToggle}>
      <p>Build the phrases from the dialogue. Punctuation is ignored during checking.</p><PhraseBuilder phrases={lesson.phrases}/>
    </ExerciseCard>

    <ExerciseCard id={`${lesson.id}-e8`} number={8} tag="INTERACTIONS · BOOK 4" title="Clarification role-play" checked={isDone(8)} onToggle={onToggle}>
      <p>Respond as the pilot. Identify the missing or unsafe information, request clarification and read back the critical instruction.</p>
      <div className="dialogue practice-dialogue"><div><b>ATC</b><p>{lesson.phrases[0]}</p></div><div><b>PILOT</b><textarea value={rolePlay} onChange={event=>setRolePlay(event.target.value)} placeholder="Your clarification and readback…"/></div></div>
      <div className="starter-row"><span>Quick inserts:</span>{["Say again…","Confirm…","Unable…","Request…"].map(starter=><button key={starter} onClick={()=>setRolePlay(`${rolePlay}${rolePlay?" ":""}${starter}`)}>{starter}</button>)}</div>
      <button className="reveal standalone" onClick={()=>toggleModel(8)}>{showModel[8]?"Скрыть диалог":"Показать model exchange"}</button>
      {showModel[8]&&<div className="dialogue model-dialogue">{lesson.phrases.map((phrase,index)=><div key={phrase}><b>{index%2?"ATC":"PILOT"}</b><p>{phrase}</p></div>)}</div>}
    </ExerciseCard>

    <ExerciseCard id={`${lesson.id}-e9`} number={9} tag="VOCABULARY · BOOK 5" title="Vocabulary Check" checked={isDone(9)} onToggle={onToggle}>
      <p>Match the terms and translations, then use two of the words in a short operational message.</p><VocabularyMatch lesson={lesson}/>
      <div className="word-chips">{lesson.words.slice(4).map(([en,ru])=><span key={en}><b>{en}</b>{ru}</span>)}</div>
    </ExerciseCard>

    <ExerciseCard id={`${lesson.id}-e10`} number={10} tag="FLUENCY · BOOK 6" title="Discussion — 90-second response" checked={isDone(10)} onToggle={onToggle}>
      <p>Speak about the causes, consequences, prevention and future changes connected with <b>{lesson.title}</b>.</p><SpeakingTimer/>
      <textarea value={discussion} onChange={event=>setDiscussion(event.target.value)} placeholder="Brief speaking notes in English…"/>
      <div className="answer-frame"><b>Model structure</b><ol><li>Describe the situation and immediate risk.</li><li>Explain one likely cause and one consequence.</li><li>Say what the crew or ATC should do.</li><li>Give one prevention or technology idea.</li></ol></div>
    </ExerciseCard>
  </div>;
}
