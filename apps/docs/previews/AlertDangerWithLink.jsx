import { Alert } from "@timui/react";

export default function AlertDangerWithLink() {
    return (
        <div className="max-w-5xl mx-auto mt-12 px-4 md:px-8">
            <Alert variant="destructive" className="p-4">
                <Alert.Description className="sm:text-sm">
                    There is no account associated with this email address. <a href="javascript:void(0)" className="underline font-medium hover:text-red-700">Sign up?</a>
                </Alert.Description>
            </Alert>
        </div>
    )
}
        