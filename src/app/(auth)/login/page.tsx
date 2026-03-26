"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loginSchema, loginSchemaType } from "@/schema/auth.schema";
import { loginUser } from "@/services/auth.services";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";

export default function Login() {
  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onlogin(values: loginSchemaType) {
    const data = await loginUser(values);
  }

  return (
    <Card className="w-full sm:max-w-md m-auto mt-40">
      <CardHeader>
        <CardTitle className="text-center">Welcome To DashBoard 👋</CardTitle>
        <p className="my-5">Login Now !</p>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onlogin)} className="space-y-6">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Please Enter Your Email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="Please Enter Your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
