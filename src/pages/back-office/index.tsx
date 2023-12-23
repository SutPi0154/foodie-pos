import { useAppDispatch } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  if (!session) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Box>
          <Typography>not sign in</Typography>
          <Button
            variant="contained"
            onClick={() => {
              signIn("google", {
                callbackUrl: "/back-office",
              });
            }}
          >
            sign in
          </Button>
        </Box>
      </Box>
    );
  } else {
    router.push("/back-office/orders");
  }
}
