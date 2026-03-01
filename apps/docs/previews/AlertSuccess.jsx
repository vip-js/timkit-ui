import { Alert } from "@timui/react";

export default function AlertSuccess() {
    return (
        <Alert variant="default" className="max-w-2xl mx-auto mt-12 border-l-4 border-l-green-500 bg-green-50 text-green-600">
            <Alert.Title>Success</Alert.Title>
            <Alert.Description>
                Team member has been added successfully.
            </Alert.Description>
        </Alert>
    )
}
        