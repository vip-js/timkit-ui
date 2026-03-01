import { Alert } from "@timui/react";

export default function AlertSuccessWithLink() {
    return (
        <div className="max-w-5xl mx-auto mt-12 px-4 md:px-8">
            <Alert variant="success" className="p-4">
                <Alert.Title>Successfully updated</Alert.Title>
                <Alert.Description>
                    <p className="mt-2 sm:text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <div className="mt-2">
                        <a
                            href="javascript:void(0)"
                            className="inline-flex items-center font-medium hover:underline sm:text-sm">
                            Details
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </Alert.Description>
            </Alert>
        </div>
    )
}
        