import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios";

const questions = [
{
column:"FRUITS_VEGGIES",
title:"Nutrition & Energy",
emoji:"🥗",
priority:3,
description:"Healthy food can affect how energetic you feel during the day. Think about your usual eating habits and how they influence your energy while working or studying. Do you feel that eating healthy food gives you more energy?",
options:[
{label:"Yes, it helps a lot",value:10},
{label:"It helps somewhat",value:8},
{label:"Only a little",value:5},
{label:"No difference",value:2}
]},

{
column:"DAILY_STRESS",
title:"Stress Impact",
emoji:"😤",
priority:5,
description:"Everyone experiences stress in daily life. Sometimes this stress can affect relationships, mood, or personal time. To what extent does your daily stress affect your personal life?",
options:[
{label:"Very strongly",value:2},
{label:"Moderately",value:5},
{label:"A little",value:8},
{label:"Not at all",value:10}
]},

{
column:"PLACES_VISITED",
title:"Recreation Impact",
emoji:"🌿",
priority:3,
description:"Activities such as traveling, going out, or spending time in nature can help people relax. Think about the last time you took a break from your routine. Do these activities help you mentally relax and feel refreshed?",
options:[
{label:"Yes, completely",value:10},
{label:"Somewhat",value:8},
{label:"Only a little",value:5},
{label:"Not really",value:2}
]},

{
column:"CORE_CIRCLE",
title:"Emotional Support",
emoji:"🤝",
priority:4,
description:"Many people rely on close friends or family when they face difficulties. Think about the people you usually talk to when you feel stressed or worried. Do you feel emotionally supported when you share your problems?",
options:[
{label:"Always",value:10},
{label:"Often",value:8},
{label:"Rarely",value:5},
{label:"Never",value:2}
]},

{
column:"SUPPORTING_OTHERS",
title:"Helping Others",
emoji:"💛",
priority:2,
description:"Helping others can bring happiness and a sense of purpose, but it can also be tiring for some people. Think about how you usually feel after supporting someone emotionally or practically. What feeling best describes your experience?",
options:[
{label:"Very fulfilled and happy",value:10},
{label:"Somewhat happy",value:8},
{label:"Neutral",value:5},
{label:"Emotionally drained",value:2}
]},

{
column:"SOCIAL_NETWORK",
title:"Social Stress Reduction",
emoji:"👥",
priority:4,
description:"Spending time with friends, family, or colleagues can sometimes reduce stress. For some people it helps, while for others it may feel exhausting. Do your social connections usually help you reduce stress?",
options:[
{label:"Yes, significantly",value:10},
{label:"Sometimes",value:8},
{label:"Rarely",value:5},
{label:"They increase stress",value:2}
]},

{
column:"ACHIEVEMENT",
title:"Motivation from Achievements",
emoji:"🏆",
priority:3,
description:"Achieving goals at work, studies, or personal life can affect motivation. Think about how you usually feel after accomplishing something important. What feeling best describes your reaction?",
options:[
{label:"Highly motivated",value:10},
{label:"Slightly motivated",value:8},
{label:"Happy only temporarily",value:5},
{label:"No real difference",value:2}
]},

{
column:"DONATION",
title:"Helping Society",
emoji:"🌍",
priority:1,
description:"Some people feel a sense of purpose when they help others or contribute to society. This may include charity, volunteering, or supporting community causes. How does helping society usually make you feel?",
options:[
{label:"Very fulfilled",value:10},
{label:"Somewhat happy",value:8},
{label:"Neutral",value:5},
{label:"No impact",value:2}
]},

{
column:"BMI_RANGE",
title:"Health & Productivity",
emoji:"💪",
priority:4,
description:"Physical health can influence your daily energy, mood, and productivity. Think about your overall health and fitness level. Does your physical health affect how productive you are during the day?",
options:[
{label:"Very strongly",value:10},
{label:"Moderately",value:8},
{label:"Slightly",value:5},
{label:"Not at all",value:2}
]},

{
column:"TODO_COMPLETED",
title:"Work Pressure",
emoji:"📋",
priority:4,
description:"Sometimes unfinished tasks can create stress or anxiety. Think about days when you are unable to complete your planned work. How do you usually feel in that situation?",
options:[
{label:"Very anxious",value:2},
{label:"Slightly stressed",value:5},
{label:"Neutral",value:8},
{label:"Not concerned",value:10}
]},

{
column:"FLOW",
title:"Focus Impact",
emoji:"🎯",
priority:3,
description:"Sometimes people become deeply focused on their work and feel very productive. This state is often called being “in the flow.” When you are highly focused, how does work usually feel for you?",
options:[
{label:"Much easier",value:10},
{label:"Slightly easier",value:8},
{label:"No different",value:5},
{label:"Still stressful",value:2}
]},

{
column:"DAILY_STEPS",
title:"Exercise & Mood",
emoji:"🏃",
priority:3,
description:"Physical activity such as walking, exercise, or sports can affect mood and energy levels. Think about how you usually feel after being physically active. Does physical activity improve your mood?",
options:[
{label:"Significantly",value:10},
{label:"Moderately",value:8},
{label:"Slightly",value:5},
{label:"Not at all",value:2}
]},

{
column:"LIVE_VISION",
title:"Goal Clarity",
emoji:"🔭",
priority:2,
description:"Having clear goals can help people feel confident and organized in life. Think about your future plans and personal direction. Do clear goals help reduce your stress or worries?",
options:[
{label:"Strongly agree",value:10},
{label:"Agree",value:8},
{label:"Disagree",value:5},
{label:"Strongly disagree",value:2}
]},

{
column:"SLEEP_HOURS",
title:"Sleep Productivity",
emoji:"😴",
priority:4,
description:"Sleep plays an important role in both mental and physical health. When you do not get enough sleep, it can affect energy and productivity. How much does lack of sleep affect your productivity?",
options:[
{label:"Severely",value:2},
{label:"Moderately",value:5},
{label:"Slightly",value:8},
{label:"Not at all",value:10}
]},

{
column:"LOST_VACATION",
title:"Work Burnout",
emoji:"🏖️",
priority:5,
description:"Taking breaks or vacations helps many people recover from work pressure. Missing these breaks may lead to fatigue or burnout. When you miss opportunities to take breaks, how do you usually feel?",
options:[
{label:"Completely burnt out",value:2},
{label:"Slightly stressed",value:5},
{label:"Neutral",value:8},
{label:"No impact",value:10}
]},

{
column:"DAILY_SHOUTING",
title:"Emotional Reactions",
emoji:"💬",
priority:5,
description:"Everyone experiences frustration or anger occasionally. However, frequent emotional reactions may affect relationships with others. To what extent do these reactions affect your relationships?",
options:[
{label:"Very strongly",value:2},
{label:"Moderately",value:5},
{label:"Slightly",value:8},
{label:"Not at all",value:10}
]},

{
column:"SUFFICIENT_INCOME",
title:"Financial Stress",
emoji:"💰",
priority:3,
description:"Financial stability can influence peace of mind and daily stress levels. Think about how often money-related concerns affect your life. How often does financial pressure cause stress for you?",
options:[
{label:"Frequently",value:2},
{label:"Sometimes",value:5},
{label:"Rarely",value:8},
{label:"Never",value:10}
]},

{
column:"PERSONAL_AWARDS",
title:"Recognition Impact",
emoji:"🎖️",
priority:2,
description:"Being appreciated or recognized for your efforts can influence motivation and confidence. Think about how you feel when someone acknowledges your work. Does recognition increase your motivation?",
options:[
{label:"Strongly",value:10},
{label:"Moderately",value:8},
{label:"Slightly",value:5},
{label:"Not at all",value:2}
]},

{
column:"TIME_FOR_PASSION",
title:"Hobby Disconnect",
emoji:"🎨",
priority:3,
description:"Spending time on hobbies or activities you enjoy can help you relax and disconnect from work. These activities may include music, sports, art, or any personal interest. Do hobbies help you disconnect from work stress?",
options:[
{label:"Completely",value:10},
{label:"Somewhat",value:8},
{label:"Slightly",value:5},
{label:"Not at all",value:2}
]},

{
column:"WEEKLY_MEDITATION",
title:"Meditation Effect",
emoji:"🧘",
priority:3,
description:"Practices like meditation, prayer, or mindfulness can help people feel calmer and more focused. Think about your experience with such activities. Do they help reduce your stress?",
options:[
{label:"Significantly",value:10},
{label:"Slightly",value:8},
{label:"Very little",value:5},
{label:"Not at all",value:2}
]},

{
column:"AGE",
title:"Age",
emoji:"🎂",
description:"Please select the age group that best represents you.",
options:[
{label:"Under 20",value:2},
{label:"20–30",value:5},
{label:"30–45",value:8},
{label:"Above 45",value:10}
]},

{
column:"GENDER",
title:"Gender",
emoji:"🧬",
description:"Please select your gender.",
options:[
{label:"Male",value:0},
{label:"Female",value:1}
]}
];

