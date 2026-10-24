import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import logoImage from '../../images/jobfitlogo.png';
import { getInterview } from '../services/interview.api';

// Navigation items configuration
const sectionItems = [
  { id: 'technical', label: 'Technical Questions', icon: '</>' },
  { id: 'behavioral', label: 'Behavioral Questions', icon: '▱' },
  { id: 'roadmap', label: 'Road Map', icon: '➤' },
];

const severityBadgeStyles = {
  high: 'border-rose-200 bg-rose-50 text-rose-900',
  medium: 'border-amber-200 bg-amber-50 text-amber-900',
  low: 'border-emerald-200 bg-emerald-50 text-emerald-900',
};

// Component for rendering questions with collapsible answer views
function QuestionAccordion({ questions }) {
  const [activeAccordion, setActiveAccordion] = useState(null);

  if (!questions || questions.length === 0) {
    return <p className='py-8 text-sm text-slate-500 text-center'>No questions available in this section.</p>;
  }

  return (
    <div className='space-y-3'>
      {questions.map((item, index) => {
        const isExpanded = activeAccordion === index;
        return (
          <article 
            key={`${item.question}-${index}`} 
            className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-[#0BA4AC]/50 transition-all'
          >
            <button
              type='button'
              aria-expanded={isExpanded}
              onClick={() => setActiveAccordion(isExpanded ? null : index)}
              className='flex w-full items-center justify-between gap-3 bg-slate-50/50 px-4 py-3.5 text-left transition-colors hover:bg-[#0BA4AC]/5 hover:text-[#0BA4AC]'
            >
              <div className='flex items-center gap-3'>
                <span className='rounded-md bg-[#0BA4AC]/10 px-2.5 py-1 text-xs font-bold text-[#0BA4AC]'>
                  Q{index + 1}
                </span>
                <span className='text-sm font-semibold text-slate-800'>{item.question}</span>
              </div>
              <svg
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#0BA4AC]' : ''}`}
                viewBox='0 0 20 20'
                fill='currentColor'
                aria-hidden='true'
              >
                <path fillRule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.3a.75.75 0 01-1.08 0l-4.25-4.3a.75.75 0 01.02-1.06z' clipRule='evenodd' />
              </svg>
            </button>

            {isExpanded && (
              <div className='space-y-4 border-t border-slate-100 bg-white p-4 sm:p-5 transition-all'>
                <div>
                  <h4 className='mb-1 text-xs font-semibold uppercase tracking-wider text-[#0BA4AC]'>What this evaluates</h4>
                  <p className='text-sm leading-relaxed text-slate-600'>{item.intention}</p>
                </div>
                <div>
                  <h4 className='mb-1 text-xs font-semibold uppercase tracking-wider text-[#0BA4AC]'>Suggested answer</h4>
                  <p className='text-sm leading-relaxed text-slate-700'>{item.answer}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

// Component for rendering the preparation timeline
function PreparationRoadmap({ plan }) {
  if (!plan || plan.length === 0) {
    return <p className='py-8 text-sm text-slate-500 text-center'>No preparation plan available.</p>;
  }

  return (
    <div className='space-y-4'>
      {plan.map((dayItem, index) => (
        <article 
          key={`${dayItem.day}-${index}`} 
          className='rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5 hover:border-[#0BA4AC]/50 transition-all'
        >
          <div className='mb-3 flex items-center gap-3'>
            <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0BA4AC]/10 text-sm font-bold text-[#0BA4AC]'>
              {dayItem.day ?? index + 1}
            </span>
            <div>
              <span className='text-xs font-semibold uppercase tracking-wider text-[#0BA4AC]'>Day {dayItem.day ?? index + 1}</span>
              <h3 className='font-semibold text-slate-900'>{dayItem.focus}</h3>
            </div>
          </div>
          <ul className='space-y-2 pl-12'>
            {(dayItem.tasks || []).map((taskText, taskIndex) => (
              <li key={`${taskText}-${taskIndex}`} className='flex items-start gap-2 text-sm leading-relaxed text-slate-600'>
                <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0BA4AC]' />
                <span>{taskText}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

// Main Page Component
const Interview = () => {
  const { interviewId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const routeReport = location.state?.interviewReport;
  const [loadedReport, setLoadedReport] = useState(null);
  const [loadedInterviewId, setLoadedInterviewId] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [activeSection, setActiveSection] = useState('technical');

  const report = routeReport?._id === interviewId ? routeReport : loadedReport;
  const isLoading = routeReport?._id !== interviewId && loadedInterviewId !== interviewId;
  const errorMessage = loadError?.interviewId === interviewId ? loadError.message : '';

  useEffect(() => {
    if (routeReport?._id === interviewId) {
      return undefined;
    }

    let isMounted = true;
    getInterview(interviewId)
      .then((data) => {
        if (isMounted) setLoadedReport(data);
      })
      .catch((err) => {
        if (isMounted) {
          setLoadError({
            interviewId,
            message: err.response?.data?.message || 'Unable to load this interview report. Please try again.',
          });
        }
      })
      .finally(() => {
        if (isMounted) setLoadedInterviewId(interviewId);
      });

    return () => {
      isMounted = false;
    };
  }, [interviewId, routeReport]);

  const technicalQuestions = report?.technicalQuestions || [];
  const behavioralQuestions = report?.behavioralQuestions || [];
  const preparationPlan = report?.preprationPlan || report?.preparationPlan || [];

  const questionsMap = {
    technical: technicalQuestions,
    behavioral: behavioralQuestions,
  };

  const currentSectionLabel = sectionItems.find((s) => s.id === activeSection)?.label || 'Technical Questions';
  const matchScoreValue = Number(report?.matchScore) || 0;

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800'>
      {/* Header */}
      <header className='w-full bg-white border-b border-slate-200 py-3 px-6 flex items-center justify-between shadow-xs'>
        <Link to='/' aria-label='JobFit.AI home' className='flex items-center'>
          <img src={logoImage} alt='JobFit.AI' className='h-13 w-auto object-contain' />
        </Link>
        <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0BA4AC]/10 text-[#0BA4AC] border border-[#0BA4AC]/20'>
          Tailored Applications
        </span>
      </header>

      {/* Conditional Content States */}
      {isLoading ? (
        <main className='flex flex-1 items-center justify-center p-6'>
          <p role='status' className='text-sm font-medium text-slate-600'>Loading your interview analysis...</p>
        </main>
      ) : errorMessage ? (
        <main className='flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center'>
          <p role='alert' className='max-w-md text-sm text-rose-700'>{errorMessage}</p>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='rounded-xl bg-[#0BA4AC] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#007B94]'
          >
            Back to Home
          </button>
        </main>
      ) : (
        <main className='flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto'>
          {/* Main 3-Column Layout: Left Sidebar, Middle Content, Right Panel */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-6 items-start'>

            {/* 1. LEFT SIDEBAR: Navigation Sections */}
            <aside className='md:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm'>
              <h2 className='text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-3'>Sections</h2>
              <nav aria-label='Report sections' className='flex flex-col gap-1.5'>
                {sectionItems.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      type='button'
                      onClick={() => setActiveSection(section.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                        isActive
                          ? 'bg-[#0BA4AC] text-white shadow-sm shadow-[#0BA4AC]/20 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#0BA4AC]'}`} aria-hidden='true'>
                        {section.icon}
                      </span>
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* 2. MIDDLE CONTENT: Active Section Questions or Roadmap */}
              <section className='md:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-[calc(100vh-140px)] flex flex-col hover:border-[#0BA4AC]/50 transition-colors'>
                <div className='flex items-center justify-between pb-4 mb-4 border-b border-slate-100 shrink-0'>
                  <h1 className='text-lg font-bold text-slate-900'>{currentSectionLabel}</h1>
                    {activeSection !== 'roadmap' && (
                <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0BA4AC]/10 text-[#0BA4AC] border border-[#0BA4AC]/20'>
                {questionsMap[activeSection].length} questions
                </span>
                )}
                </div>

              {/* Scrollable content container with visible custom scrollbar */}
              <div className='area flex-1 overflow-y-auto pr-2 custom-scrollbar'>
                {activeSection === 'roadmap' ? (
                <PreparationRoadmap plan={preparationPlan} />
                ) : (
                <QuestionAccordion questions={questionsMap[activeSection]} />
                )}
              </div>
            </section>

            {/* 3. RIGHT PANEL: Match Score & Skill Gaps stacked */}
            <div className='md:col-span-3 flex flex-col gap-5'>

              {/* Match Score Card */}
              <div className='bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col items-center text-center hover:border-[#0BA4AC]/50 transition-colors'>
                <h2 className='w-full text-left text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4'>Match Score</h2>

                {/* Visual Conic Progress Indicator */}
                <div
                  className='flex h-24 w-24 items-center justify-center rounded-full p-2.5 shadow-inner'
                  style={{ background: `conic-gradient(#0BA4AC ${Math.min(Math.max(matchScoreValue, 0), 100)}%, #F1F5F9 0)` }}
                  role='img'
                  aria-label={`Match score ${matchScoreValue}%`}
                >
                  <div className='flex h-full w-full flex-col items-center justify-center rounded-full bg-white shadow-xs'>
                    <span className='text-2xl font-black text-slate-900 leading-none'>{matchScoreValue}%</span>
                  </div>
                </div>

                <p className='mt-3 text-xs font-medium text-slate-600'>
                  {matchScoreValue >= 80 ? 'Strong match for this role' : 'Room to strengthen your match'}
                </p>
              </div>

              {/* Skill Gaps Card */}
              <div className='bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-3 hover:border-[#0BA4AC]/50 transition-colors'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-xs font-semibold uppercase tracking-wider text-slate-400'>Skill Gaps</h2>
                <span className='text-xs font-bold text-slate-500'>{report?.skillGaps?.length || 0}</span>
                </div>

                {report?.skillGaps?.length ? (
                  <ul className='space-y-2'>
                    {report.skillGaps.map((gap, index) => {
                      const severityKey = gap.severity?.toLowerCase() || 'low';
                      return (
                        <li
                          key={`${gap.skill}-${index}`}
                          className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-medium ${severityBadgeStyles[severityKey] || 'border-slate-200 bg-slate-50 text-slate-700'}`}
                        >
                          <span className='font-semibold'>{gap.skill}</span>
                          <span className='uppercase text-[10px] tracking-wide opacity-75 font-bold'>{gap.severity}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className='text-xs text-slate-500 py-2'>No skill gaps identified.</p>
                )}
              </div>

            </div>

          </div>
        </main>
      )}
    </div>
  );
};

export default Interview;