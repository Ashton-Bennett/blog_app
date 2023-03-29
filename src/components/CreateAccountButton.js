import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import useField from "../hooks/useField";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useState } from "react";
import createUserAccount from "../services/createAccount";
import { useDispatch } from "react-redux";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { useNavigate } from "react-router-dom";
import { loggedInUser } from "../reducers/userReducer";

const formFieldStyle = {
  color: "white",
  marginTop: "2em",
  marginBottom: "2em",
  minWidth: "200px",
};

const SectionStyle = {
  backgroundColor: "#534FA5",
  color: "white",
  width: "100%",
  border: "2px solid black",
};

const HeaderStyle = {
  fontSize: "3rem",
  fontWeight: "700",
  marginTop: "1em",
  textAlign: "center",
  marginBottom: "1em",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  justifyItems: "flex-start",
  alignItems: "center",
};

function PasswordInput({ password, setPassword }) {
  const [show, setShow] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    setShow(!show);
  };

  const handlePasswordEntry = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div style={formFieldStyle}>
      <InputGroup className="inputGroupBlack">
        <InputLeftElement
          children="password:"
          style={{ paddingRight: "1.5em" }}
        />
        <Input
          size="lg"
          variant="flushed"
          focusBorderColor="black"
          color="black"
          type={show ? "text" : "password"}
          value={password}
          onChange={handlePasswordEntry}
        />
        <InputRightElement width="4.5rem">
          <Button
            onClick={handleClick}
            type={show ? "Hide" : "Show"}
            color="white"
            size="lg"
            variant="ghost"
            _hover={{ color: "#9765E0" }}
          >
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </div>
  );
}

const CreateAccountButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, usernameReset] = useField("text");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newUser = {
      username: username.value,
      name: username.value,
      password: password,
    };

    try {
      await createUserAccount.create(newUser);
      toast({
        title: "Account created!",
        status: "success",
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
      onClose();
      const userLogin = await loginService.login(newUser);
      window.localStorage.setItem(
        "loggedNoteappUser",
        JSON.stringify(userLogin)
      );
      blogService.setToken(userLogin.token);
      dispatch(loggedInUser(userLogin));
      usernameReset();
      setPassword("");
      return navigate("/blogs");
    } catch (error) {
      console.log("Error in create:", error);
      toast({
        title: "Invalid username or password",
        status: "error",
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
    }
  };

  return (
    <div>
      <Button
        rightIcon={<ArrowForwardIcon />}
        color="#9765E0"
        size="lg"
        variant="ghost"
        _hover={{ color: "white" }}
        onClick={onOpen}
        key={"full"}
        m={4}
      >
        create account
      </Button>

      <Drawer
        placement={"bottom"}
        onClose={onClose}
        isOpen={isOpen}
        size={"full"}
      >
        <DrawerOverlay />
        <DrawerContent style={SectionStyle}>
          <DrawerCloseButton />
          <DrawerHeader>
            {" "}
            <h1 style={HeaderStyle}>Create Account</h1>
          </DrawerHeader>
          <DrawerBody>
            <form style={formStyle} id="create account" onSubmit={handleSubmit}>
              <div style={formFieldStyle}>
                <InputGroup className="inputGroupBlack">
                  <InputLeftElement
                    children="username:"
                    style={{ paddingRight: "1.5em" }}
                  />
                  <Input
                    size="lg"
                    variant="flushed"
                    focusBorderColor="black"
                    color="black"
                    {...username}
                  />
                </InputGroup>
              </div>

              <PasswordInput password={password} setPassword={setPassword} />

              <Button
                rightIcon={<ArrowForwardIcon />}
                type="button"
                onClick={handleSubmit}
                color="#9765E0"
                size="lg"
                variant="ghost"
                _hover={{ color: "white" }}
              >
                submit
              </Button>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CreateAccountButton;
