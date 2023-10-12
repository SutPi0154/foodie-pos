import { Box, Button } from "@mui/material";
import { signIn } from "next-auth/react";

const SignIn = () => {
  return (
    <Box>
      custom sign in page
      <Button
        onClick={() => {
          signIn("google", { callbackUrl: "/" });
        }}
      >
        sign in with google
      </Button>
    </Box>
  );
};

export default SignIn;