const accents = [
  { pill:"#FFF0E6", text:"#B94D0A", border:"#FDBA74" },
  { pill:"#FEF9EC", text:"#92680A", border:"#FDE68A" },
  { pill:"#ECFDF5", text:"#065F46", border:"#6EE7B7" },
  { pill:"#EFF6FF", text:"#1D4ED8", border:"#93C5FD" },
  { pill:"#FDF4FF", text:"#7E22CE", border:"#D8B4FE" },
  { pill:"#FFF1F2", text:"#BE123C", border:"#FDA4AF" },
];

const variants = {
  enter:  (d) => ({ opacity:0, x: d>0 ? 36 : -36 }),
  center: {    opacity:1, x:0, transition:{ duration:0.24, ease:[0.4,0,0.2,1] } },
  exit:   (d) => ({ opacity:0, x: d>0 ? -20 : 20, transition:{ duration:0.17 } }),
};

export default function ModernQuestionnaire({ onComplete }) {
  const [step, setStep]         = useState(0);
  const [answers, setAnswers]   = useState({});
  const [dir, setDir]           = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState("");

  const q      = questions[step];
  const accent = accents[step % accents.length];
  const pct    = ((step + 1) / questions.length) * 100;
  const isLast = step === questions.length - 1;

  const handleSelect = async (value) => {
    const updated = { ...answers, [q.column]: value };
    setAnswers(updated);

    if (!isLast) {
      setDir(1);
      setTimeout(() => setStep(s => s + 1), 130);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const features = questions.map(qu => ({
        column:   qu.column,
        value:    updated[qu.column] ?? 0,
        priority: qu.priority ?? 1,
      }));
      const res = await axios.post("http://127.0.0.1:8000/predict", { features });
      const { score, label } = res.data;
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "analysis"), {
          userId: user.uid, inputs: updated, score, label,
          createdAt: serverTimestamp(),
        });
      }
      if (onComplete) onComplete();
    } catch (err) {
      console.error(err);
      setError("Submission failed — please try again.");
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (step === 0 || submitting) return;
    setDir(-1);
    setStep(s => s - 1);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .qp {
          height: calc(100vh - 64px);
          background: #F2F4F8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow: hidden;
        }
        .qs {
          width: 100%;
          max-width: 640px;
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* progress */
        .qpr { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; }
        .qpl { font-size:11px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#9CA3AF; }
        .qpn { font-size:12px; font-weight:600; color:#6B7280; }
        .qt  { height:4px; background:#E5E7EB; border-radius:99px; overflow:hidden; }
        .qf  { height:100%; background:linear-gradient(90deg,#4F6EF7,#7C3AED); border-radius:99px; transition:width .45s cubic-bezier(.4,0,.2,1); }

        /* card */
        .qcard {
          background:#fff;
          border-radius:20px;
          padding:36px 36px 28px;
          box-shadow:0 2px 6px rgba(0,0,0,.04),0 8px 28px rgba(0,0,0,.07);
          border:1px solid #ECEBE6;
          overflow:hidden;
        }

        /* pill */
        .qpill {
          display:inline-flex; align-items:center; gap:6px;
          padding:4px 11px; border-radius:99px;
          font-size:11px; font-weight:700; letter-spacing:.2px; border:1px solid;
          margin-bottom:12px;
        }

        /* question */
        .qq {
          font-family:'Lora',serif; font-size:19px; font-weight:600;
          color:#111827; line-height:1.4; margin-bottom:20px; letter-spacing:-.2px;
        }

        /* options */
        .qopts { display:flex; flex-direction:column; gap:8px; }
        .qopt {
          display:flex; align-items:center; gap:11px;
          padding:11px 15px; border-radius:11px;
          border:1.5px solid #EAECEF; background:#FAFAFA;
          cursor:pointer; transition:all .15s ease;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:14px;
          font-weight:500; color:#374151; text-align:left; width:100%; outline:none;
        }
        .qopt:hover { border-color:#C7D2FE; background:#F5F7FF; transform:translateY(-1px); box-shadow:0 3px 10px rgba(99,102,241,.09); }
        .qopt.qs2  { transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,.08); }

        /* radio dot */
        .qdot {
          width:17px; height:17px; border-radius:50%;
          border:2px solid #D1D5DB; flex-shrink:0;
          transition:all .15s; position:relative;
        }
        .qdot.on { border:none; }
        .qdot.on::after  { content:''; position:absolute; inset:0; border-radius:50%; background:currentColor; }
        .qdot.on::before { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:6px; height:6px; border-radius:50%; background:#fff; z-index:1; }

        /* nav */
        .qnav { display:flex; align-items:center; justify-content:space-between; margin-top:18px; }
        .qback {
          display:flex; align-items:center; gap:5px;
          padding:7px 14px; border-radius:9px;
          border:1.5px solid #E5E7EB; background:#fff; cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600; color:#6B7280;
          transition:all .15s;
        }
        .qback:hover:not(:disabled) { border-color:#A5B4FC; color:#4338CA; background:#EEF2FF; }
        .qback:disabled { opacity:.28; cursor:not-allowed; }

        .qdots { display:flex; gap:4px; align-items:center; }
        .qd    { height:5px; border-radius:99px; background:#E5E7EB; transition:all .3s; width:5px; }
        .qd.c  { width:18px; background:#4F46E5; }
        .qd.d  { background:#A5B4FC; }

        .qhint { text-align:center; font-size:11px; color:#C4CAD4; font-weight:500; margin-top:8px; }

        /* submitting */
        .qsub { display:flex; flex-direction:column; align-items:center; gap:14px; padding:36px 20px; font-size:14px; color:#6B7280; font-weight:500; }
        .qspin { width:30px; height:30px; border:3px solid #E5E7EB; border-top-color:#4F46E5; border-radius:50%; animation:qsp .7s linear infinite; }
        @keyframes qsp { to { transform:rotate(360deg); } }

        .qerr { text-align:center; color:#DC2626; font-size:12px; font-weight:500; }
      `}</style>

      <div className="qp">
        <div className="qs">

          {/* Progress */}
          <div>
            <div className="qpr">
              <span className="qpl">Assessment</span>
              <span className="qpn">{step + 1} / {questions.length}</span>
            </div>
            <div className="qt">
              <div className="qf" style={{ width:`${Math.max(pct,2)}%` }} />
            </div>
          </div>

          {/* Card */}
          <div className="qcard">
            {submitting ? (
              <div className="qsub">
                <div className="qspin" />
                Analyzing your responses…
              </div>
            ) : (
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit">

                  <div className="qpill" style={{ background:accent.pill, color:accent.text, borderColor:accent.border }}>
                    {q.title}
                  </div>

                  <div className="qq">{q.description}</div>

                  <div className="qopts">
                    {q.options.map((opt, i) => {
                      const sel = answers[q.column] === opt.value;
                      return (
                        <button
                          key={i}
                          className={`qopt${sel ? " qs2" : ""}`}
                          style={sel ? { background:accent.pill, borderColor:accent.border, color:accent.text } : {}}
                          onClick={() => handleSelect(opt.value)}
                        >
                          <div className={`qdot${sel ? " on" : ""}`} style={sel ? { color:accent.text } : {}} />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="qnav">
                    <button className="qback" onClick={goBack} disabled={step === 0}>← Back</button>

                    <div className="qdots">
                      {questions
                        .slice(Math.max(0, step-3), Math.min(questions.length, step+4))
                        .map((_, ri) => {
                          const ai = Math.max(0, step-3) + ri;
                          return <div key={ai} className={`qd ${ai===step?"c":ai<step?"d":""}`} />;
                        })}
                    </div>

                    <div style={{ width:64 }} />
                  </div>

                  {!answers[q.column] && <div className="qhint">Select an option to continue</div>}

                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {error && <div className="qerr">{error}</div>}

        </div>
      </div>
    </>
  );
}