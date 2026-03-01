import { Alert } from "@timui/react";

export default function AlertWarning() {
    return (
        <Alert variant="default" className="max-w-2xl mx-auto mt-12 bg-amber-50 text-amber-600">
            <Alert.Title>Warning</Alert.Title>
            <Alert.Description>
                Manage your team members permissions from your <a className="underline" href="javascript:void(0)">dashboard</a>
            </Alert.Description>
        </Alert>
    )
}
        