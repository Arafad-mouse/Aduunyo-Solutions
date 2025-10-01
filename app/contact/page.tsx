'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  "text-0": z.string(),
  "text-input-0": z.string().min(1, { message: "This field is required" }),
  "text-input-1": z.string().min(1, { message: "This field is required" }),
  "email-input-0": z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "This field is required" }),
  "tel-input-0": z.string(),
  "select-0": z.string().min(1, { message: "This field is required" }),
  "textarea-0": z
    .string()
    .min(1, { message: "This field is required" })
    .min(10, { message: "Must be at least 10 characters" }),
});

export default function ContactForm() {
  const supabase = createClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "text-0": "",
      "text-input-0": "",
      "text-input-1": "",
      "email-input-0": "",
      "tel-input-0": "",
      "select-0": "",
      "textarea-0": "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Insert the form data into the contact-us table
      const { data, error } = await supabase
        .from('contact_us')  // Changed from 'contact-us' to 'contact_us' to match your table name
        .insert([
          { 
            first_name: values['text-input-0'],
            last_name: values['text-input-1'],
            email: values['email-input-0'],
            phone_number: values['tel-input-0'],  // Changed from 'phone' to 'phone_number'
            subject: values['select-0'],
            message: values['textarea-0']
            // Removed created_at as it has a default value in the database
          },
        ])
        .select()

      if (error) throw error;
      
      // Show success message
      toast.success('Your message has been sent successfully!');
      
      // Reset the form
      form.reset();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="text-center p-8 bg-[#5ca34c] border-none" style={{ boxShadow: 'none', borderColor: 'none' }}>
            <CardTitle className="text-3xl font-bold text-white" style={{ fontSize: '2rem' }}>Contact Us</CardTitle>
            <CardDescription className="text-lg text-white mt-2" style={{ fontSize: '1rem' }}>
              Get in touch with our team for any inquiries.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                onReset={onReset}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="text-input-0"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800">First Name</FormLabel>
                        <FormControl style={{ backgroundColor: '#f9f9f9' ,borderColor: '#c1c1c1'}}>
                          <Input placeholder="First Name" {...field} className="bg-gray-100"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="text-input-1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800">Last Name</FormLabel>
                        <FormControl style={{ backgroundColor: '#f9f9f9' ,borderColor: '#c1c1c1'}}>
                          <Input placeholder="Last Name" {...field} className="bg-gray-100"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email-input-0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Email</FormLabel>
                      <FormControl style={{ backgroundColor: '#f9f9f9' ,borderColor: '#c1c1c1'}}>
                        <Input type="email" placeholder="example@gmail.com" {...field} className="bg-gray-100"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tel-input-0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Phone Number</FormLabel>
                      <FormControl style={{ backgroundColor: '#f9f9f9' ,borderColor: '#c1c1c1'}}>
                        <Input type="tel" placeholder="+252 (63) 000-0000" {...field} className="bg-gray-100"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="select-0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} >
                        <FormControl>
                          <SelectTrigger style={{ backgroundColor: '#f9f9f9' ,borderColor: '#c1c1c1', width: '100%'}}>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="sales">Sales Question</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="textarea-0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Message</FormLabel>
                      <FormControl>
                        <Textarea style={{ backgroundColor: '#f9f9f9' ,borderColor: '#c1c1c1'}}
                          placeholder="Please provide details about your inquiry..."
                          className="min-h-[120px] bg-gray-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-4 pt-4">
                  <Button type="reset" variant="outline" size="default" className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-none">
                    Reset
                  </Button>
                  <Button type="submit" size="default" className="bg-[#5ba44c] hover:bg-[#5ba44c]/90 text-white border-none">
                    Send Message
                  </Button> 
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
