import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

type ForgetpasswordformData = {
  email: string;
};

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetpasswordformData>();
  const navigate = useNavigate();

  const ForgetPasswordMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      await axios
        .post(`/api/users/reset-password`, { email: data.email },{
          headers:{
             'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          setTimeout(() => {
            toast.success("A default password will be sent to this email");
          }, 100);
          navigate("/login");
          return response.data;
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            const errorMessage =
              error.response?.data?.message || "Failed to Update Password";
            toast.error(errorMessage);
          }
        });
    },
  });
  const onSubmit = async (data: ForgetpasswordformData) => {
    ForgetPasswordMutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-svh bg-muted md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <div className={cn("w-full flex flex-col items-center  gap-6")}>
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
                    <h1 className="text-2xl font-bold">Forget-Pssword</h1>
                    <p className="text-balance text-muted-foreground">
                      Enter your email to reset your password
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={ForgetPasswordMutation.isPending}
                  >
                    {ForgetPasswordMutation.isPending ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Submit Email"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By logging in, you agree to our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
