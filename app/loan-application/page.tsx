'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

// UI Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, ChevronDownIcon } from 'lucide-react';
import { format, differenceInYears } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/navbar/navbar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Constants and Types
const phoneRegex = /^\d{1,13}$/;

type PaymentPlan = 'DAILY' | 'WEEKLY' | 'MONTHLY' | '3 MONTHS' | '6 MONTHS' | '9 MONTHS' | '1 YEAR';
type ItemCategory = 'SMARTPHONE' | 'TABLET' | 'LAPTOP' | 'HOME_APPLIANCES' | 'SOLAR_PANELS';
type EmploymentType = 'Self-Employed' | 'Salaried' | 'Unemployed' | 'Student' | 'Retired';

type UploadedFile = File & { preview?: string };

// Validation Schema
const loanApplicationSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, { message: 'Full name is required (minimum 2 characters)' }),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
    invalid_type_error: "Please select a valid date",
  }).refine(date => {
    const age = differenceInYears(new Date(), new Date(date));
    return age >= 18;
  }, { message: 'Applicant must be at least 18 years old' }),
  nationalId: z.string().min(1, { message: 'National ID is required' }),
  phoneNumber: z.string()
    .min(1, { message: 'Phone number is required' })
    .regex(phoneRegex, { message: 'Phone number must be numeric and maximum 13 digits' }),
  emailAddress: z.string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  monthlyIncome: z.string()
    .min(1, { message: 'Monthly income is required' })
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { 
      message: 'Monthly income must be a valid positive number' 
    }),
  loanAmount: z.string()
    .min(1, { message: 'Loan amount is required' })
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { 
      message: 'Loan amount must be a valid positive number' 
    }),
  referencePersonName: z.string().min(2, { message: 'Reference person name is required (minimum 2 characters)' }),
  referencePersonNumber: z.string()
    .min(1, { message: 'Reference person number is required' })
    .regex(phoneRegex, { message: 'Reference number must be numeric and maximum 13 digits' }),
  
  // Employment & Income Details
  occupation: z.string().min(2, { message: 'Occupation is required (minimum 2 characters)' }),
  employmentType: z.enum(['Self-Employed', 'Salaried', 'Unemployed', 'Student', 'Retired'], {
    required_error: 'Employment type is required',
  }),
  itemCategory: z.enum(['SMARTPHONE', 'TABLET', 'LAPTOP', 'HOME_APPLIANCES', 'SOLAR_PANELS'] as const, {
    required_error: 'Item category is required',
    invalid_type_error: 'Please select a valid item category',
  }),
  paymentPlan: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', '3 MONTHS', '6 MONTHS', '9 MONTHS', '1 YEAR'] as const, {
    required_error: 'Payment plan is required',
    invalid_type_error: 'Please select a valid payment plan',
  }),
  workingPlace: z.string().min(2, { message: 'Working place is required (minimum 2 characters)' }),
  
  // Submission
  agreedTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  consentForLoan: z.boolean().refine(val => val === true, {
    message: 'You must provide consent for loan processing',
  }),
  uploadedDocument: z.any().refine(
    (files) => files && files.length > 0,
    { message: 'Please upload required documents' }
  )
}).refine(data => {
  // Business Rule: Reference number cannot match applicant's phone
  return data.referencePersonNumber !== data.phoneNumber;
}, {
  message: 'Reference person number cannot match your phone number',
  path: ['referencePersonNumber']
}).refine(data => {
  // Business Rule: Loan amount cannot exceed monthly income
  const monthlyIncome = parseFloat(data.monthlyIncome);
  const loanAmount = parseFloat(data.loanAmount);
  return !isNaN(monthlyIncome) && !isNaN(loanAmount) && loanAmount <= monthlyIncome;
}, {
  message: 'Loan amount cannot exceed monthly income',
  path: ['loanAmount']
});

type LoanFormData = z.infer<typeof loanApplicationSchema>;
type WhatsAppNotificationData = Omit<LoanFormData, 'dateOfBirth' | 'agreedTerms' | 'consentForLoan' | 'uploadedDocument' | 'PaymentPlan'> & { 
  PaymentPlan?: PaymentPlan;
  id?: string; 
};

