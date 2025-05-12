import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from "../../../controllers/UserStore";
import { Loader, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
interface SignInFormData {
  email: string;
  password: string;
}

const LoginForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
  const login = useUserStore((state) => state.login);
  const data = useUserStore((state) => state);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: SignInFormData) => {
        const response = await login(data);
        if (response) {
            navigate('/dashboard');
        }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <div className={cn("w-full flex flex-col items-center  gap-6", className)} {...props}>
          <Card className="overflow-hidden w-full border">
            <CardContent className="grid p-0">
              <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative ">
                      <img
                        src="/logo.png"
                        alt="Image"
                        className=" h-20 w-22 object-cover"
                      />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your Fuse account
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                      {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="********"
                        {...register('password', { required: 'Password is required' })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={data.isProcessing}>
                    {data.isProcessing ? <Loader className='animate-spin' /> : 'Log In'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By logging in, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;