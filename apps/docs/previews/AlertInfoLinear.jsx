import { Alert } from "@timui/react";

export default function AlertInfoLinear() {
    return (
        <div className="max-w-5xl mx-auto mt-12 px-4 md:px-8">
            <Alert className="p-4">
                <Alert.Description className="sm:text-sm">
                    we have just released a new app version with so many features, you can <a href="javascript:void(0)" className="underline font-medium hover:text-blue-700">check it out?</a>
                </Alert.Description>
            </Alert>
        </div>
    )
}
        