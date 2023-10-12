import { Box, Button, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const data = useSession();
  console.log(data);
  const { data: session } = useSession();
  console.log(session);
  if (!session)
    return (
      <Box>
        <Typography>not sign in</Typography>
        <Button
          variant="contained"
          onClick={() => {
            signIn();
          }}
        >
          sign in
        </Button>
      </Box>
    );

  return (
    <>
      <Box>Home</Box>
      <Button
        variant="contained"
        onClick={() => {
          signo;
        }}
      >
        sign out
      </Button>
    </>
  );
}
