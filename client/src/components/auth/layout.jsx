import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="flex min-h-screen w-full bg-gray-100">
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 w-1/2 px-12 py-8  shadow-md">
                <div className="max-w-md space-y-6 text-center text-white">
                    <h1 className="text-4xl font-extrabold text-white animate-bounce">
                        Welcome to Shopmerce
                    </h1>
                    <p className="text-lg font-semibold text-white">
                        Your one-stop shop for everything you need!
                    </p>
                </div>
            </div>
            <div className="flex flex-1 items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-400 px-4 py-12 sm:px-6 lg:px-8">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;