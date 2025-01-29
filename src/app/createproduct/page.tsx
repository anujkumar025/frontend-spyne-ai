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
    <div className="w-screen h-screen flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags (Car Type, Company, Dealer) */}
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="tags.carType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags.company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags.dealer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dealer</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field: { onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
