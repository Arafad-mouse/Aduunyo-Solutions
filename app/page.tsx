"use client"

import { useState, useEffect } from "react"
import Image from 'next/image'
import Link from 'next/link'
import LaunchUI from '../components/logos/launch-ui'
import "../styles/landing.css"

export default function Home() {
  const [loanAmount, setLoanAmount] = useState("")
  const [monthlyAmount, setMonthlyAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("waafi-pay")
  const [monthlyPayback, setMonthlyPayback] = useState("Amount/number of months")

  // Calculate monthly payment
  useEffect(() => {
    const loan = parseFloat(loanAmount) || 0
    const monthly = parseFloat(monthlyAmount) || 0
    
    if (loan > 0 && monthly > 0) {
      const months = Math.ceil(loan / monthly)
      setMonthlyPayback(`$${monthly.toFixed(2)} for ${months} months`)
    } else {
      setMonthlyPayback("Please enter valid loan and monthly amounts")
    }
  }, [loanAmount, monthlyAmount])


  // Smooth scrolling for navigation links
  useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()
        const targetElement = document.querySelector(target.getAttribute('href')!)
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }

    document.addEventListener('click', handleSmoothScroll)
    return () => document.removeEventListener('click', handleSmoothScroll)
  }, [])

  return (
    <>
        {/* Hero Section */}
        <section className="hero" id="hero">
          <div className="container">
            <div className="hero-content">
              <h1>First Loan at <span className="highlight">0%</span> Up Front</h1>
              <p>At Aduunyo Solutions, we believe financial empowerment should begin without barriers. That&apos;s why your very first loan with us comes at 0% upfront cost—no hidden charges, no surprise fees.</p>
              <p>Our goal is to give you access to the essential electronics you need to grow—whether it&apos;s a laptop to expand your business, a smartphone to stay connected, or household electronics to improve your daily life.</p>
              <div className="cta-block">
                <Image src="/landing/timmer.svg" alt="Clock icon" className="clock-icon" height={100} width={100} />
                <h2>Don&apos;t Wait—Own Your<br />Dream Accessory Now.</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
  

  
  {/* Testimonial 1 */}
  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl shadow-sm mt-6">
    <Image src="/landing/avatar0.png" alt="Testimonial 1" width={60} height={60} className="rounded-full" />
    <p className="text-gray-700">&quot;The loan process was smooth, and the support was exceptional. Highly recommend!&quot;</p>
  </div>

  {/* Testimonial 2 */}
  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl shadow-sm mt-6">
    <Image src="/landing/avatar1.png" alt="Testimonial 2" width={60} height={60} className="rounded-full" />
    <p className="text-gray-700">&quot;The loan process was smooth, and the support was exceptional. Highly recommend!&quot;</p>
  </div>

  {/* Testimonial 3 */}
  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl shadow-sm">
    <Image src="/landing/avatar2.png" alt="Testimonial 3" width={60} height={60} className="rounded-full" />
    <p className="text-gray-700">&quot;The loan process was smooth, and the support was exceptional. Highly recommend!&quot;</p>
  </div>

  {/* Testimonial 4 */}
  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl shadow-sm">
    <Image src="/landing/avatar3.png" alt="Testimonial 4" width={60} height={60} className="rounded-full" />
    <p className="text-gray-700">&quot;The loan process was smooth, and the support was exceptional. Highly recommend!&quot;</p>
  </div>
</div>


            </div>
            <div className="loan-calculator-card" id="apply">
              <div className="card-header">
                <Link href="/loan" className="no-underline">
                  <h2 className="hover:underline cursor-pointer">Apply Now</h2>
                  <p>For Financial Freedom</p>
                </Link>
              </div>
              <div className="card-body">
                <h3>Loan Repayment</h3>
                <div className="form-group">
                  <label htmlFor="loan-amount">The entire Amount</label>
                  <input 
                    type="text" 
                    id="loan-amount" 
                    placeholder="Amount"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount-per-month">Amount Per month</label>
                  <input 
                    type="text" 
                    id="amount-per-month" 
                    placeholder="Amount"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                  />
                </div>
                <div className="payment-method">
                  <label htmlFor="payment-select">Select Payment</label>
                  <select 
                    id="payment-select" 
                    className="payment-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="waafi-pay">Waafi Pay</option>
                    <option value="cash-payment">Cash Payment</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="preimer-wallet">Premier Wallet</option>
                    <option value="e-dahab">eDahab</option>
                    <option value="zaad">Zaad</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="visa">Visa</option>
                  </select>
                </div>
                <Link href="/loan" className="apply-button">Apply Now</Link>
                <div className="monthly-payback">
                  <h4>Monthly Payback</h4>
                  <p>{monthlyPayback}</p>
                </div>
                <a href="#" className="read-more-button">Read More</a>
              </div>
            </div>
          </div>
        </section>

        {/* We Accept Section */}
        <section className="we-accept" id="we-accept">
          <div className="container">
            <div className="we-accept-content">
              <h2>We<br />Accept</h2>
            </div>
            <div className="payment-logos">
              <div className="logo-item">
                <Image src="/landing/master-card0.svg" alt="Mastercard" width={100} height={40} />
              </div>
              <div className="logo-item">
                <Image src="/landing/waafi-11.png" alt="Waafi" width={100} height={40} />
              </div>
              <div className="logo-item">
                <Image src="/landing/zaad-10.png" alt="Zaad" width={100} height={40} style={{width: 'auto', height: '40px'}} />
              </div>
              <div className="logo-item">
                <Image src="/landing/wallet-10.svg" alt="Cash Payment" width={100} height={40} />
                <span>Cash<br />Payment</span>
              </div>
              <div className="logo-item">
                <Image src="/landing/g-41580.svg" alt="Visa" width={100} height={40} style={{width: 'auto', height: '40px'}} />
              </div>
              <div className="logo-item">
                <Image src="/landing/e-dahab0.svg" alt="eDahab" width={100} height={40} style={{width: 'auto', height: '40px'}} />
              </div>
              <div className="logo-item">
                <Image src="/landing/preimer-wallet0.svg" alt="Premier Wallet" width={100} height={40} style={{width: 'auto', height: '40px'}} />
              </div>
              <div className="logo-item">
                <Image src="/landing/assured-workload1.svg" alt="Bank Transfer" width={100} height={40} />
                <span>Bank<br />Transfer</span>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="about-section" id="about-us">
          <div className="container">
            <div className="about-content">
              {/* Left Column: Text Content */}
              <div className="about-text">
                <h2 className="section-title">About Us</h2>
                <div className="title-underline"></div>
                
                <div className="company-description">
                  <p><strong>Aduunyo Solutions</strong> is a Hargeisa-based microfinance company dedicated to making technology accessible and affordable. We empower individuals and businesses by providing laptops, smartphones, and essential electronic items through a flexible monthly payment system.</p>
                  
                  <p>Our approach eliminates the financial barrier to owning modern tools, enabling our customers to connect, learn, and grow without the burden of large upfront costs.</p>
                </div>

                <div className="mission-vision">
                  <div className="mission">
                    <h3 className="subsection-title">Our Mission</h3>
                    <div className="subsection-underline"></div>
                    <p>To bridge the digital divide by providing affordable access to essential electronics through microfinance solutions that empower people to achieve more in their personal and professional lives.</p>
                  </div>

                  <div className="vision">
                    <h3 className="subsection-title">Our Vision</h3>
                    <div className="subsection-underline"></div>
                    <p>To become the leading microfinance partner in Somaliland and beyond, driving inclusive growth and digital empowerment by making technology accessible to all.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Process Steps */}
              <div className="process-container">
                <Image src="/landing/application-letter.png" alt="Process Steps" width={500} height={300} />
                <div className="process-steps">
                <div className="step-item">
                  <div className="step-number">01</div>
                  <div className="step-content">
                    <h4>Apply For Microfinance</h4>
                    <p>Submit your application online or at our office to get started.</p>
                  </div>
                </div>
                
                <div className="step-connector"></div>
                
                <div className="step-item">
                  <div className="step-number">02</div>
                  <div className="step-content">
                    <h4>Application Review</h4>
                    <p>Our team reviews your request quickly and transparently.</p>
                  </div>
                </div>
                
                <div className="step-connector"></div>
                
                <div className="step-item">
                  <div className="step-number">03</div>
                  <div className="step-content">
                    <h4>Visit Our Office</h4>
                    <p>Complete the process with a quick visit to our office.</p>
                  </div>
                </div>
                
                <div className="step-connector"></div>
                
                <div className="step-item">
                  <div className="step-number">04</div>
                  <div className="step-content">
                    <h4>Get Your Dream Item</h4>
                    <p>Walk away with your chosen item—paid in easy monthly installments.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>

            </>
  )
}
