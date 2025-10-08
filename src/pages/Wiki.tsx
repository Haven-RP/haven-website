import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import pageBg from "@/assets/page-bg.png";
import { BookOpen, ExternalLink } from "lucide-react";

const Wiki = () => {
    // Replace this with your actual Notion page URL
    const notionPageUrl = "https://havenrp.notion.site";

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${pageBg})` }}
        >
            <div className="relative z-10">
                <Navigation />
                <main className="container mx-auto px-4 pt-32 pb-20">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                HavenRP Wiki
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Your complete guide to HavenRP gameplay, lore, and community resources
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <Card className="bg-card/90 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Getting Started
                                    </CardTitle>
                                    <CardDescription>New player guides</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={notionPageUrl} target="_blank" rel="noopener noreferrer">
                                            View Guide
                                            <ExternalLink className="w-4 h-4 ml-2" />
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/90 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Game Mechanics
                                    </CardTitle>
                                    <CardDescription>How systems work</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={notionPageUrl} target="_blank" rel="noopener noreferrer">
                                            Learn More
                                            <ExternalLink className="w-4 h-4 ml-2" />
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/90 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Server Lore
                                    </CardTitle>
                                    <CardDescription>Story & background</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={notionPageUrl} target="_blank" rel="noopener noreferrer">
                                            Explore Lore
                                            <ExternalLink className="w-4 h-4 ml-2" />
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Notion Embed */}
                        <Card className="bg-card/90 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Wiki Documentation</CardTitle>
                                        <CardDescription>Powered by Notion</CardDescription>
                                    </div>
                                    <Button variant="outline" asChild>
                                        <a href={notionPageUrl} target="_blank" rel="noopener noreferrer">
                                            Open in Notion
                                            <ExternalLink className="w-4 h-4 ml-2" />
                                        </a>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="relative w-full" style={{ paddingBottom: "75%", minHeight: "600px" }}>
                                    <iframe
                                        src={notionPageUrl}
                                        className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                                        title="HavenRP Wiki"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Setup Instructions */}
                        <div className="bg-muted/50 backdrop-blur-sm border border-border rounded-lg p-6">
                            <h3 className="font-semibold mb-3">How to set up your Notion Wiki:</h3>
                            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                                <li>Create a Notion page for your wiki</li>
                                <li>Click "Share" in the top right of your Notion page</li>
                                <li>Toggle "Share to web" to make it publicly accessible</li>
                                <li>Copy the public URL</li>
                                <li>Update the <code className="bg-background px-1 rounded">notionPageUrl</code> variable in <code className="bg-background px-1 rounded">src/pages/Wiki.tsx</code></li>
                            </ol>
                            <p className="text-sm text-muted-foreground mt-4">
                                Current Notion URL: <code className="bg-background px-1 rounded">{notionPageUrl}</code>
                            </p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Wiki;
