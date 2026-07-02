import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import { EmailInput, PasswordInput } from "@/components/form";
interface SignInFormData {
  email: string;
  password: string;
}

const LoginForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
  const login = useAuthStore((state) => state.login);
  const data = useAuthStore((state) => state);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const onSubmit = async (data: SignInFormData) => {
    const response = await login(data);
    if (response) {
      if (redirectPath) {
        navigate(decodeURIComponent(redirectPath));
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-svh bg-muted md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <div className={cn("w-full flex flex-col items-center  gap-6", className)} {...props}>
          <Card className="w-full overflow-hidden border">
            <CardContent className="grid p-0">
              <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative ">
                      <img
                        src="/logo.png"
                        alt="Image"
                        className="object-cover h-20 w-22"
                      />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your Best Suit account
                    </p>
                  </div>
                  <EmailInput
                    {...register('email', { required: 'Email is required' })}
                    label="Email"
                    leftIcon={Mail}
                    error={errors.email?.message}
                  />
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="/forget-password"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <PasswordInput
                      {...register('password', { required: 'Password is required' })}
                      placeholder="********"
                      error={errors.password?.message}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={data.isProcessing}>
                    {data.isProcessing ? <Loader className='animate-spin' /> : 'Log In'}
                  </Button>
                </div>
              </form>

              <p className="text-center text-xs pb-6">
                Don't have an account? <a href="/register" className="underline">Register as a resident</a>
              </p>

            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By logging in, you agree to our <a href="terms-and-conditions">Terms of Service</a>{" "}
            and <a href="terms-and-conditions">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;