'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '../../lib/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// UI Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const loanApplicationSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, { message: 'Full name is required (minimum 2 characters)' }),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
    invalid_type_error: "Please select a valid date",
  }),
  nationalId: z.string().min(1, { message: 'National ID is required' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required' }).regex(phoneRegex, { message: 'Please enter a valid phone number' }),
  emailAddress: z.string().min(1, { message: 'Email address is required' }).email({ message: 'Please enter a valid email address' }),
  monthlyIncome: z.string().min(1, { message: 'Monthly income is required' }),
  loanAmount: z.string().min(1, { message: 'Loan amount is required' }),
  referencePersonName: z.string().min(2, { message: 'Reference person name is required (minimum 2 characters)' }),
  referencePersonNumber: z.string().min(1, { message: 'Reference person number is required' }).regex(phoneRegex, { message: 'Please enter a valid reference phone number' }),
  
  // Employment & Income Details
  occupationEmployer: z.string().min(2, { message: 'Occupation/Employer name is required (minimum 2 characters)' }),
  employmentType: z.enum(['Self-Employed', 'Salaried', 'Unemployed', 'Student', 'Retired'], {
    required_error: 'Employment type is required',
  }),
  itemCategory: z.enum(['Electronics', 'Furniture', 'Agriculture', 'Services', 'Other'], {
    required_error: 'Item category is required',
  }),
  preferredPaymentPlan: z.enum(['6-months', '8-months', '1-year', '2-years', '3-years'], {
    required_error: 'Payment plan is required',
  }),
  workingPlace: z.string().min(2, { message: 'Working place is required (minimum 2 characters)' }),
  
  // Submission
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  consentInformation: z.boolean().refine(val => val === true, {
    message: 'You must provide consent for information usage',
  }),
  uploadedDocument: z.any().refine(files => files && files.length > 0, {
    message: 'Please upload required documents',
  }),
});

