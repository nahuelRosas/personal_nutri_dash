import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  Text,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { AtSignIcon } from "@chakra-ui/icons";

import { useAuthProvider } from "@/modules/auth/hooks/useAuthProvider";
import { AUTH_VALIDATIONS } from "@/modules/auth/message/auth-messages";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const { handleSignIn, statusState } = useAuthProvider();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = AUTH_VALIDATIONS.EMAIL_REQUIRED;
    else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email))
      newErrors.email = AUTH_VALIDATIONS.EMAIL_INVALID;

    if (!password) newErrors.password = AUTH_VALIDATIONS.PASSWORD_REQUIRED;
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)/.test(password))
      newErrors.password = AUTH_VALIDATIONS.PASSWORD_INVALID;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await handleSignIn(email, password);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Box maxW="500px" mx="auto" px="4" py="8">
      <Text fontSize="4xl" fontWeight="bold" mb="6" color="primary">
        Welcome Back
      </Text>
      <form onSubmit={onSubmit}>
        <Stack spacing="4">
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputLeftElement>
                <AtSignIcon />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            {errors.email && (
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            )}
          </FormControl>

          {statusState.signIn.error && (
            <FormErrorMessage>
              {Array.isArray(statusState.signIn.error)
                ? statusState.signIn.error.join(", ")
                : statusState.signIn.error}
            </FormErrorMessage>
          )}

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={statusState.signIn.loading}
            loadingText="Please wait..."
            size="lg"
            width="full"
          >
            Login
          </Button>

          <Stack spacing="4" mt="4">
            <Text fontSize="sm" textAlign="center">
              Don't have an account?{" "}
              <Button variant="link" colorScheme="teal">
                <Link to="/auth/register">Join now</Link>
              </Button>
            </Text>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}

export default Login;
