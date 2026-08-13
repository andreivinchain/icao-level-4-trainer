"use client";

import { useEffect, useRef, useState } from "react";

const ratingCriteria = [
  ["pronunciation", "Pronunciation", "Произношение"],
  ["structure", "Structure", "Структура"],
  ["vocabulary", "Vocabulary", "Лексика"],
  ["fluency", "Fluency", "Беглость"],
  ["comprehension", "Comprehension", "Понимание"],
  ["interactions", "Interactions", "Взаимодействие"],
] as const;

type VoiceRecorderProps = {
  storageKey: string;
  showSelfAssessment?: boolean;
};

type RecorderState = "idle" | "requesting" | "recording" | "ready" | "error";

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function recordingExtension(type: string) {
  if (type.includes("mp4")) return "m4a";
  if (type.includes("ogg")) return "ogg";
  return "webm";
}

export default function VoiceRecorder({storageKey,showSelfAssessment=false}:VoiceRecorderProps) {
  const [state,setState]=useState<RecorderState>("idle");
  const [seconds,setSeconds]=useState(0);
  const [recordingUrl,setRecordingUrl]=useState<string|null>(null);
  const [recordingType,setRecordingType]=useState("audio/webm");
  const [error,setError]=useState("");
  const [ratings,setRatings]=useState<Record<string,number>>({});
  const [ratingsReady,setRatingsReady]=useState(false);
  const recorderRef=useRef<MediaRecorder|null>(null);
  const streamRef=useRef<MediaStream|null>(null);
  const chunksRef=useRef<Blob[]>([]);
  const urlRef=useRef<string|null>(null);

  useEffect(()=>{
    if(state!=="recording") return;
    const timer=window.setInterval(()=>setSeconds(value=>value+1),1000);
    return()=>window.clearInterval(timer);
  },[state]);

  useEffect(()=>{
    try {
      const saved=localStorage.getItem(`icao-rating-${storageKey}`);
      if(saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate device-local self-assessment
        setRatings(JSON.parse(saved));
      }
    } catch {
      localStorage.removeItem(`icao-rating-${storageKey}`);
    }
    setRatingsReady(true);
  },[storageKey]);

  useEffect(()=>{
    if(ratingsReady) localStorage.setItem(`icao-rating-${storageKey}`,JSON.stringify(ratings));
  },[ratings,ratingsReady,storageKey]);

  useEffect(()=>()=>{
    if(recorderRef.current?.state==="recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach(track=>track.stop());
    if(urlRef.current) URL.revokeObjectURL(urlRef.current);
  },[]);

  const clearRecording=()=>{
    if(urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current=null;
    setRecordingUrl(null);
    setSeconds(0);
    setState("idle");
    setError("");
  };

  const startRecording=async()=>{
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined") {
      setError("Запись не поддерживается этим браузером. Откройте приложение в Safari или Chrome по HTTPS.");
      setState("error");
      return;
    }
    setState("requesting");
    setError("");
    setSeconds(0);
    if(urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current=null;
      setRecordingUrl(null);
    }
    try {
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      streamRef.current=stream;
      const preferredTypes=["audio/mp4","audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus"];
      const mimeType=preferredTypes.find(type=>MediaRecorder.isTypeSupported(type));
      const recorder=new MediaRecorder(stream,mimeType?{mimeType}:undefined);
      recorderRef.current=recorder;
      chunksRef.current=[];
      recorder.ondataavailable=event=>{if(event.data.size>0) chunksRef.current.push(event.data)};
      recorder.onstop=()=>{
        const type=recorder.mimeType||mimeType||"audio/webm";
        const blob=new Blob(chunksRef.current,{type});
        const url=URL.createObjectURL(blob);
        urlRef.current=url;
        setRecordingType(type);
        setRecordingUrl(url);
        setState("ready");
        stream.getTracks().forEach(track=>track.stop());
        streamRef.current=null;
      };
      recorder.start(250);
      setState("recording");
    } catch (caught) {
      const name=caught instanceof DOMException?caught.name:"";
      setError(name==="NotAllowedError"
        ?"Доступ к микрофону запрещён. Разрешите микрофон для этой страницы и попробуйте снова."
        :name==="NotFoundError"
          ?"Микрофон не найден. Подключите его и попробуйте снова."
          :"Не удалось начать запись. Проверьте микрофон и разрешения браузера.");
      setState("error");
      streamRef.current?.getTracks().forEach(track=>track.stop());
      streamRef.current=null;
    }
  };

  const stopRecording=()=>{
    if(recorderRef.current?.state==="recording") recorderRef.current.stop();
  };

  const average=Object.values(ratings).length
    ?(Object.values(ratings).reduce((sum,value)=>sum+value,0)/Object.values(ratings).length).toFixed(1)
    :null;

  return <section className="voice-practice">
    <div className="voice-heading"><div><span aria-hidden="true">●</span><b>Запись ответа</b><small>Запись остаётся на вашем устройстве и никуда не загружается.</small></div><strong>{formatTime(seconds)}</strong></div>
    <div className="voice-actions" aria-live="polite">
      {(state==="idle"||state==="error")&&<button className="record-start" onClick={startRecording}>🎙 Начать запись</button>}
      {state==="requesting"&&<button disabled>Запрашиваю микрофон…</button>}
      {state==="recording"&&<button className="record-stop" onClick={stopRecording}>■ Остановить и прослушать</button>}
      {recordingUrl&&<>
        {/* User-authored speech has no external caption source. */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio controls src={recordingUrl}/>
        <a className="record-download" href={recordingUrl} download={`icao-response.${recordingExtension(recordingType)}`}>Скачать</a>
        <button className="record-delete" onClick={clearRecording}>Удалить</button>
      </>}
    </div>
    {error&&<p className="record-error">{error}</p>}
    {recordingUrl&&<p className="record-note">Сохраните файл, если хотите оставить запись после закрытия страницы.</p>}
    {showSelfAssessment&&<div className="icao-rating">
      <div className="rating-heading"><div><b>Самооценка ICAO</b><small>Оцените этот ответ после прослушивания</small></div>{average&&<strong>{average}<small>/5</small></strong>}</div>
      <div className="rating-grid">{ratingCriteria.map(([key,en,ru])=><div key={key}><span><b>{en}</b><small>{ru}</small></span><div role="group" aria-label={`${en}: оценка от 1 до 5`}>{[1,2,3,4,5].map(value=><button key={value} className={ratings[key]===value?"selected":""} aria-label={`${en}: ${value} из 5`} onClick={()=>setRatings({...ratings,[key]:value})}>{value}</button>)}</div></div>)}</div>
      <p>Это учебная самооценка, а не официальный результат экзамена ICAO.</p>
    </div>}
  </section>;
}
