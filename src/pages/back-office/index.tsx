import { Box, Button, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const data = useSession();
  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    return (
      <Box>
        <Typography>not sign in</Typography>
        <Button
          variant="contained"
          onClick={() => {
            signIn("google", { callbackUrl: "/back-office" });
          }}
        >
          sign in
        </Button>
      </Box>
    );
  } else {
    router.push("/back-office/orders");
  }
}
