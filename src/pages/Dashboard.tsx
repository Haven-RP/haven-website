import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import pageBg from "@/assets/page-bg.png";
import { Shield, Users, Crown, Star } from "lucide-react";

const Members = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Example Discord roles - in production, fetch from Discord API or store in DB
    const [userRoles, setUserRoles] = useState<string[]>([]);

    useEffect(() => {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (!session) {
                    navigate("/auth");
                } else {
                    // Example: Extract Discord roles from user metadata
                    // In production, you'd fetch this from Discord API or your database
                    const discordMetadata = session.user.user_metadata;
                    const roles = discordMetadata?.discord_roles || [];
                    setUserRoles(roles);
                }
                setLoading(false);
            }
        );

        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (!session) {
                navigate("/auth");
            } else {
                const discordMetadata = session.user.user_metadata;
                const roles = discordMetadata?.discord_roles || [];
                setUserRoles(roles);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const signOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    // Example role-checking function
    const hasRole = (roleName: string) => {
        return userRoles.includes(roleName);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${pageBg})` }}
        >
            <div className="relative z-10">
                <Navigation />
                <main className="container mx-auto px-4 pt-32 pb-20">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Welcome Section */}
                        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-display font-bold mb-2">
                                        Welcome, {user?.user_metadata?.full_name || "Member"}!
                                    </h1>
                                    <p className="text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                                <Button onClick={signOut} variant="outline">
                                    Sign Out
                                </Button>
                            </div>

                            {/* User Roles */}
                            <div className="flex gap-2 flex-wrap">
                                {userRoles.length > 0 ? (
                                    userRoles.map((role) => (
                                        <Badge key={role} variant="secondary">
                                            {role}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge variant="outline">Member</Badge>
                                )}
                            </div>
                        </div>

                        {/* General Member Content */}
                        <Card className="bg-card/90 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Member Resources
                                </CardTitle>
                                <CardDescription>Available to all authenticated members</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-border rounded-lg">
                                        <h3 className="font-semibold mb-2">Server Rules</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Review our community guidelines
                                        </p>
                                        <Button variant="outline" size="sm" onClick={() => navigate("/rules")}>
                                            View Rules
                                        </Button>
                                    </div>
                                    <div className="p-4 border border-border rounded-lg">
                                        <h3 className="font-semibold mb-2">Discord Community</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Join our active Discord server
                                        </p>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href="https://discord.gg/ghfpKz5pHw" target="_blank" rel="noopener noreferrer">
                                                Join Discord
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Staff-Only Section (Example Discord Role Gating) */}
                        {hasRole("Staff") || hasRole("Admin") ? (
                            <Card className="bg-card/90 backdrop-blur-sm border-primary/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-primary" />
                                        Staff Resources
                                    </CardTitle>
                                    <CardDescription>Only visible to Discord Staff members</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 border border-primary/30 rounded-lg bg-primary/5">
                                        <h3 className="font-semibold mb-2">Staff Dashboard</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Access staff tools and reports
                                        </p>
                                        <Button size="sm">Access Dashboard</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : null}

                        {/* Admin-Only Section (Example Discord Role Gating) */}
                        {hasRole("Admin") ? (
                            <Card className="bg-card/90 backdrop-blur-sm border-secondary/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Crown className="w-5 h-5 text-secondary" />
                                        Admin Panel
                                    </CardTitle>
                                    <CardDescription>Only visible to Discord Admins</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 border border-secondary/30 rounded-lg bg-secondary/5">
                                        <h3 className="font-semibold mb-2">Server Configuration</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Manage server settings and permissions
                                        </p>
                                        <Button variant="secondary" size="sm">Manage Settings</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : null}

                        {/* VIP Section (Example Discord Role Gating) */}
                        {hasRole("VIP") || hasRole("Supporter") ? (
                            <Card className="bg-card/90 backdrop-blur-sm border-accent/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-accent" />
                                        VIP Perks
                                    </CardTitle>
                                    <CardDescription>Exclusive benefits for supporters</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 border border-accent/30 rounded-lg bg-accent/5">
                                        <h3 className="font-semibold mb-2">Early Access Features</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Get early access to new content and features
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : null}

                        {/* Info Box */}
                        <div className="bg-muted/50 backdrop-blur-sm border border-border rounded-lg p-6">
                            <h3 className="font-semibold mb-2">Note about Discord Roles</h3>
                            <p className="text-sm text-muted-foreground">
                                This page demonstrates Discord role-based content gating. In production, you would:
                            </p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                                <li>Fetch Discord roles from Discord API after OAuth</li>
                                <li>Store roles in your database for faster access</li>
                                <li>Sync roles periodically to keep them updated</li>
                                <li>Use the <code className="bg-background px-1 rounded">hasRole()</code> function to conditionally render content</li>
                            </ul>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Members;
