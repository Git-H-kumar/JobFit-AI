import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import logoImage from '../../images/jobfitlogo.png'
import { generateInterview } from '../services/interview.api'

const Home = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('') // 👈 State to track selected file name

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFileName(file.name)
    } else {
      setFileName('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const report = await generateInterview(formData)
      navigate(`/interview/${report._id}`, { state: { interviewReport: report } })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to generate your interview report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800'>
      
      {/* Navbar / Header */}
      <header className='w-full bg-white border-b border-slate-200 py-3 px-6 flex items-center justify-between shadow-xs'>
        <div className='flex items-center gap-2.5'>
          <img 
            src={logoImage} 
            alt="JobFit.AI Logo" 
            className='h-13 w-auto object-contain' 
          />
        </div>
        <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0BA4AC]/10 text-[#0BA4AC] border border-[#0BA4AC]/20'>
          Tailored Applications
        </span>
      </header>

      {/* Main Content */}
      <main className='flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto flex flex-col'>
        <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-5 flex-1 w-full'>
          
          {/* Left Column: Job Description */}
          <div className='w-full md:w-1/3 flex flex-col bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-[#0BA4AC]/50 transition-colors'>
            <div className='flex items-center justify-between mb-3'>
              <label htmlFor="jobDescription" className='font-semibold text-slate-900 text-sm flex items-center gap-2'>
                <svg className="w-4 h-4 text-[#0BA4AC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Job Description
              </label>
              <span className='text-xs text-slate-400 font-medium'>Required</span>
            </div>
            <textarea 
              id="jobDescription"
              name="jobDescription" 
              placeholder='Paste the full job posting details here...' 
              className='area w-full flex-1 resize-none bg-slate-50/50 rounded-xl border border-slate-200 p-4 text-sm font-normal text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#0BA4AC] focus:bg-white focus:ring-3 focus:ring-[#0BA4AC]/10 transition-all'
            ></textarea>
          </div>

          {/* Right Column */}
          <div className='w-full md:w-2/3 flex flex-col gap-5 flex-1'>    

            {/* Self Description / Highlights */}
            <div className='flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-[#0BA4AC]/50 transition-colors'>
              <div className='flex items-center justify-between mb-3'>
                <label htmlFor="selfDescription" className='font-semibold text-slate-900 text-sm flex items-center gap-2'>
                  <svg className="w-4 h-4 text-[#0BA4AC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Self Description / Notes
                </label>
                <span className='text-xs text-slate-400 font-medium'>Required</span>
              </div>
              <textarea 
                id="selfDescription"
                name="selfDescription" 
                placeholder='Add key achievements, skills, or personal notes to emphasize...' 
                className='area w-full flex-1 resize-none bg-slate-50/50 rounded-xl border border-slate-200 p-4 text-sm font-normal text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#0BA4AC] focus:bg-white focus:ring-3 focus:ring-[#0BA4AC]/10 transition-all'
              ></textarea>
            </div>

            {/* Upload Resume Box */}
            <div className='bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-[#0BA4AC]/50 transition-colors'>
              <label 
                htmlFor="resume" 
                className='flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-[#0BA4AC]/5 hover:border-[#0BA4AC] transition-all text-center'
              >
                <svg className="w-8 h-8 text-[#0BA4AC] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                <span className='font-semibold text-sm text-slate-700'>
                  {fileName ? `Selected: ${fileName}` : 'Click to upload or drag & drop resume'}
                </span>
                <span className='text-xs text-slate-400 mt-1'>
                  {fileName ? 'File ready for analysis' : 'PDF files only (max 5MB)'}
                </span>

                <input 
                  type="file" 
                  id='resume' 
                  name='resume'
                  accept='.pdf'
                  required
                  onChange={handleFileChange}
                  className='hidden' 
                />
              </label>
            </div>

            {/* Action Button */}
            {error && <p role='alert' className='rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800'>{error}</p>}
            <button
              type='submit'
              disabled={isSubmitting}
              className='py-4 px-6 rounded-xl bg-[#0BA4AC] font-semibold text-white tracking-wide hover:bg-[#007B94] active:scale-[0.99] shadow-md shadow-[#0BA4AC]/20 cursor-pointer transition-all flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-70'
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {isSubmitting ? 'Generating Interview Report...' : 'Generate Interview Report'}
            </button>
            
          </div>

        </form>
      </main>

    </div>
  )
}

export default Home