export default function LoanApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    watch,
    trigger,
    reset
  } = useForm({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      employmentStatus: 'employed',
      loanTerm: '12',
      loanPurpose: 'personal',
    },
  });

  const supabase = createClient();

  // Handle file upload and preview
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });
    
    setUploadedFiles(validFiles);
    setValue('uploadedDocument', validFiles);
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setValue('uploadedDocument', newFiles);
  };

  const employmentStatus = watch('employmentStatus');

  const steps = [
    { id: 1, name: 'Personal Information' },
    { id: 2, name: 'Employment & Income' },
    { id: 3, name: 'Loan Details' },
    { id: 4, name: 'References' },
    { id: 5, name: 'Documents' },
    { id: 6, name: 'Review & Submit' },
  ];

  const nextStep = async () => {
    const fields = {
      1: ['fullName', 'dateOfBirth', 'phoneNumber', 'emailAddress', 'referencePersonName', 'referencePersonNumber'],
      2: ['occupationEmployer', 'employmentType', 'itemCategory', 'preferredPaymentPlan', 'workingPlace'],
      3: ['loanAmount', 'loanPurpose', 'loanTerm'],
      4: ['reference1Name', 'reference1Phone', 'reference1Relationship', 'reference2Name', 'reference2Phone', 'reference2Relationship'],
      5: ['idDocument', 'proofOfIncome', 'proofOfAddress'],
    }[currentStep];

    const isValid = await trigger(fields);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmissionMessage('');
    
    try {
      // Validate required fields before submission
      const allowedEmploymentTypes = ['Self-Employed', 'Salaried', 'Unemployed', 'Student', 'Retired'];
      if (!allowedEmploymentTypes.includes(data.employmentType)) {
        console.error("Invalid employment type:", data.employmentType);
        setSubmissionMessage('Invalid employment type. Please select a valid option.');
        setMessageType('error');
        return;
      }

      // Validate item_category
      const allowedItemCategories = ['Electronics', 'Furniture', 'Agriculture', 'Services', 'Other'];
      if (!allowedItemCategories.includes(data.itemCategory)) {
        console.error("Invalid item category:", data.itemCategory);
        setSubmissionMessage('Invalid item category. Please select a valid option.');
        setMessageType('error');
        return;
      }

      // Validate required fields
      if (!data.fullName || !data.nationalId || !data.phoneNumber || !data.emailAddress || !data.monthlyIncome || !data.loanAmount) {
        console.error("Missing required fields");
        setSubmissionMessage('Please fill in all required fields.');
        setMessageType('error');
        return;
      }

      // Validate file upload
      if (uploadedFiles.length === 0) {
        console.error("No files uploaded");
        setSubmissionMessage('Please upload required documents.');
        setMessageType('error');
        return;
      }

      // Upload files to Supabase storage first
      let documentUrls = [];
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const fileName = `loan-applications/${Date.now()}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('loan-documents')
            .upload(fileName, file);

          if (uploadError) {
            console.error("File upload failed:", uploadError.message);
            throw uploadError;
          } else {
            console.log("File uploaded successfully:", uploadData);
          }

          documentUrls.push(uploadData.path);
        }
      }

      // Insert application data
      const { data: insertedData, error } = await supabase
        .from('loan_applications')
        .insert([
          {
            full_name: data.fullName,
            date_of_birth: data.dateOfBirth,
            national_id: data.nationalId,
            phone_number: data.phoneNumber,
            email: data.emailAddress,
            monthly_income: parseFloat(data.monthlyIncome) || 0,
            loan_amount: parseFloat(data.loanAmount) || 0,
            reference_person_name: data.referencePersonName,
            reference_person_number: data.referencePersonNumber,
            occupation_employer: data.occupationEmployer,
            employment_type: data.employmentType,
            item_category: data.itemCategory,
            preferred_payment_plan: data.preferredPaymentPlan,
            working_place: data.workingPlace,
            agree_terms: data.agreeTerms,
            consent_information: data.consentInformation,
            document_urls: documentUrls,
            status: 'pending',
            created_at: new Date().toISOString(),
          }
        ])
        .select(); // Return the inserted row(s)

      if (error) {
        console.error("Error submitting:", error.message);
        throw error;
      } else {
        console.log("Application submitted:", insertedData);
      }

      setSubmissionMessage('Application Submitted Successfully!');
      setMessageType('success');
      reset();
      setUploadedFiles([]);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmissionMessage('Submission Failed. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalId">National ID *</Label>
                  <Input id="nationalId" placeholder="Enter your national ID" {...register('nationalId')} />
                  {errors.nationalId && <p className="text-red-500 text-sm">{errors.nationalId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !watch('dateOfBirth') && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch('dateOfBirth') ? format(watch('dateOfBirth'), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={watch('dateOfBirth')}
                        onSelect={(date) => setValue('dateOfBirth', date)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input id="phoneNumber" type="tel" placeholder="Enter your phone number" {...register('phoneNumber')} />
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address *</Label>
                  <Input id="emailAddress" type="email" placeholder="Enter your email address" {...register('emailAddress')} />
                  {errors.emailAddress && <p className="text-red-500 text-sm">{errors.emailAddress.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referencePersonName">Reference Person Name *</Label>
                  <Input id="referencePersonName" placeholder="Enter reference person's name" {...register('referencePersonName')} />
                  {errors.referencePersonName && <p className="text-red-500 text-sm">{errors.referencePersonName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referencePersonNumber">Reference Person Number *</Label>
                  <Input id="referencePersonNumber" placeholder="Enter reference person's phone number" {...register('referencePersonNumber')} />
                  {errors.referencePersonNumber && <p className="text-red-500 text-sm">{errors.referencePersonNumber.message}</p>}
                </div>
              </div>
            </div>

            {/* Employment & Income Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-1 text-gray-700">2. Employment & Income Details</h2>
              <p className="text-sm text-gray-500 mb-6">Fill This Area</p>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="occupationEmployer">Occupation / Employer Name *</Label>
                  <Input id="occupationEmployer" placeholder="Enter your occupation or employer name" {...register('occupationEmployer')} />
                  {errors.occupationEmployer && <p className="text-red-500 text-sm">{errors.occupationEmployer.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select onValueChange={(value) => setValue('employmentType', value)}>
                    <SelectTrigger>
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
                  {errors.employmentType && <p className="text-red-500 text-sm">{errors.employmentType.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemCategory">Item Category *</Label>
                  <Select onValueChange={(value) => setValue('itemCategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Services">Services</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.itemCategory && <p className="text-red-500 text-sm">{errors.itemCategory.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredPaymentPlan">Preferred Payment Plan *</Label>
                  <Select onValueChange={(value) => setValue('preferredPaymentPlan', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="8-months">8 Months</SelectItem>
                      <SelectItem value="1-year">1 Year</SelectItem>
                      <SelectItem value="2-years">2 Years</SelectItem>
                      <SelectItem value="3-years">3 Years</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.preferredPaymentPlan && <p className="text-red-500 text-sm">{errors.preferredPaymentPlan.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingPlace">Working Place *</Label>
                  <Input id="workingPlace" placeholder="Enter your working place" {...register('workingPlace')} />
                  {errors.workingPlace && <p className="text-red-500 text-sm">{errors.workingPlace.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                  <Input id="monthlyIncome" type="number" placeholder="Enter your monthly income" {...register('monthlyIncome')} />
                  {errors.monthlyIncome && <p className="text-red-500 text-sm">{errors.monthlyIncome.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount *</Label>
                  <Input id="loanAmount" type="number" placeholder="Enter loan amount" {...register('loanAmount')} />
                  {errors.loanAmount && <p className="text-red-500 text-sm">{errors.loanAmount.message}</p>}
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
                  id="agreeTerms" 
                  {...register('agreeTerms', {
                    setValueAs: (value) => Boolean(value)
                  })}
                />
                <Label htmlFor="agreeTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Agree to Aduunyo Solutions' Terms & Conditions
                </Label>
              </div>
              {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms.message}</p>}
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consentInformation" 
                  {...register('consentInformation', {
                    setValueAs: (value) => Boolean(value)
                  })}
                />
                <Label htmlFor="consentInformation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I consent to my information being used for loan assessment purposes
                </Label>
              </div>
              {errors.consentInformation && <p className="text-red-500 text-sm">{errors.consentInformation.message}</p>}
              
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
                {errors.uploadedDocument && <p className="text-red-500 text-sm">{errors.uploadedDocument.message}</p>}
                
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
                <Button variant="outline" type="button" className="rounded-lg">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}