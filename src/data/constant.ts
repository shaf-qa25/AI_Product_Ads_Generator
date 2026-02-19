export interface Suggestion {
    id: number;
    title: string;
    prompt: string;
    icon: string;
}

export const SUGGESTIONS: Suggestion[] = [
    {
        id: 1,
        title: "Quantum Physics",
        prompt: "Explain Quantum Physics like I'm five with a focus on wave-particle duality.",
        icon: "⚛️"
    },
    {
        id: 2,
        title: "React Hooks",
        prompt: "Create a comprehensive guide on useEffect and useMemo hooks in React.",
        icon: "🪝"
    },
    {
        id: 3,
        title: "Machine Learning",
        prompt: "Summarize the core concepts of supervised vs unsupervised learning.",
        icon: "🤖"
    },
    {
        id: 4,
        title: "AWS Deployment",
        prompt: "Step-by-step guide to deploy a Next.js app on AWS S3 and CloudFront.",
        icon: "☁️"
    },
    {
        id: 5,
        title: "System Design",
        prompt: "Explain the basics of Load Balancing and Horizontal Scaling for backend systems.",
        icon: "🏗️"
    },
];