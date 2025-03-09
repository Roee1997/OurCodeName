import React from "react";
import LoginForm from "../components/Login";
import BackgroundImage from "../components/BackgroundImage";
import Footer from "../components/Footer";
import Header from "../components/Header";
import codenamesImage from '../assets/codename.webp';

const LoginPage = () => {
    return (
        <div className="relative min-h-screen flex flex-col">
          {/* רקע */}
          <BackgroundImage image={codenamesImage} />

          {/* תוכן ממורכז */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-4">
            <Header />
            <LoginForm />
          </div>

          {/* פוטר */}
          <Footer className="mt-auto" />
        </div>
    );
};

export default LoginPage;
