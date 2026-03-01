import React from "react";
import { Card, CardContent } from "@timui/react";

export default function Page404PageWithLogo() {
    return (
        <main>
            <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
                <Card className="max-w-lg mx-auto text-center bg-transparent border-0 shadow-none">
                    <CardContent className="p-0">
                        <div className="pb-6">
                            <img src="https://timkit-ui.com/logo.svg" width={150} className="mx-auto" />
                        </div>
                        <h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">
                            Page not found
                        </h3>
                        <p className="text-gray-600 mt-3">
                            Sorry, the page you are looking for could not be found or has been removed.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
        