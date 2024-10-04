import AuthForm from "../components/common/AuthForm";

const Auth = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-1 overflow-hidden">
                <AuthForm />
            </div>
        </div>
    );
};

export default Auth;