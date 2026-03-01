import { Alert } from "@timui/react";

export default function AlertDangerWithDescription() {
    return (
        <div className="max-w-5xl mx-auto mt-12 px-4 md:px-8">
            <Alert variant="destructive" className="p-4">
                <Alert.Title>Your account is blocked</Alert.Title>
                <Alert.Description className="mt-2 sm:text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Alert.Description>
            </Alert>
        </div>
    )
}
        