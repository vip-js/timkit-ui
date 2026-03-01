import { Alert } from "@timui/react";

export default function AlertWarningWithBorder() {
    return (
        <div className="max-w-5xl mx-auto mt-12 px-4 md:px-8">
            <Alert variant="warning" className="p-4">
                <Alert.Title>Bandwidth is up to 300GB</Alert.Title>
                <Alert.Description>
                    <p className="mt-2 sm:text-sm">
                        Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <a href="javascript:void(0)" className="underline font-medium hover:text-yellow-700">et dolore magna aliqua.</a>
                    </p>
                </Alert.Description>
            </Alert>
        </div>
    )
}
        