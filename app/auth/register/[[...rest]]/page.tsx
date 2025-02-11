import React from "react";
import Image from "next/image";
import PatternOne from "@/public/images/illustration/login-pattern-1.svg";
import PatternTwo from "@/public/images/illustration/login-pattern-2.svg";
import PatternThree from "@/public/images/illustration/login-pattern-3.svg";
import IntroductionSlider from "@/app/auth/login/components/IntroductionSlider";
import { SignUp } from '@clerk/nextjs'
import EZDocsLogo from "@/public/images/general/ezdocsLogo";

const Register = () => {
  return (
    <div className="flex flex-row items-center justify-center h-screen">
    <div className="flex flex-col items-center justify-center gap-8 w-3/5 h-full">
    <div className="flex flex-col w-full p-8 items-start justify-start gap-2">
    <EZDocsLogo />
    </div>  
    <div className="flex flex-col w-full h-full p-8 items-center justify-start gap-2">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-gradient-to-r from-[#09FF8D] to-[#0CD9E7] text-sm text-black rounded-md',
            formFieldInput: 'bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-[#0CD9E7] rounded-md',
            formFieldLabel: 'text-gray-700 font-semibold',
            formFieldErrorText: 'text-red-500 text-xs',
            formButtonResetPassword: 'text-[#0CD9E7] hover:underline',
            socialButtonsBlockButton: 'bg-white text-black border border-gray-300 hover:bg-gray-100 rounded-md',
            headerTitle: 'text-2xl font-bold text-black',
            headerSubtitle: 'text-gray-500',
            card: 'shadow-sm rounded-lg',
            form: 'space-y-4',
          },
        }}
      />
      </div>   
    </div>
    <div className="flex flex-col items-center justify-center w-2/5 h-full p-8">
      <div className="relative flex flex-row items-center justify-center bg-gradient-to-br from-[#09FF8D] to-[#0CD9E7] w-full h-full rounded-3xl overflow-hidden gap-16">
        <div className="flex flex-col justify-center w-fit h-full">
          <Image
            src={PatternOne}
            alt="Pattern One"
            className="w-full h-fit"
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-16 w-fit h-full">
          <div className="flex flex-col items-center justify-end w-full">
            <Image
              src={PatternTwo}
              alt="Pattern Two"
              className="w-full h-full"
            />
          </div>
          <Image
            src={PatternThree}
            alt="Pattern Three"
            className="w-fit h-2/3"
          />
        </div>
        <IntroductionSlider />
      </div>
    </div>
  </div>
  );
};

export default Register;
