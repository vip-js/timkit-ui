import { Input, Button } from "@timui/react";

export default function BasicLoginForm() {
    return (
        <main className="w-full h-[700px] flex flex-col items-center justify-center px-4">
            <div className="max-w-sm w-full text-gray-600">
                <div className="text-center">
                    <img src="https://timkit-ui.com/logo.svg" width={150} className="mx-auto" />
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
                        <p className="">Don't have an account? <a href="javascript:void(0)" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a></p>
                    </div>
                </div>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mt-8 space-y-5"
                >
                    <div>
                        <label className="font-medium">
                            Email
                        </label>
                        <Input
                            type="email"
                            required
                            className="w-full mt-2"
                        />
                    </div>
                    <div>
                        <label className="font-medium">
                            Password
                        </label>
                        <Input
                            type="password"
                            required
                            className="w-full mt-2"
                        />
                    </div>
                    <Button
                        className="w-full"
                    >
                        Sign in
                    </Button>
                    <div className="text-center">
                        <a href="javascript:void(0)" className="hover:text-indigo-600">Forgot password?</a>
                    </div>
                </form>
            </div>
        </main>
    )
}
        