export default function LoanApplicationPage() {
  // State management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    watch,
    reset
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanApplicationSchema),
  });

  // File upload handler
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    
    const files = Array.from(event.target.files) as UploadedFile[];
    const validFiles = files.filter((file: UploadedFile) => {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });
    
    setUploadedFiles(prevFiles => [...prevFiles, ...validFiles]);
    setValue('uploadedDocument', [...uploadedFiles, ...validFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setValue('uploadedDocument', newFiles);
  };

  // WhatsApp notification function
  const sendWhatsAppNotification = async (applicationData: WhatsAppNotificationData) => {
    try {
      const message = `🔔 New Loan Application Submitted:

👤 Name: ${applicationData.fullName}
📞 Phone: ${applicationData.phoneNumber}
💰 Loan Amount: $${applicationData.loanAmount}
👔 Employment: ${applicationData.employmentType}
📦 Item Category: ${applicationData.itemCategory}
📅 Payment Plan: ${applicationData.PaymentPlan}
🏢 Working Place: ${applicationData.workingPlace}
💵 Monthly Income: $${applicationData.monthlyIncome}

📋 Application ID: ${applicationData.id || 'Generated'}
⏰ Submitted: ${new Date().toLocaleString()}`;

      const whatsappResponse = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890', // Replace with your WhatsApp number
          message: message
        })
      });

      if (whatsappResponse.ok) {
        console.log('✅ WhatsApp notification sent successfully!');
      } else {
        console.error('❌ Failed to send WhatsApp notification:', await whatsappResponse.text());
      }
    } catch (whatsappError) {
      console.error('❌ WhatsApp notification error:', whatsappError);
      // Don't fail the entire submission if WhatsApp fails
    }
  };

  // Form submission handler
  const onSubmit = async (data: LoanFormData) => {
    setIsSubmitting(true);
    setSubmissionMessage('');
    
    try {
      // Validate file upload
      if (uploadedFiles.length === 0) {
        setSubmissionMessage('Please upload required documents.');
        setMessageType('error');
        return;
      }

      // Upload document
      const file = uploadedFiles[0];
      const { data: fileData, error: fileError } = await supabase.storage
        .from("loan-documents")
        .upload(`loan-applications/${Date.now()}-${file.name}`, file);

      if (fileError) {
        console.error("File upload failed:", fileError.message);
        setSubmissionMessage('File upload failed. Please try again.');
        setMessageType('error');
        return;
      }

      // Prepare application data
      const applicationData = {
        full_name: data.fullName,
        national_id: data.nationalId,
        date_of_birth: data.dateOfBirth,
        phone_number: data.phoneNumber,
        email_address: data.emailAddress,
        reference_person_name: data.referencePersonName,
        reference_person_number: data.referencePersonNumber,
        occupation: data.occupation,
        employment_type: data.employmentType,
        item_category: data.itemCategory,
        payment_plan: data.paymentPlan,
        working_place: data.workingPlace,
        monthly_income: parseFloat(data.monthlyIncome),
        loan_amount: parseFloat(data.loanAmount),
        agreed_terms: !!data.agreedTerms,
        consent_for_loan: !!data.consentForLoan,
        document_path: fileData.path
      };

      // Insert into database
      const { data: insertedData, error } = await supabase
        .from('loan_applications')
        .insert([applicationData])
        .select();

      if (error) {
        console.error("❌ Error submitting application:", error.message);
        setSubmissionMessage(`Submission failed: ${error.message}`);
        setMessageType('error');
        return;
      }
      
      console.log("✅ Application submitted successfully:", insertedData);
      
      // Send WhatsApp notification
      if (insertedData && insertedData[0]) {
        await sendWhatsAppNotification({ ...data, id: insertedData[0].id });
      }

      setSubmissionMessage('🎉 Application submitted successfully! We will review your application and contact you soon.');
      setMessageType('success');
      toast.success('Application submitted successfully!');
      reset();
      setUploadedFiles([]);
      
    } catch (error) {
      console.error('❌ Error submitting application:', error);
      setSubmissionMessage('Submission failed. Please try again.');
      setMessageType('error');
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Loan Application Form
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">
              Complete your loan application in simple steps
            </p>
          </div>

          {/* Submission Message */}
          {submissionMessage && (
            <div className={cn(
              "p-4 rounded-lg mb-6 shadow-sm",
              messageType === 'success' 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 border-l-4 border-red-400 text-red-800'
            )}>
              <p className="font-medium">{submissionMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Personal Information Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-[#5ca34c] px-6 py-4">
                  <h2 className="text-xl font-bold text-white">1. Personal Information</h2>
                  <p className="text-white text-sm">Please provide your personal details</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                      Full Name *
                    </Label>
                    <Input 
                      id="fullName" 
                      placeholder="Enter your full name" 
                      {...register('fullName')}
                      className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* National ID */}
                  <div className="space-y-2">
                    <Label htmlFor="nationalId" className="text-sm font-semibold text-gray-700">
                      National ID *
                    </Label>
                    <Input 
                      id="nationalId" 
                      placeholder="Enter your national ID" 
                      {...register('nationalId')}
                      className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                    {errors.nationalId && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.nationalId.message}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700">
                      Date of Birth *
                    </Label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-12 justify-start text-left font-normal border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500 transition-colors",
                            !watch('dateOfBirth') ? "text-gray-500" : "text-gray-900"
                          )}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
                          {watch('dateOfBirth') ? (
                            <span className="font-medium">
                              {format(new Date(watch('dateOfBirth')), "PPP")}
                            </span>
                          ) : (
                            <span>Select date of birth</span>
                          )}
                          <ChevronDownIcon className="ml-auto h-4 w-4 text-black" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 shadow-xl border-0 rounded-xl">
                        <Calendar
                          mode="single"
                          selected={watch('dateOfBirth')}
                          onSelect={(date) => {
                            if (date) {
                              setValue('dateOfBirth', date);
                              setCalendarOpen(false);
                            }
                          }}
                          captionLayout="dropdown"
                          fromYear={1940}
                          toYear={new Date().getFullYear()}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1940-01-01")
                          }
                          initialFocus
                          defaultMonth={watch('dateOfBirth') || new Date(2000, 0, 1)}
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">
                      Phone Number *
                    </Label>
                    <Input 
                      id="phoneNumber" 
                      type="tel" 
                      placeholder="Enter your phone number" 
                      {...register('phoneNumber')}
                      className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress" className="text-sm font-semibold text-gray-700">
                      Email Address *
                    </Label>
                    <Input 
                      id="emailAddress" 
                      type="email" 
                      placeholder="Enter your email address" 
                      {...register('emailAddress')}
                      className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                    {errors.emailAddress && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.emailAddress.message}
                      </p>
                    )}
                  </div>

                  {/* Reference Person Name */}
                  <div className="space-y-2">
                    <Label htmlFor="referencePersonName" className="text-sm font-semibold text-gray-700">
                      Reference Person Name *
                    </Label>
                    <Input 
                      id="referencePersonName" 
                      placeholder="Enter reference person's name" 
                      {...register('referencePersonName')}
                      className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                    {errors.referencePersonName && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.referencePersonName.message}
                      </p>
                    )}
                  </div>

                  {/* Reference Person Number */}
                  <div className="space-y-2">
                    <Label htmlFor="referencePersonNumber" className="text-sm font-semibold text-gray-700">
                      Reference Person Number *
                    </Label>
                    <Input 
                      id="referencePersonNumber" 
                      type="tel"
                      placeholder="Enter reference person's phone number" 
                      {...register('referencePersonNumber')}
                      className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                    {errors.referencePersonNumber && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.referencePersonNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Employment & Income Details Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-[#5ca34c] px-6 py-4">
                  <h2 className="text-xl font-bold text-white">2. Employment & Income Details</h2>
                  <p className="text-green-100 text-sm">Please provide your employment information</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Occupation */}
                  <div className="space-y-2">
                    <Label htmlFor="occupation" className="text-sm font-semibold text-gray-700">
                      Occupation *
                    </Label>
                    <Input 
                      id="occupation" 
                      placeholder="Enter your occupation" 
                      {...register('occupation')}
                      className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors"
                    />
                    {errors.occupation && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.occupation.message}
                      </p>
                    )}
                  </div>

                  {/* Employment Type */}
                  <div className="space-y-2">
                    <Label htmlFor="employmentType" className="text-sm font-semibold text-gray-700">
                      Employment Type *
                    </Label>
                    <Select onValueChange={(value: EmploymentType) => setValue('employmentType', value)}>
                      <SelectTrigger className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                        <SelectItem value="Salaried">Salaried</SelectItem>
                        <SelectItem value="Unemployed">Unemployed</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.employmentType && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.employmentType.message}
                      </p>
                    )}
                  </div>

                  {/* Item Category */}
                  <div className="space-y-2">
                    <Label htmlFor="itemCategory" className="text-sm font-semibold text-gray-700">
                      Item Category *
                    </Label>
                    <Select onValueChange={(value) => setValue('itemCategory', value as ItemCategory)}>
                      <SelectTrigger className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors">
                        <SelectValue placeholder="Select item category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SMARTPHONE">Smartphone</SelectItem>
                        <SelectItem value="TABLET">Tablet</SelectItem>
                        <SelectItem value="LAPTOP">Laptop</SelectItem>
                        <SelectItem value="HOME_APPLIANCES">Home Appliances</SelectItem>
                        <SelectItem value="SOLAR_PANELS">Solar Panels</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.itemCategory && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.itemCategory.message}
                      </p>
                    )}
                  </div>

                  {/* Preferred Payment Plan */}
                  <div className="space-y-2">
                    <Label htmlFor="preferredPaymentPlan" className="text-sm font-semibold text-gray-700">
                      Preferred Payment Plan *
                    </Label>
                    <Select onValueChange={(value: PaymentPlan) => setValue('paymentPlan', value)}>
                      <SelectTrigger className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors">
                        <SelectValue placeholder="Select payment plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="3 MONTHS">3 Months</SelectItem>
                        <SelectItem value="6 MONTHS">6 Months</SelectItem>
                        <SelectItem value="9 MONTHS">9 Months</SelectItem>
                        <SelectItem value="1 YEAR">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.paymentPlan && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.paymentPlan.message}
                      </p>
                    )}
                  </div>

                  {/* Working Place */}
                  <div className="space-y-2">
                    <Label htmlFor="workingPlace" className="text-sm font-semibold text-gray-700">
                      Working Place *
                    </Label>
                    <Input 
                      id="workingPlace" 
                      placeholder="Enter your working place" 
                      {...register('workingPlace')}
                      className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors"
                    />
                    {errors.workingPlace && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.workingPlace.message}
                      </p>
                    )}
                  </div>

                  {/* Monthly Income */}
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome" className="text-sm font-semibold text-gray-700">
                      Monthly Income *
                    </Label>
                    <Input 
                      id="monthlyIncome" 
                      type="number" 
                      placeholder="Enter your monthly income" 
                      {...register('monthlyIncome')}
                      className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors"
                    />
                    {errors.monthlyIncome && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.monthlyIncome.message}
                      </p>
                    )}
                  </div>

                  {/* Loan Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount" className="text-sm font-semibold text-gray-700">
                      Loan Amount *
                    </Label>
                    <Input 
                      id="loanAmount" 
                      type="number" 
                      placeholder="Enter loan amount" 
                      {...register('loanAmount')}
                      className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors"
                    />
                    {errors.loanAmount && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                        {errors.loanAmount.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Card */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-[#5ca34c] px-6 py-4">
                <h2 className="text-xl font-bold text-white">3. Document Upload & Agreement</h2>
                <p className="text-green-100 text-sm">Final step - upload documents and agree to terms</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Checkbox 
                      id="agreedTerms" 
                      {...register('agreedTerms', {
                        setValueAs: (value: boolean) => Boolean(value)
                      })}
                      className="mt-0.5 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="agreedTerms" className="text-sm font-medium leading-relaxed text-gray-700 cursor-pointer">
                      I agree to Aduunyo Solutions&apos; Terms & Conditions
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                  </div>
                  {errors.agreedTerms && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.agreedTerms.message}
                    </p>
                  )}
                  
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Checkbox 
                      id="consentForLoan" 
                      {...register('consentForLoan', {
                        setValueAs: (value: boolean) => Boolean(value)
                      })}
                      className="mt-0.5 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="consentForLoan" className="text-sm font-medium leading-relaxed text-gray-700 cursor-pointer">
                      I consent to my information being used for loan assessment purposes and data processing
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                  </div>
                  {errors.consentForLoan && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.consentForLoan.message}
                    </p>
                  )}
                </div>
                
                
                {/* Document Upload */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Upload Required Documents *
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Copy of ID, recent payslip or income proof (PDF, PNG, JPG, JPEG - Max 10MB)
                    </p>
                  </div>
                  
                  <div className="relative">
                    <label 
                      htmlFor="uploadedDocument" 
                      className="group flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500"
                    >
                      <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                        <div className="p-3 mb-4 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors duration-200">
                          <Upload className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="mb-2 text-lg font-semibold text-gray-700 group-hover:text-green-700 transition-colors">
                          Upload Documents
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-green-600">Click to browse</span> or drag and drop
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          Supported formats: PDF, PNG, JPG, JPEG (Maximum 10MB)
                        </p>
                      </div>
                      <Input 
                        id="uploadedDocument" 
                        type="file" 
                        className="hidden" 
                        multiple 
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  
                  {errors.uploadedDocument?.message && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                      {errors.uploadedDocument?.message ? String(errors.uploadedDocument?.message) : ''}
                    </p>
                  )}
                  <br></br>
                  
                  {/* File Preview */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shadow-sm">
                                
                                {file.type.includes('pdf') ? (
                                  <span className="text-sm font-bold text-green-700">PDF</span>
                                ) : (
                                  <span className="text-sm font-bold text-black">IMG</span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-200 hover:border-red-300 transition-colors"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-none border-gray-200">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="flex-1 h-12 rounded-xl border-none hover:bg-gray-50 transition-colors" 
                    onClick={() => router.push('/')}
                  >
                    Cancel Application
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting Application...</span>
                      </div>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                  <br></br>
                </div>
              </div>
            </div>
          </form>
          <br></br>
          <br></br>
        </div>
      </div>
    </>
  );
}