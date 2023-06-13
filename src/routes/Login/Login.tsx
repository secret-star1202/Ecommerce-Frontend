import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useLoginUserMutation } from "../../api/apiSlice";
import { isApiError, isErrorWithMessage } from "../../api/helpers/errors";

const Login = () => {
  const [loginUser, { error }] =
    useLoginUserMutation();

  const renderError = (err: unknown) => {
    if (isApiError(err)) {
      // you can access all properties of `FetchBaseQueryError` here
      return <span className="error-message"> {err.data.message} </span>;
    } else if (isErrorWithMessage(err)) {
      // you can access a string 'message' property here
      <span className="error-message"> {err.message} </span>;
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          padding: "4rem 2rem",
          border: "1px solid grey",
          borderRadius: "4px",
        }}
      >
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),
            password: Yup.string()
              .password()
              // disable password requirements
              .min(0)
              .minLowercase(0)
              .minUppercase(0)
              .minNumbers(0)
              .minSymbols(0)
              .required("Passowrd is required"),
          })}
          onSubmit={async (values, { resetForm }) => {
            try {
              await loginUser(values).unwrap();
              // if response is ok reset the form
              resetForm();
            } catch (error) {
              console.error("Error:", error);
            }
          }}
        >
          {({ isSubmitting }) => (
            <>
              <Typography
                variant="h5"
                style={{ fontWeight: "500", marginBottom: "24px" }}
                component="h1"
              >
                Log in
              </Typography>
              <Form className="form">
                <Field
                  name="email"
                  placeholder="Email"
                  as={TextField}
                  label="Email"
                />
                <ErrorMessage
                  component="span"
                  className="error-message"
                  name="email"
                />

                <Field
                  name="password"
                  type="password"
                  as={TextField}
                  label="Passowrd"
                />
                <ErrorMessage
                  component="span"
                  className="error-message"
                  name="password"
                />

                {renderError(error)}

                <Button
                  variant="contained"
                  style={{ opacity: isSubmitting ? 0.5 : 1 }}
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Login;
