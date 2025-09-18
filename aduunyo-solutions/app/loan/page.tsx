'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@supabase/supabase-js';
import { useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { differenceInYears } from 'date-fns';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// UI Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/navbar/navbar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar22 } from '@/components/ui/calendar22';

const phoneRegex = /^\d{1,13}$/; // Production-grade: numeric only, max 13 digits

type LoanFormData = z.infer<typeof loanApplicationSchema>;

const loanApplicationSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, { message: 'Full name is required (minimum 2 characters)' }),
  dateOfBirth: z.string()
    .min(1, { message: 'Date of birth is required' })
    .refine(dateStr => {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return false;
      const age = differenceInYears(new Date(), date);
      return age >= 18;
    }, { message: 'Applicant must be at least 18 years old' }),
  nationalId: z.string().min(1, { message: 'National ID is required' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required' }).regex(phoneRegex, { message: 'Phone number must be numeric and maximum 13 digits' }),
  emailAddress: z.string().min(1, { message: 'Email address is required' }).email({ message: 'Please enter a valid email address' }),
  monthlyIncome: z.string().min(1, { message: 'Monthly income is required' }).refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: 'Monthly income must be a valid positive number' }),
  loanAmount: z.string().min(1, { message: 'Loan amount is required' }).refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: 'Loan amount must be a valid positive number' }),
  referencePersonName: z.string().min(2, { message: 'Reference person name is required (minimum 2 characters)' }),
  referencePersonNumber: z.string().min(1, { message: 'Reference person number is required' }).regex(phoneRegex, { message: 'Reference number must be numeric and maximum 13 digits' }),
  
  // Employment & Income Details
  occupation: z.string().min(2, { message: 'Occupation is required (minimum 2 characters)' }),
  employmentType: z.string().min(1, { message: 'Employment type is required' }),
  itemCategory: z.string().min(1, { message: 'Item category is required' }),
  preferredPaymentPlan: z.string().min(1, { message: 'Payment plan is required' }),
  workingPlace: z.string().min(2, { message: 'Working place is required (minimum 2 characters)' }),
  
  // Submission
  agreedTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  consentForLoan: z.boolean().refine(val => val === true, {
    message: 'You must provide consent for loan processing',
  }),
  uploadedDocument: z.any().refine(files => files && files.length > 0, {
    message: 'Please upload required documents',
  }),
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

