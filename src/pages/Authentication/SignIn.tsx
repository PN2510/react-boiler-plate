import { useNavigate } from 'react-router-dom';
import Logo from '../../images/logo/image.png';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useLoginStore } from '../../store/useLoginStore';
import { LockKeyhole, LockKeyholeOpen, Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const loginSchema = yup
  .object({
    username: yup.string().required().email(),
    password: yup.string().required(),
  })
  .required();

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginWithEmail } = useLoginStore();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const onSubmit = async ({ username, password }: any) => {
    const success = await loginWithEmail({ username, password });
    if (success) {
      navigate('/tasks');
    } else {
      toast.error('Invalid credentials');
    }
  };
  return (
    <div className="h-screen dark:bg-boxdark-2">
      <div className="flex flex-wrap items-center h-full">
        <div className="hidden w-full xl:flex xl:items-center xl:justify-center xl:w-1/2 bg-slate-50 dark:bg-boxdark-2 h-full">
          <div className="py-17.5 px-26 text-center flex flex-col items-center gap-4">
            <img className="hidden md:block md:w-31" src={Logo} alt="Logo" />
            <p className="2xl:px-20 md:text-3xl font-medium">
              {import.meta.env.VITE_APP_NAME}
            </p>
          </div>
        </div>

        <div className="w-full xl:w-1/2 h-full xl:flex xl:items-center">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5 h-full flex flex-col justify-center">
            <div className="w-full mb-10 flex gap-2 items-center justify-center">
              <img className="flex h-18 md:hidden" src={Logo} alt="Logo" />
              <h2 className="text-xl font-bold text-black dark:text-white">
                Sign In to {import.meta.env.VITE_APP_NAME}
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register('username')}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border text-black dark:text-white border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />

                  <span className="absolute right-4 top-4">
                    <Mail className="text-slate-400" />
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={!showPassword ? 'password' : 'text'}
                    {...register('password')}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border text-black dark:text-white border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <LockKeyhole className="text-slate-400 cursor-pointer" />
                    ) : (
                      <LockKeyholeOpen className="text-slate-400 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Sign In"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
