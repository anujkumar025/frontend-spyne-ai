"use client";

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

type InputProps = {
  title: string;
  description: string;
  tags: {
    carType: string;
    company: string;
    dealer: string;
  };
  images: FileList;
};

export default function CreateProduct() {
    const form = useForm<InputProps>({
        defaultValues: {
          title: "",
          description: "",
          tags: {
            carType: "",
            company: "",
            dealer: "",
          },
          images: new DataTransfer().files, // Initialize images with an empty FileList
        },
      });
      const router = useRouter();

    async function onSubmit(data: InputProps) {
        const formData = new FormData();
        
        // Append text fields
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('tags[carType]', data.tags.carType);
        formData.append('tags[company]', data.tags.company);
        formData.append('tags[dealer]', data.tags.dealer);
      
        // Append files directly
        Array.from(data.images).forEach((file) => {
          formData.append('images', file);
        });
        // Add file validation before submission
        console.log(data);

        if (data.images.length > 10) {
            alert('Maximum 10 images allowed');
            return;
        }
      
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.post("http://localhost:5000/api/createcars", formData, {
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log("Response:", response.data);
          router.push('/');
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      }


  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      <Card className="w-full max-w-2xl p-6 space-y-6 shadow-lg">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Create New Car Listing</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter vehicle title" 
                      className="focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Enter detailed description"
                      className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Tags Section */}
            <div className="space-y-4">
              <FormLabel className="font-semibold">Vehicle Details</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="tags.carType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Car Type</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="SUV, Sedan, etc." 
                          className="focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags.company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Company</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Manufacturer" 
                          className="focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags.dealer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Dealer</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Dealer name" 
                          className="focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="images"
              render={({ field: { onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Images</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <span className="i-lucide-upload-cloud text-xl mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Drag & drop or click to upload
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Up to 10 images (5MB each)
                          </p>
                        </div>
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Image Previews */}
            {form.watch("images")?.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {Array.from(form.watch("images")).map((file, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
              >
                Create Listing
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
