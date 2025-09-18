'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success('Your message has been sent successfully!');
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <div className="container max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Get in touch with our team for any inquiries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onReset={onReset}
              className="space-y-6 @container"
            >
              <div className="grid grid-cols-12 gap-4">
                <div key="text-0" id="text-0" className="col-span-12 col-start-auto">
                  <p className="leading-7 not-first:mt-6">
                    <span className="text-lg font-semibold">Contact Us</span>
                    <br />
                    <span className="text-sm text-muted-foreground">
                      Get in touch with our team for any inquiries.
                    </span>
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="text-input-0"
                  render={({ field }) => (
                    <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                      <FormLabel className="flex shrink-0">First Name</FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              key="text-input-0"
                              placeholder="John"
                              type="text"
                              id="text-input-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="text-input-1"
                  render={({ field }) => {
                    const { ref, ...restField } = field;
                    return (
                      <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                        <FormLabel className="flex shrink-0">Last Name</FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <div className="relative w-full">
                              <Input
                                ref={ref}
                                key="text-input-1"
                                placeholder="Doe"
                                type="text"
                                id="text-input-1"
                                {...restField}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="email-input-0"
                  render={({ field }) => (
                    <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                      <FormLabel className="flex shrink-0">Email</FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              key="email-input-0"
                              placeholder="john@example.com"
                              type="email"
                              id="email-input-0"
                              autoComplete="off"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tel-input-0"
                  render={({ field }) => (
                    <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                      <FormLabel className="flex shrink-0">Phone Number</FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              key="tel-input-0"
                              placeholder="+1 (555) 000-0000"
                              type="tel"
                              id="tel-input-0"
                              autoComplete="off"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="select-0"
                  render={({ field }) => (
                    <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                      <FormLabel className="flex shrink-0">Subject</FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <Select
                            key="select-0"
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem key="general" value="general">
                                General Inquiry
                              </SelectItem>
                              <SelectItem key="support" value="support">
                                Technical Support
                              </SelectItem>
                              <SelectItem key="sales" value="sales">
                                Sales Question
                              </SelectItem>
                              <SelectItem key="billing" value="billing">
                                Billing Question
                              </SelectItem>
                              <SelectItem key="other" value="other">
                                Other
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="textarea-0"
                  render={({ field }) => (
                    <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                      <FormLabel className="flex shrink-0">Message</FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <Textarea
                            key="textarea-0"
                            id="textarea-0"
                            placeholder="Please provide details about your inquiry..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="col-span-12 flex justify-end gap-4">
                  <Button type="reset" variant="outline">
                    Reset
                  </Button>
                  <Button type="submit">
                    Send Message
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
