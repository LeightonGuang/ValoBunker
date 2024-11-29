"use server";

import { getSupabaseServer } from "@/utils/supabase/server";

interface ValidateSignUpDataType {
  username: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
}

const validateSignUpData = ({
  username,
  email,
  confirmEmail,
  password,
  confirmPassword,
}: ValidateSignUpDataType) => {
  const errors = {
    hasEmptyUserName: username === "",
    hasEmptyEmail: email === "",
    hasInvalidEmail: !email.includes("@"),
    hasEmptyConfirmEmail: confirmEmail === "",
    hasInvalidConfirmEmail: email !== confirmEmail,
    hasEmptyPassword: password === "",
    hasEmptyConfirmPassword: confirmPassword === "",
    hasInvalidPassword: password !== confirmPassword,
  };

  const isSignUpFormValid: boolean = Object.values(errors).every(
    (value) => value === false,
  );

  return { errors, isSignUpFormValid };
};

export const signUp = async (
  username: string,
  email: string,
  confirmEmail: string,
  password: string,
  confirmPassword: string,
): Promise<{ data: any; errors: any; isSignUpFormValid: boolean }> => {
  const { errors, isSignUpFormValid } = validateSignUpData({
    username,
    email,
    confirmEmail,
    password,
    confirmPassword,
  });

  if (!isSignUpFormValid) {
    return { data: null, errors, isSignUpFormValid };
  }

  if (isSignUpFormValid) {
    const supabaseServer = getSupabaseServer();

    const { data, error: signUpError } = await supabaseServer.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: username,
          full_name: username,
        },
      },
    });

    if (signUpError) {
      return {
        data: null,
        errors: { signUpError: signUpError.message },
        isSignUpFormValid,
      };
    }

    return { data, errors, isSignUpFormValid };
  }

  return { data: null, errors, isSignUpFormValid };
};
