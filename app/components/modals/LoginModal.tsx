"use client"
import {signIn} from "next-auth/react"
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
// import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
// import { toast } from "react-hot-toast";
import {
    FieldValues,
    SubmitHandler,
    useForm
} from "react-hook-form";
import Modal from "./Modal"
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Heading from "../Heading";
import Inputs from "../inputs/Inputs";
import { toast } from "react-hot-toast"
import Button from "../Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";


const LoginModal = () => {
    const router = useRouter();
    const registerModal = useRegisterModal();
    const LoginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name:"",
            password: ""
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn("credentials",{
            ...data,
            redirect:false,

        })
        .then(callback=>{
            setIsLoading(false);
            if(callback?.ok){
                toast.success("Logged In Successfully");
                router.refresh();
                LoginModal.onClose();
            }

            if(callback?.error){
               
                toast.error(callback.error);
            }
        })
    }
    const toggle = useCallback(()=>{
    LoginModal.onClose();
    registerModal.onOpen();
    },[LoginModal,registerModal]);
    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome Back" subtitle="Login to your accoount!" />
            <Inputs id="email"
                label="Email"
                disabled={isLoading}
                errors={errors}
                register={register}
                required
            />

            <Inputs id="password"
                label="Password"
                type="password" 
                disabled={isLoading}
                errors={errors}
                register={register}
                required
            />
        </div>
    )
    
    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr/>
            <Button 
        outline 
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn('google')} 
      />
      <Button 
        outline 
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn('github')}
      />
      <div 
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>Did'nt have an account?
          <span 
            onClick={toggle} 
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
            > Create an account </span>
        </p>
      </div>
     </div>
    )

    return (
        <Modal disabled={isLoading}
            isOpen={LoginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onClose={LoginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default LoginModal