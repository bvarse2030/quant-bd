/*
|-----------------------------------------
| setting up GenerateToomanyRequest for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const generateTooManyRequestComponent = (): string => {
  return `
    import { motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'

interface TooManyRequestsProps {
    message?: string
    retrySeconds?: number
}

const TooManyRequests: React.FC<TooManyRequestsProps> = ({
    message = 'Too many requests. Please try again later.',
    retrySeconds = 30,
}) => {
    const [countdown, setCountdown] = useState(retrySeconds)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleRetry = () => window.location.reload()

    const containerVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
    }

    const pulseVariants = {
        initial: { scale: 1 },
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 2,
            } as const,
        },
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <motion.div
                className="w-full max-w-md"
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="bg-red-50 px-6 py-4 flex items-center justify-center">
                        <motion.div
                            variants={pulseVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <svg
                                className="w-12 h-12 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </motion.div>
                    </div>
                    <div className="px-6 py-8">
                        <motion.h3
                            className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {message}
                        </motion.h3>
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-red-400 rounded-full"
                                    initial={{ width: '100%' }}
                                    animate={{
                                        width: \`\${(countdown / retrySeconds) * 100}%\`,
                                    }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={handleRetry}
                                    disabled={countdown > 0}
                                    className={\`cursor-pointer px-6 py-3 rounded-lg text-white font-medium transition-all duration-150 transform hover:scale-105 \${
                                        countdown > 0
                                            ? 'bg-gray-400 cursor-text'
                                            : 'bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg'
                                    }\`}
                                >
                                    {countdown > 0
                                        ? \`Retry in \${countdown}s\`
                                        : 'Try Again'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 text-sm text-center text-gray-500">
                        If the problem persists, please contact support.
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default TooManyRequests

`;
};
