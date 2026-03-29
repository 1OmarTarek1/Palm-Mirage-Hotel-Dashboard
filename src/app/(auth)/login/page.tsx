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
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { toast } from "sonner";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()
  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onlogin(values: loginSchemaType) {
    // const data = await loginUser(values);
    // console.log(data);
    // if(data.message == "Done"){che
    //   router.push("/table")
    // }

    const response = await signIn("credentials",{
      email:values.email,
      password:values.password,
      redirect:false
    })

    if(response?.ok){
      router.push('/')
      toast.success("logged in success ✅",{
        position:"top-right",
        duration:3000
      })
    }else{
      toast.error(response?.error ,{
        position:"top-right",
        duration:3000
      })
    }
  }
  

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hotel-login-bg.png"
          alt="Hotel Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-[500px] bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">        
        <CardHeader className="space-y-2 pt-10 text-center text-white">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome Back 👋
          </CardTitle>
          <p className="text-white/70 text-sm">
            Experience the future of management. Please log in to your account.
          </p>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onlogin)} className="space-y-6">
            <CardContent className="space-y-5 px-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-white/80 font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="Enter Your Email"
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-white/80 font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="px-8 pb-10">
              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300 transform active:scale-[0.98]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[120px] -z-1" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[120px] -z-1" />
    </div>
  );
}
