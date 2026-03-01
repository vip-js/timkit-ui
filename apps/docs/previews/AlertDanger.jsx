import { Alert } from "@timui/react";

export default function AlertDanger() {
    return (
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-12">
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>
                Sorry something wrong happened, please enter a correct email.
            </Alert.Description>
        </Alert>
    )
}
        