export default function LoanApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    reset,
    control
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanApplicationSchema),
  });


  // Define file type
  type UploadedFile = File & { preview?: string };

  // Handle file upload and preview
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
      type WhatsAppNotificationData = Omit<LoanFormData, 'dateOfBirth' | 'agreedTerms' | 'consentForLoan' | 'uploadedDocument'> & { id?: string };

  const sendWhatsAppNotification = async (applicationData: WhatsAppNotificationData) => {
    try {
      const message = `🔔 New Loan Application Submitted:

👤 Name: ${applicationData.fullName}
📞 Phone: ${applicationData.phoneNumber}
💰 Loan Amount: $${applicationData.loanAmount}
👔 Employment: ${applicationData.employmentType}
📦 Item Category: ${applicationData.itemCategory}
📅 Payment Plan: ${applicationData.preferredPaymentPlan}
🏢 Working Place: ${applicationData.workingPlace}
💵 Monthly Income: $${applicationData.monthlyIncome}

📋 Application ID: ${applicationData.id || 'Generated'}
⏰ Submitted: ${new Date().toLocaleString()}`;

      // Replace with your actual WhatsApp API endpoint and phone number
      const whatsappResponse = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+252633003908', // Replace with your WhatsApp number
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

    const onSubmit = async (data: z.infer<typeof loanApplicationSchema>) => {
    setIsSubmitting(true);
    setSubmissionMessage('');
    
    try {
      // --- Step 1: Basic Required Fields ---
            const requiredFields: (keyof LoanFormData)[] = [
        'fullName', 'nationalId', 'dateOfBirth', 'phoneNumber', 'emailAddress',
        'referencePersonName', 'referencePersonNumber', 'occupation',
        'employmentType', 'itemCategory', 'preferredPaymentPlan',
        'workingPlace', 'monthlyIncome', 'loanAmount',
      ];
      
      for (const field of requiredFields) {
        if (!data[field]) {
          console.error(`Missing required field: ${field}`);
          setSubmissionMessage(`Missing required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          setMessageType('error');
          return;
        }
      }

      // --- Step 2: Phone Number Validation ---
      if (!/^\d{1,13}$/.test(data.phoneNumber)) {
        console.error("Phone number must be numeric and max 13 digits");
        setSubmissionMessage('Phone number must be numeric and maximum 13 digits');
        setMessageType('error');
        return;
      }

      // --- Step 3: Reference Person Number Validation ---
      if (data.referencePersonNumber === data.phoneNumber) {
        console.error("Reference number cannot match applicant's phone number");
        setSubmissionMessage("Reference person number cannot match your phone number");
        setMessageType('error');
        return;
      }

      // --- Step 4: Date of Birth Validation (>= 18 years old) ---
      const age = differenceInYears(new Date(), data.dateOfBirth);
      if (age < 18) {
        console.error("Applicant must be at least 18 years old");
        setSubmissionMessage('Applicant must be at least 18 years old');
        setMessageType('error');
        return;
      }

      // --- Step 5: Loan Amount Validation ---
      const monthlyIncome = parseFloat(data.monthlyIncome);
      const loanAmount = parseFloat(data.loanAmount);
      if (loanAmount > monthlyIncome) {
        console.error("Loan amount cannot exceed monthly income");
        setSubmissionMessage('Loan amount cannot exceed monthly income');
        setMessageType('error');
        return;
      }

      // --- Step 6: Dropdown Validations ---
      const validEmploymentTypes = ['Self-Employed', 'Salaried', 'Unemployed', 'Student', 'Retired'];
      const validItemCategories = ['Electronics', 'Home Appliances', 'Furniture', 'Services', 'Other'];
      const validPaymentPlans = ['6 months', '8 months', '1 year', '2 years', '3 years'];

      if (!validEmploymentTypes.includes(data.employmentType)) {
        console.error("Invalid employment type");
        setSubmissionMessage('Invalid employment type. Please select a valid option.');
        setMessageType('error');
        return;
      }
      if (!validItemCategories.includes(data.itemCategory)) {
        console.error("Invalid item category");
        setSubmissionMessage('Invalid item category. Please select a valid option.');
        setMessageType('error');
        return;
      }
      if (!validPaymentPlans.includes(data.preferredPaymentPlan)) {
        console.error("Invalid preferred payment plan");
        setSubmissionMessage('Invalid preferred payment plan. Please select a valid option.');
        setMessageType('error');
        return;
      }

      // --- Step 7: File Upload Validation ---
      if (uploadedFiles.length === 0) {
        console.error("No files uploaded");
        setSubmissionMessage('Please upload required documents.');
        setMessageType('error');
        return;
      }

      // --- Step 8: Upload Document ---
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
      console.log("✅ File uploaded successfully:", fileData);

      // --- Step 9: Insert into Database ---
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
        preferred_payment_plan: data.preferredPaymentPlan,
        working_place: data.workingPlace,
        monthly_income: monthlyIncome,
        loan_amount: loanAmount,
        agreed_terms: !!data.agreedTerms,
        consent_for_loan: !!data.consentForLoan,
        document_path: fileData.path
      };

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
      
      // --- Step 10: Send WhatsApp Notification ---
      if (insertedData && insertedData[0]) {
        await sendWhatsAppNotification({ ...data, id: insertedData[0].id });
      }

      setSubmissionMessage('🎉 Application submitted successfully! We will review your application and contact you soon. A notification has been sent to our team.');
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
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Application Form</h1>
          <svg className="mx-auto mt-2" width="100" height="6" viewBox="0 0 100 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4C13.4866 1.58333 34.2 -1.4 50 4C65.8 9.4 86.5134 1.58333 98 4" stroke="#FF7A00" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </header>

        {/* Submission Message */}
        {submissionMessage && (
          <div className={`p-4 rounded-lg mb-6 ${
            messageType === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            <p className="font-medium">{submissionMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-1 text-gray-700">1. Personal Information</h2>
              <p className="text-sm text-gray-500 mb-6">Fill This Area</p>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="Enter your full name" {...register('fullName')} />
                                    {errors.fullName?.message && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalId">National ID *</Label>
                  <Input id="nationalId" placeholder="Enter your national ID" {...register('nationalId')} />
                                    {errors.nationalId?.message && <p className="text-red-500 text-sm">{errors.nationalId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <Calendar22
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.dateOfBirth?.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message as string}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input id="phoneNumber" type="tel" placeholder="Enter your phone number" {...register('phoneNumber')} />
                                    {errors.phoneNumber?.message && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address *</Label>
                  <Input id="emailAddress" type="email" placeholder="Enter your email address" {...register('emailAddress')} />
                                    {errors.emailAddress?.message && <p className="text-red-500 text-sm">{errors.emailAddress.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referencePersonName">Reference Person Name *</Label>
                  <Input id="referencePersonName" placeholder="Enter reference person's name" {...register('referencePersonName')} />
                                    {errors.referencePersonName?.message && <p className="text-red-500 text-sm">{errors.referencePersonName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referencePersonNumber">Reference Person Number *</Label>
                  <Input id="referencePersonNumber" placeholder="Enter reference person's phone number" {...register('referencePersonNumber')} />
                                    {errors.referencePersonNumber?.message && <p className="text-red-500 text-sm">{errors.referencePersonNumber.message}</p>}
                </div>
              </div>
            </div>

            {/* Employment & Income Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-1 text-gray-700">2. Employment & Income Details</h2>
              <p className="text-sm text-gray-500 mb-6">Fill This Area</p>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation *</Label>
                  <Input id="occupation" placeholder="Enter your occupation" {...register('occupation')} />
                                    {errors.occupation?.message && <p className="text-red-500 text-sm">{errors.occupation.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select onValueChange={(value: 'Self-Employed' | 'Salaried' | 'Unemployed' | 'Student' | 'Retired') => setValue('employmentType', value)}>

                    <SelectTrigger className="w-full">
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
                                    {errors.employmentType?.message && <p className="text-red-500 text-sm">{errors.employmentType.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemCategory">Item Category *</Label>
                  <Select onValueChange={(value: 'Electronics' | 'Home Appliances' | 'Furniture' | 'Services' | 'Other') => setValue('itemCategory', value)}>

                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select item category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Home Appliances">Home Appliances</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Services">Services</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                                    {errors.itemCategory?.message && <p className="text-red-500 text-sm">{errors.itemCategory.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredPaymentPlan">Preferred Payment Plan *</Label>
                  <Select onValueChange={(value: '6 months' | '8 months' | '1 year' | '2 years' | '3 years') => setValue('preferredPaymentPlan', value)}>

                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6 months">6 Months</SelectItem>
                      <SelectItem value="8 months">8 Months</SelectItem>
                      <SelectItem value="1 year">1 Year</SelectItem>
                      <SelectItem value="2 years">2 Years</SelectItem>
                      <SelectItem value="3 years">3 Years</SelectItem>
                    </SelectContent>
                  </Select>
                                    {errors.preferredPaymentPlan?.message && <p className="text-red-500 text-sm">{errors.preferredPaymentPlan.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingPlace">Working Place *</Label>
                  <Input id="workingPlace" placeholder="Enter your working place" {...register('workingPlace')} />
                                    {errors.workingPlace?.message && <p className="text-red-500 text-sm">{errors.workingPlace.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                  <Input id="monthlyIncome" type="number" placeholder="Enter your monthly income" {...register('monthlyIncome')} />
                                    {errors.monthlyIncome?.message && <p className="text-red-500 text-sm">{errors.monthlyIncome.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount *</Label>
                  <Input id="loanAmount" type="number" placeholder="Enter loan amount" {...register('loanAmount')} />
                                    {errors.loanAmount?.message && <p className="text-red-500 text-sm">{errors.loanAmount.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Submission Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-1 text-gray-700">3. Submission</h2>
            <p className="text-sm text-gray-500 mb-6">Fill This Area</p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agreedTerms" 
                  {...register('agreedTerms', {
                    setValueAs: (value: boolean) => Boolean(value)
                  })}
                />
                <Label htmlFor="agreedTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Agree to Aduunyo Solutions&apos; Terms & Conditions
                </Label>
              </div>
                            {errors.agreedTerms?.message && <p className="text-red-500 text-sm">{errors.agreedTerms.message}</p>}
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consentForLoan" 
                  {...register('consentForLoan', {
                    setValueAs: (value: boolean) => Boolean(value)
                  })}
                />
                <Label htmlFor="consentForLoan" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I consent to my information being used for loan assessment purposes
                </Label>
              </div>
                            {errors.consentForLoan?.message && <p className="text-red-500 text-sm">{errors.consentForLoan.message}</p>}
              
              <div className="space-y-2">
                <Label htmlFor="uploadedDocument">Upload Required Documents *</Label>
                <p className="text-sm text-gray-500">Copy of ID, recent payslip or income proof</p>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="uploadedDocument" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG or JPEG (MAX. 10MB)</p>
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
                                {errors.uploadedDocument?.message && typeof errors.uploadedDocument.message === 'string' && (
                  <p className="text-red-500 text-sm">{errors.uploadedDocument.message}</p>
                )}
                
                {/* File Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Uploaded Files:</Label>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            {file.type.includes('pdf') ? (
                              <span className="text-xs font-semibold text-blue-600">PDF</span>
                            ) : (
                              <span className="text-xs font-semibold text-green-600">IMG</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" type="button" className="rounded-lg" onClick={() => router.push('/')}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-[#5BA44C] hover:bg-[#5BA44C]/90 text-white rounded-lg disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
          </>
  );
}
